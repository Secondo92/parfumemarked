// src/pages/SignupPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const SignupPage: React.FC = () => {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(email, password, username);
    navigate("/profile");
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-md bg-white shadow p-6 rounded-xl">
        <h1 className="text-2xl font-bold text-center mb-4">Opret konto</h1>

        <form className="space-y-4" onSubmit={submit}>
          <input className="input" placeholder="Brugernavn"
            value={username} onChange={(e) => setUsername(e.target.value)} />

          <input className="input" placeholder="Email"
            value={email} onChange={(e) => setEmail(e.target.value)} />

          <input className="input" placeholder="Password" type="password"
            value={password} onChange={(e) => setPassword(e.target.value)} />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button className="dark-button w-full py-2 rounded-lg" disabled={loading}>
            {loading ? "Opretter..." : "Opret konto"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
