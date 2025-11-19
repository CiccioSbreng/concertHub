// frontend/src/pages/Login.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../lib/api";

export default function LoginPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const fn = mode === "login" ? loginUser : registerUser;
      await fn(email, password); // token e user vengono gestiti in api.js
      navigate("/");
    } catch (err) {
      setError(err.message || "Errore autenticazione");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-5 app-container" style={{ maxWidth: 480 }}>
      <h2 className="mb-3">
        {mode === "login" ? "Login" : "Registrazione"}
      </h2>

      <div className="btn-group mb-3">
        <button
          type="button"
          className={`btn btn-sm ${
            mode === "login" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setMode("login")}
        >
          Login
        </button>
        <button
          type="button"
          className={`btn btn-sm ${
            mode === "register" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setMode("register")}
        >
          Registrati
        </button>
      </div>

      <form onSubmit={handleSubmit} className="card p-3 bg-dark border-0">
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </div>

        {error && <p className="text-danger mb-2">{error}</p>}

        <button className="btn btn-primary w-100" disabled={loading}>
          {loading
            ? "Attendere..."
            : mode === "login"
            ? "Entra"
            : "Crea account"}
        </button>
      </form>
    </div>
  );
}
