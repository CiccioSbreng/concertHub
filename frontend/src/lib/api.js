// frontend/src/lib/api.js

const BASE = 'http://localhost:4000';

// legge il token dal localStorage (per le API protette)
function getToken() {
  return localStorage.getItem('token');
}

// helper per querystring
function qs(obj) {
  const u = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') u.append(k, String(v));
  });
  return u.toString();
}

// helper date: inizio/fine giornata in UTC
export const toUtcStart = d => (d ? `${d}T00:00:00Z` : undefined);
export const toUtcEnd   = d => (d ? `${d}T23:59:59Z` : undefined);

// ---- TICKETMASTER: ricerca eventi ----
export async function searchEvents({ city, keyword, size = 12, page = 0, start, end }) {
  const url = `${BASE}/api/ticketmaster/events?${qs({
    city,
    keyword,
    size,
    page,
    start,
    end,
  })}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

// ---- PREFERITI: richiedono token nell'header ----

// GET /api/favorites
export async function getFavorites() {
  const token = getToken();

  const res = await fetch(`${BASE}/api/favorites`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('Errore caricamento preferiti');
  return res.json();
}

// POST /api/favorites
export async function addFavorite(event) {
  const token = getToken();

  const res = await fetch(`${BASE}/api/favorites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(event),
  });

  if (!res.ok) throw new Error('Errore salvataggio preferito');
  return res.json();
}

// DELETE /api/favorites/:id
export async function removeFavorite(id) {
  const token = getToken();

  const res = await fetch(`${BASE}/api/favorites/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('Errore eliminazione preferito');
  return res.json();
}
