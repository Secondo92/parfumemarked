// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const LoginPage: React.FC = () => {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    navigate("/");
  };

  return (
    <div className="flex justify-center items-center p-6">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow">
        <h1 className="text-xl font-bold mb-4">Log ind</h1>

        <form className="space-y-4" onSubmit={submit}>
          <input className="input" type="email" placeholder="Email"
            value={email} onChange={(e) => setEmail(e.target.value)} />

          <input className="input" type="password" placeholder="Kodeord"
            value={password} onChange={(e) => setPassword(e.target.value)} />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button disabled={loading} className="dark-button w-full rounded-lg py-2">
            {loading ? "Logger ind..." : "Log ind"}
          </button>
        </form>

        <p className="text-sm mt-4 text-center">
          Har du ingen konto?{" "}
          <span className="text-indigo-600 cursor-pointer" onClick={() => navigate("/signup")}>
            Opret bruger
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
