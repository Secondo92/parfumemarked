import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import "bootstrap/dist/css/bootstrap.min.css";

function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`http://localhost:4000/api/listings/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Kunne ikke hente annonce");
        return res.json();
      })
      .then(setListing)
      .catch(() => setError("Kunne ikke hente annoncen"));
  }, [id]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!listing) return <p>Henter…</p>;

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: 800 }}>
        <Header />
      <button
        onClick={() => navigate("/listings")}
        style={{
          marginBottom: "1rem",
          background: "#ddd",
          padding: "0.5rem 1rem",
          border: "none",
          borderRadius: "0.3rem",
          cursor: "pointer",
        }}
      >
        Tilbage
      </button>

      <h1>{listing.title}</h1>
      <p>{listing.description}</p>
      <p><strong>Pris:</strong> {listing.price} kr</p>
      <p><strong>Mængde:</strong> {listing.amount} ml</p>
      <p><strong>Type:</strong> {listing.type}</p>

      <small>
        Oprettet: {new Date(listing.createdAt).toLocaleString()}
      </small>
    </div>
  );
}

export default ListingDetailPage;
