import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Header() {
  const navigate = useNavigate();

  return (
    <div style={{ marginBottom: "1rem" }}>

      {/* Øverste linje: titel */}
      <div
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "1rem",
        }}
      >
        Parfumemarked
      </div>

      {/* Nederste linje: knapper på én vandret linje */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          borderBottom: "1px solid #ddd",
          paddingBottom: "1rem",
        }}
      >
        <button
          onClick={() => navigate("/listings")}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "0.3rem",
            border: "1px solid #ccc",
            cursor: "pointer",
            background: "#f5f5f5",
            color: "black",
          }}
        >
          Marked
        </button>

        <button
          onClick={() => navigate("/listings")}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "0.3rem",
            border: "1px solid #ccc",
            cursor: "pointer",
            background: "#f5f5f5",
            color: "black",
          }}
        >
          Opret annonce
        </button>

        <button
          onClick={() => navigate("/profile")}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "0.3rem",
            border: "1px solid #ccc",
            cursor: "pointer",
            background: "#f5f5f5",
            color: "black",
          }}
        >
          Min profil
        </button>
      </div>
    </div>
  );
}

export default Header;
