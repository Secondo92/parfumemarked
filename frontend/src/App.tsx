import { useEffect, useState } from "react";

function App() {
  const [backendMessage, setBackendMessage] = useState<string>("Loader...");

  useEffect(() => {
    fetch("http://localhost:4000/api/health")
      .then((res) => res.json())
      .then((data) => {
        setBackendMessage(`${data.status} - ${data.message}`);
      })
      .catch((err) => {
        console.error(err);
        setBackendMessage("Kunne ikke få svar fra backend");
      });
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Parfume projekt</h1>
      <p>Backend svar: {backendMessage}</p>
    </div>
  );
}

export default App;
