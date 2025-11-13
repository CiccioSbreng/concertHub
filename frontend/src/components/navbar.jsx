import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="main-navbar">
      <div className="container app-container d-flex align-items-center justify-content-between gap-3">
        <Link to="/" className="navbar-brand mb-0">
          ConcertHub
        </Link>

        <div className="nav-actions d-flex align-items-center gap-2">
          <button
            type="button"
            className="nav-pill nav-pill-ghost"
          >
            <span className="nav-pill-icon">★</span>
            <span className="nav-pill-label">Preferiti</span>
          </button>

          <button
            type="button"
            className="nav-pill nav-pill-solid"
          >
            <span className="nav-pill-label">Login</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
