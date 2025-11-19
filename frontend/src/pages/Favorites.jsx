// frontend/src/pages/Favorites.jsx

import { useEffect, useState } from "react";
import { getFavorites, removeFavorite } from "../lib/api";
import { Link } from "react-router-dom";

export default function FavoritesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const res = await getFavorites();
        setItems(res);
      } catch (e) {
        setError(e.message || "Errore caricamento preferiti");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [token]);

  async function handleDelete(id) {
    try {
      await removeFavorite(id);
      setItems((prev) => prev.filter((f) => f._id !== id));
    } catch (e) {
      setError(e.message || "Errore eliminazione preferito");
    }
  }

  if (!token) {
    return (
      <div className="container py-5 app-container">
        <p>
          Devi effettuare il login per vedere i preferiti.{" "}
          <Link to="/login">Vai al login</Link>.
        </p>
      </div>
    );
  }

  return (
    <div className="container py-5 app-container">
      <h2 className="mb-4">I tuoi preferiti</h2>

      {loading && <p>Caricamento…</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && items.length === 0 && !error && (
        <p>Nessun evento nei preferiti.</p>
      )}

      <div className="row row-cols-1 row-cols-md-3 g-3 mt-2">
        {items.map((fav) => (
          <div className="col" key={fav._id}>
            <div className="card event h-100 border-0 appear">
              {fav.image && (
                <img
                  src={fav.image}
                  className="card-img-top"
                  alt={fav.name}
                  style={{ objectFit: "cover", height: 180 }}
                />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{fav.name}</h5>

                <p className="card-text mb-1">
                  <strong>Quando:</strong>{" "}
                  {fav.date ? new Date(fav.date).toLocaleString() : "—"}
                </p>

                <p className="card-text text-muted">
                  {fav.venue} • {fav.city}
                </p>

                <div className="mt-auto">
                  <div className="d-flex gap-2">
                    <a
                      href={fav.url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary w-100"
                    >
                      Biglietti
                    </a>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => handleDelete(fav._id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
