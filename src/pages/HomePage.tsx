// src/pages/HomePage.tsx
import React, { useMemo, useState } from "react";
import { useListings } from "../hooks/useListings";
import ListingCard from "../components/listings/ListingCard";

type FilterType = "alle" | "Flaske" | "Decant" | "Split";

const HomePage: React.FC = () => {
  const { listings } = useListings();
  const [filter, setFilter] = useState<FilterType>("alle");
  const [search, setSearch] = useState("");

  const activeListings = useMemo(
    () => listings.filter((l) => l.isActive),
    [listings]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return activeListings.filter((l) => {
      if (filter !== "alle") {
        if (filter === "Flaske" && l.type !== "fullBottle") return false;
        if (filter === "Decant" && l.type !== "decant") return false;
        if (filter === "Split" && l.type !== "split") return false;
      }

      if (!q) return true;
      return (
        (l.title && l.title.toLowerCase().includes(q)) ||
        (l.description && l.description.toLowerCase().includes(q)) ||
        (l.sellerName && l.sellerName.toLowerCase().includes(q))
      );
    });
  }, [activeListings, filter, search]);

  const allCount = activeListings.length;
  const flaskerCount = activeListings.filter((l) => l.type === "fullBottle").length;
  const decantsCount = activeListings.filter((l) => l.type === "decant").length;
  const splitsCount = activeListings.filter((l) => l.type === "split").length;

  const getButtonClass = (f: FilterType) => {
    const isActive = filter === f;
    return isActive
      ? "dark-button"
      : "bg-gray-200 text-gray-700 hover:bg-gray-300 transition duration-150";
  };

  return (
    <div className="p-4 md:p-6">
      {/* Hero / søgning + filter */}
      <div className="py-12 bg-white rounded-lg shadow-lg mb-8">
        <div className="max-w-3xl mx-auto px-4">
          <input
            type="text"
            placeholder="Søg efter parfume, mærke..."
            className="search-input w-full p-4 text-lg border border-gray-200 rounded-xl focus:border-[#8672ff] mb-6"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex justify-center space-x-3">
            <button
              onClick={() => setFilter("alle")}
              className={`px-5 py-2 rounded-full ${getButtonClass("alle")}`}
            >
              Alle ({allCount})
            </button>
            <button
              onClick={() => setFilter("Flaske")}
              className={`px-5 py-2 rounded-full ${getButtonClass("Flaske")}`}
            >
              Flasker ({flaskerCount})
            </button>
            <button
              onClick={() => setFilter("Decant")}
              className={`px-5 py-2 rounded-full ${getButtonClass("Decant")}`}
            >
              Decants ({decantsCount})
            </button>
            <button
              onClick={() => setFilter("Split")}
              className={`px-5 py-2 rounded-full ${getButtonClass("Split")}`}
            >
              Splits ({splitsCount})
            </button>
          </div>
        </div>
      </div>

      {/* Grid af annoncer */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Opslag ({filtered.length})
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.length > 0 ? (
          filtered.map((l) => <ListingCard key={l.id} listing={l} />)
        ) : (
          <p className="col-span-4 text-center text-gray-500 text-lg py-12">
            Ingen aktive opslag matcher filteret i øjeblikket.
          </p>
        )}
      </div>

      <footer className="mt-16 pt-8 text-center text-gray-500 text-sm border-t border-gray-200">
        &copy; 2025 DuftBasen
      </footer>
    </div>
  );
};

export default HomePage;
