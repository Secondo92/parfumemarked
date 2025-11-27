// src/pages/ListingDetailPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useListings } from "../hooks/useListings";
import { AppOutletContext } from "../types/context";
import { ChatMessage, Listing } from "../types";
import {
  getChatRoomId,
  listenToChatMessages,
  sendChatMessage,
} from "../services/chatService";
import {
  toggleListingStatus,
  deleteListing,
} from "../services/listingsService";
import {
  Eye,
  EyeOff,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Send,
  Tag,
  CheckCircle,
  CircleOff,
} from "lucide-react";

const ListingDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userId, profile } = useOutletContext<AppOutletContext>();
  const { listings, appId } = useListings();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatError, setChatError] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");

  const listing = useMemo(
    () => listings.find((l) => l.id === id),
    [listings, id]
  );
  const images =
  listing?.images && listing.images.length > 0
    ? listing.images
    : [listing?.img ?? null];


  const [activeIndex, setActiveIndex] = useState(0);

  const activeImg = images[activeIndex] ??
    `https://placehold.co/600x600/8672ff/ffffff?text=${listing?.type ?? ""}`;

  const isSeller = listing && userId === listing.sellerId;

  // Chat subscription
  useEffect(() => {
    if (!listing || !userId) return;

    const chatId = getChatRoomId(listing.id, userId, listing.sellerId);

    const unsub = listenToChatMessages(
      appId,
      chatId,
      (msgs) => {
        setMessages(msgs);
        setChatError(null);
      },
      (err) => {
        console.error("Chat fejl", err);
        setChatError("Kunne ikke hente chatbeskeder.");
      }
    );

    return () => unsub();
  }, [listing, userId, appId]);

  const handleSend = async () => {
    if (!chatInput.trim() || !profile || !listing) return;

    await sendChatMessage({
      appId,
      listing,
      text: chatInput,
      buyerId: userId!,
      buyerName: profile.username,
      sellerId: listing.sellerId,
      senderId: userId!,
      senderName: profile.username,
    });

    setChatInput("");
  };

  if (!listing) {
    return (
      <div className="p-6 text-center text-gray-500">
        Opslag ikke fundet.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LEFT: Listing content */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-xl">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold">{listing.title}</h1>

            {isSeller && (
              <button
                onClick={() =>
                  toggleListingStatus(appId, listing.id, listing.isActive)
                }
                className="flex items-center gap-2 p-2 rounded bg-gray-100"
              >
                {listing.isActive ? (
                  <EyeOff size={18} className="text-orange-500" />
                ) : (
                  <Eye size={18} className="text-green-500" />
                )}
                {listing.isActive ? "Gør inaktiv" : "Gør aktiv"}
              </button>
            )}
          </div>

          {/* Main image */}
          <img
            src={activeImg as string}
            className="w-full h-96 object-cover rounded-xl mt-4"
          />

          {/* Image thumbnails */}
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {images.map((src, idx) => (
              <img
                key={idx}
                src={
                  src ??
                  `https://placehold.co/200x200/8672ff/ffffff?text=${listing.type}`
                }
                onClick={() => setActiveIndex(idx)}
                className={`w-20 h-20 rounded-lg cursor-pointer border ${
                  activeIndex === idx
                    ? "border-indigo-500 shadow"
                    : "border-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Price and seller */}
          <div className="flex justify-between items-center mt-6 border-b pb-4">
            <div>
              <p className="text-gray-500 text-sm">Sælger</p>
              <p
                className="font-semibold text-indigo-600 cursor-pointer"
                onClick={() => navigate(`/user/${listing.sellerId}`)}
              >
                {listing.sellerName}
              </p>
            </div>

            <div className="text-right">
              <p className="text-gray-500 text-sm">Pris</p>
              <p className="text-3xl font-bold">{listing.price} DKK</p>
            </div>
          </div>

          {/* Extra details */}
          <div className="mt-6">
            <span className="inline-flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
              <Tag size={16} className="mr-2" />
              {listing.type}
            </span>

            <span
              className={`inline-flex ml-3 items-center px-3 py-1 rounded-full text-sm ${
                listing.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {listing.isActive ? (
                <CheckCircle size={16} className="mr-2" />
              ) : (
                <CircleOff size={16} className="mr-2" />
              )}
              {listing.isActive ? "Til salg" : "Inaktiv"}
            </span>
          </div>

          {isSeller && (
            <button
              onClick={() => {
                if (window.confirm("Slet opslag permanent?")) {
                  deleteListing(appId, listing.id);
                  navigate("/profile");
                }
              }}
              className="flex items-center gap-2 text-red-600 mt-8"
            >
              <Trash2 size={18} />
              Slet opslag permanent
            </button>
          )}
        </div>

        {/* RIGHT: Chat */}
        <div className="bg-white rounded-xl shadow-xl flex flex-col h-[70vh]">
          <div className="p-4 border-b">
            <h3 className="text-xl font-bold">
              Chat med {listing.sellerName}
            </h3>
          </div>

          {/* Chat list */}
          <div className="flex-grow p-4 space-y-3 overflow-y-auto bg-gray-50">
            {messages.map((m) => {
              const mine = m.senderId === userId;

              return (
                <div
                  key={m.id}
                  className={`flex ${mine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-4 py-2 rounded-xl max-w-xs shadow ${
                      mine
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-tl-none border"
                    }`}
                  >
                    <p className="text-sm">{m.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat input */}
          <div className="p-4 border-t flex gap-2">
            <input
              className="flex-grow border p-2 rounded-lg"
              placeholder="Skriv besked..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button
              onClick={handleSend}
              className="bg-indigo-600 text-white p-3 rounded-lg"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      <footer className="mt-16 text-center text-gray-500 text-sm">
        &copy; 2025 DuftBasen
      </footer>
    </div>
  );
};

export default ListingDetailPage;
