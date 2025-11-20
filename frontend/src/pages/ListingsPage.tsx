import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

type ListingType = "fullBottle" | "decant" | "split";

interface Listing {
  id: number;
  title: string;
  description: string;
  amount: number;
  price: number;
  type: ListingType;
  createdAt: string;
}

interface NewListingForm {
  title: string;
  description: string | null;
  amount: number | null;
  price: number | null;
  type: ListingType;
}

const listingTypeLabels: Record<ListingType, string> = {
  fullBottle: "Full bottle",
  decant: "Decant",
  split: "Split",
};

function ListingsPage() {
  const navigate = useNavigate();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<NewListingForm>({
    title: "",
    description: "",
    amount: null,
    price: null,
    type: "fullBottle",
  });

  async function fetchListings() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("http://localhost:4000/api/listings");
      if (!res.ok) {
        throw new Error("Kunne ikke hente listings");
      }
      const data: Listing[] = await res.json();
      setListings(data);
    } catch (err) {
      console.error(err);
      setError("Der skete en fejl under hentning af annoncer");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchListings();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (form.amount === null || isNaN(form.amount) || form.amount <= 0) {
      setError("Antal ml skal være større end 0");
      return;
    }

    if (form.price === null || isNaN(form.price) || form.price <= 0) {
      setError("Prisen skal være større end 0 kr");
      return;
    }

    try {
      setError(null);
      const res = await fetch("http://localhost:4000/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          amount: form.amount,
          price: form.price,
          type: form.type,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Kunne ikke oprette annonce");
      }

      const created: Listing = await res.json();

      setListings((prev) => [...prev, created]);

      setForm({
        title: "",
        description: "",
        amount: null,
        price: null,
        type: "fullBottle",
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ukendt fejl ved oprettelse");
    }
  }

  async function handleDelete(id: number) {
    try {
      setError(null);

      const res = await fetch(`http://localhost:4000/api/listings/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Kunne ikke slette annoncen");
      }

      setListings((prev) => prev.filter((l) => l.id !== id));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ukendt fejl ved sletning");
    }
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: 800 }}>
      <h1>Parfumemarked</h1>

      <section style={{ marginBottom: "2rem" }}>
        <h2>Opret ny annonce</h2>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            marginTop: "1rem",
          }}
        >
          <input
            type="text"
            placeholder="Titel*"
            value={form.title}
            onChange={(e) =>
              setForm((f) => ({ ...f, title: e.target.value }))
            }
            required
          />
          <textarea
            placeholder="Beskrivelse"
            value={form.description ?? ""}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                description: e.target.value === "" ? null : e.target.value,
              }))
            }
          />

          <input
            type="number"
            placeholder="Antal ml*"
            value={form.amount ?? ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, amount: Number(e.target.value) }))}
            required
          />
          <input
            type="number"
            placeholder="Pris i kroner*"
            value={form.price ?? ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, price: Number(e.target.value) }))}
            required
          />

          <select
            value={form.type}
            onChange={(e) =>
              setForm((f) => ({ ...f, type: e.target.value as ListingType }))
            }
          >
            <option value="fullBottle">Hel flaske</option>
            <option value="decant">Decant</option>
            <option value="split">Split</option>
          </select>

          <button type="submit">Opret annonce</button>
        </form>
      </section>

      <section>
        <h2>Annoncer</h2>

        {loading && <p>Henter annoncer …</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && listings.length === 0 && (
          <p>Ingen annoncer endnu</p>
        )}

        <ul style={{ listStyle: "none", padding: 0 }}>
          {[...listings].reverse().map((listing) => (
            <li
              key={listing.id}
              onClick={() => navigate(`/listing/${listing.id}`)}
              style={{
                border: "1px solid #ddd",
                padding: "1rem",
                marginBottom: "1rem",
                borderRadius: "0.5rem",
                cursor: "pointer",
              }}
            >
              <h3>{listing.title}</h3>
              <p>{listing.description}</p>
              <p>
                <strong>Pris:</strong> {listing.price} kr
              </p>
              <p>
                <strong>Mængde:</strong> {listing.amount} ml
              </p>
              <p>
                <strong>Type:</strong> {listingTypeLabels[listing.type]}
              </p>
              <small>
                Oprettet: {new Date(listing.createdAt).toLocaleString()}
              </small>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(listing.id);
                }}
                style={{
                  marginTop: "0.5rem",
                  background: "#c40000",
                  color: "white",
                  border: "none",
                  padding: "0.5rem",
                  borderRadius: "0.3rem",
                  cursor: "pointer",
                }}
              >
                Slet
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default ListingsPage;
