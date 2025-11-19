// frontend/src/components/navbar.jsx

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    function handleAuthChange() {
      setToken(localStorage.getItem("token"));
    }

    window.addEventListener("auth-changed", handleAuthChange);
    return () => window.removeEventListener("auth-changed", handleAuthChange);
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-changed"));
  }

  return (
    <nav className="navbar main-navbar">
      <div className="container app-container d-flex align-items-center justify-content-between">
        {/* Logo / brand */}
        <Link to="/" className="navbar-brand">
          Concert<span className="brand-accent">Hub</span>
        </Link>

        <div className="d-flex align-items-center nav-actions">
          {/* Home (Mixer icon) */}
          <Link to="/Home" className="nav-pill nav-pill-ghost">
            <span className="nav-pill-icon">🎛️</span>
            <span className="nav-pill-label">Home</span>
          </Link>

          {/* Preferiti (Vinile) */}
          <Link to="/favorites" className="nav-pill nav-pill-ghost">
            <span className="nav-pill-icon">📀</span>
            <span className="nav-pill-label">Preferiti</span>
          </Link>

          {/* Login / Logout (Cuffie) */}
          {!token ? (
            <Link to="/login" className="nav-pill nav-pill-solid">
              <span className="nav-pill-icon">🎧</span>
              <span className="nav-pill-label">Login</span>
            </Link>
          ) : (
            <button
              type="button"
              className="nav-pill nav-pill-solid"
              onClick={handleLogout}
            >
              <span className="nav-pill-icon">🎧</span>
              <span className="nav-pill-label">Logout</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
