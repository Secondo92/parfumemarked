// src/pages/ExternalProfilePage.tsx
import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useListings } from "../hooks/useListings";

const ExternalProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { listings } = useListings();

  const externalListings = useMemo(
    () =>
      listings.filter(
        (l) => l.sellerId === userId && l.isActive
      ),
    [listings, userId]
  );

  const externalUserName =
    externalListings.length > 0
      ? externalListings[0].sellerName
      : userId
      ? `Bruger ID: ${userId.substring(0, 8)}...`
      : "Bruger";

  const firstName = externalUserName.split(" ")[0];

  return (
    <div id="external-profile-page" className="p-4 md:p-6">
      <div className="bg-gradient-to-r from-gray-500 to-gray-400 h-48 rounded-t-xl mb-10" />

      <div className="max-w-4xl mx-auto -mt-36">
        <div className="bg-white p-6 rounded-xl shadow-2xl relative">
          <div className="flex items-end -mt-20">
            <div className="w-32 h-32 bg-gray-100 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
              <i data-lucide="user-check" className="w-12 h-12 text-gray-500" />
            </div>

            <div className="ml-6 flex-grow">
              <h2 className="text-3xl font-bold text-gray-900">
                {externalUserName}
              </h2>
              <p className="text-sm text-gray-500">Profil for anden bruger</p>
            </div>

            <div className="flex flex-col items-end text-right">
              <span className="text-xl font-extrabold text-[#8672ff]">
                {externalListings.length}
              </span>
              <span className="text-sm font-semibold text-gray-500 uppercase">
                Aktive opslag
              </span>
            </div>
          </div>

          <div className="mt-10 border-t pt-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Aktive opslag fra {firstName}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {externalListings.length > 0 ? (
                externalListings.map((post) => {
                  const imgSrc =
                    post.img ||
                    `https://placehold.co/400x400/8672ff/ffffff?text=${post.type}`;
                  return (
                    <div
                      key={post.id}
                      onClick={() => navigate(`/listing/${post.id}`)}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 cursor-pointer border border-gray-100"
                    >
                      <img
                        src={imgSrc}
                        alt={post.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-lg text-gray-900 truncate">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {post.type}
                        </p>
                        <p className="text-xl font-bold text-[#8672ff]">
                          {post.price} DKK
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/listing/${post.id}`);
                          }}
                          className="w-full mt-3 dark-button py-2 rounded-lg text-sm"
                        >
                          Se detaljer
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="col-span-3 text-center text-gray-500 text-lg py-12">
                  Denne bruger har ingen aktive opslag i øjeblikket.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-16 pt-8 text-center text-gray-500 text-sm border-t border-gray-200">
        &copy; 2025 DuftBasen
      </footer>
    </div>
  );
};

export default ExternalProfilePage;
