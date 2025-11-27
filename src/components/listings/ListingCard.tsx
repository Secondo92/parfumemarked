// src/components/listings/ListingCard.tsx
import React from "react";
import type { Listing } from "../../types";
import { useNavigate } from "react-router-dom";

interface ListingCardProps {
  listing: Listing;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const navigate = useNavigate();
  const imgSrc =
    listing.img ||
    `https://placehold.co/400x400/8672ff/ffffff?text=${listing.type}`;

  return (
    <div
      onClick={() => navigate(`/listing/${listing.id}`)}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 cursor-pointer"
    >
      <img
        src={imgSrc}
        alt={listing.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 truncate">
          {listing.title}
        </h3>
        <p
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/user/${listing.sellerId}`);
          }}
          className="text-sm text-gray-500 mb-2 cursor-pointer hover:underline"
        >
          Sælger: {listing.sellerName} ({listing.type})
        </p>
        <p className="text-xl font-bold text-[#8672ff]">{listing.price} DKK</p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/listing/${listing.id}`);
          }}
          className="w-full mt-3 dark-button py-2 rounded-lg text-sm"
        >
          Se detaljer
        </button>
      </div>
    </div>
  );
};

export default ListingCard;
