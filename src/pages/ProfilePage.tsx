// src/pages/ProfilePage.tsx
import React, { useMemo } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useListings } from "../hooks/useListings";
import { toggleListingStatus, deleteListing } from "../services/listingsService";
import type { AppOutletContext } from "../types/context";
import type { Listing } from "../types";
import useAuth from "../hooks/useAuth";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { userId, profile } = useOutletContext<AppOutletContext>();
  const { listings, appId } = useListings();
  const { logout } = useAuth();

  const userListings = useMemo(
    () => listings.filter((l) => l.sellerId === userId),
    [listings, userId]
  );

  const activeCount = userListings.filter((l) => l.isActive).length;

  const handleToggleStatus = async (listing: Listing) => {
    if (
      !window.confirm(
        `Er du sikker på, at du vil ${
          listing.isActive ? "gøre opslaget inaktivt" : "gøre opslaget aktivt"
        }?\n\n"${listing.title}"`
      )
    ) {
      return;
    }
    try {
      await toggleListingStatus(appId, listing.id, listing.isActive);
    } catch (e) {
      console.error("Fejl ved opdatering af opslagsstatus", e);
    }
  };

  const handleDelete = async (listing: Listing) => {
    if (
      !window.confirm(
        `Er du sikker på, at du vil slette opslaget permanent?\n\n"${listing.title}"`
      )
    ) {
      return;
    }
    try {
      await deleteListing(appId, listing.id);
    } catch (e) {
      console.error("Fejl ved sletning af opslag", e);
    }
  };

  const handleLogoutClick = async () => {
    try {
      await logout();
      navigate("/");
    } catch (e) {
      console.error("Fejl ved log ud", e);
    }
  };

  return (
    <div id="profile-page" className="p-4 md:p-6">
      <div className="bg-gradient-to-r from-[#4c51bf] to-[#8672ff] h-48 rounded-t-xl mb-10" />

      <div className="max-w-4xl mx-auto -mt-36">
        <div className="bg-white p-6 rounded-xl shadow-2xl relative">
          <div className="flex items-end -mt-20">
            <div className="w-32 h-32 bg-gray-100 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
              <i data-lucide="user" className="w-12 h-12 text-gray-500" />
            </div>

            <div className="ml-6 flex-grow">
              <h2 className="text-3xl font-bold text-gray-900">
                {profile?.name ?? "Bruger"}
              </h2>
              {userId && (
                <p className="text-sm text-gray-500">
                  Bruger ID: {userId.substring(0, 8)}...
                </p>
              )}
            </div>

            <div className="flex flex-col items-end text-right">
              <span className="text-xl font-extrabold text-[#8672ff]">
                {activeCount}
              </span>
              <span className="text-sm font-semibold text-gray-500 uppercase">
                Aktive opslag
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 border-t pt-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                Indbakke
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-center">
                <p className="text-gray-600 mb-4">
                  Se alle dine beskeder og igangværende handler.
                </p>
                <button
                  onClick={() => navigate("/inbox")}
                  className="dark-button py-2 px-6 rounded-lg font-semibold"
                >
                  Gå til indbakke
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                Dine opslag ({userListings.length})
              </h3>
              {userListings.length > 0 ? (
                <div className="space-y-3">
                  {userListings.map((l) => (
                    <div
                      key={l.id}
                      className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm"
                    >
                      <div
                        className="flex-grow cursor-pointer"
                        onClick={() => navigate(`/listing/${l.id}`)}
                      >
                        <p className="font-medium text-gray-800">{l.title}</p>
                        <p className="text-xs text-gray-500">
                          {l.price} DKK ({l.type})
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <span
                          className={`text-xs font-semibold ${
                            l.isActive ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {l.isActive ? "AKTIV" : "INAKTIV"}
                        </span>
                        <button
                          onClick={() => handleToggleStatus(l)}
                          className={`p-1 rounded-full text-white ${
                            l.isActive
                              ? "bg-orange-500 hover:bg-orange-600"
                              : "bg-green-500 hover:bg-green-600"
                          }`}
                        >
                          <i
                            data-lucide={l.isActive ? "eye-off" : "eye"}
                            className="w-4 h-4"
                          />
                        </button>
                        <button
                          onClick={() => handleDelete(l)}
                          className="p-1 rounded-full bg-red-500 hover:bg-red-600 text-white"
                        >
                          <i data-lucide="trash-2" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-8 rounded-lg border border-gray-100 text-center">
                  <p className="text-gray-500 mb-4">Intet til salg endnu.</p>
                  <button
                    onClick={() => navigate("/create-sale")}
                    className="dark-button py-2 px-6 rounded-lg font-semibold"
                  >
                    Start et salg
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={handleLogoutClick}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Log ud
            </button>
          </div>
        </div>
      </div>

      <footer className="mt-16 pt-8 text-center text-gray-500 text-sm border-t border-gray-200">
        &copy; 2025 DuftBasen
      </footer>
    </div>
  );
};

export default ProfilePage;
