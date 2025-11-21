// frontend/src/pages/Home.jsx

import { useEffect, useState } from "react";
import { searchEvents, toUtcStart, toUtcEnd, addFavorite } from "../lib/api";
import EventCard from "../components/EventCard";

export default function Home() {
  const [form, setForm] = useState({
    city: "",
    keyword: "",
    start: "",
    end: "",
    size: 12,
    page: 0,
  });

  const [data, setData] = useState({ events: [], totalPages: 1, page: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [quickRange, setQuickRange] = useState(null); // "today" | "week" | "month" | null

  function update(p) {
    setForm((f) => ({ ...f, ...p }));
  }

  // helper per formattare una Date in "YYYY-MM-DD"
  function formatDate(d) {
    return d.toISOString().slice(0, 10);
  }

  // pulsanti rapidi per il periodo
  function applyQuickRange(id) {
    const now = new Date();
    let startDate = null;
    let endDate = null;

    if (id === "today") {
      startDate = now;
      endDate = now;
    } else if (id === "week") {
      // lunedì → domenica della settimana corrente
      const day = now.getDay(); // 0..6 (dom=0)
      const diffToMonday = (day + 6) % 7;
      const monday = new Date(now);
      monday.setDate(now.getDate() - diffToMonday);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      startDate = monday;
      endDate = sunday;
    } else if (id === "month") {
      const first = new Date(now.getFullYear(), now.getMonth(), 1);
      const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      startDate = first;
      endDate = last;
    }

    if (!startDate || !endDate) return;

    setQuickRange(id);
    setForm((f) => ({
      ...f,
      start: formatDate(startDate),
      end: formatDate(endDate),
      page: 0,
    }));
  }

  // 🔄 azzera completamente il filtro date e rilancia la ricerca
  function clearDates() {
    setQuickRange(null);
    const cleared = {
      ...form,
      start: "",
      end: "",
      page: 0,
    };
    setForm(cleared);
    runSearch(0, cleared); // uso il form "pulito" per la chiamata
  }

  // page = pagina, overrideForm = form opzionale (per casi come clearDates)
  async function runSearch(page = 0, overrideForm) {
    setLoading(true);
    setError("");
    setInfo("");

    const usedForm = overrideForm ?? { ...form, page };

    try {
      const res = await searchEvents({
        city: usedForm.city,
        keyword: usedForm.keyword,
        size: usedForm.size,
        page,
        start: toUtcStart(usedForm.start),
        end: toUtcEnd(usedForm.end),
      });

      // deduplica eventi con stesso id
      const seen = new Set();
      const uniqueEvents = [];
      for (const ev of res.events || []) {
        if (!seen.has(ev.id)) {
          seen.add(ev.id);
          uniqueEvents.push(ev);
        }
      }

      setData({
        ...res,
        events: uniqueEvents,
      });

      setForm((f) => ({ ...f, page: res.page ?? page }));
    } catch (e) {
      console.error(e);
      setError("Nessun risultato o errore di rete.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    runSearch(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAddFavorite(ev) {
    setError("");
    setInfo("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Devi effettuare il login per salvare i preferiti.");
      return;
    }

    try {
      await addFavorite({
        eventId: ev.id,
        name: ev.name,
        image: ev.image,
        date: ev.date,
        venue: ev.venue,
        city: ev.city,
        url: ev.url,
      });
      setInfo("Evento aggiunto ai preferiti.");
    } catch (e) {
      console.error(e);
      setError(e.message || "Errore nel salvataggio del preferito.");
    }
  }

  return (
    <div className="container py-5 app-container">
      <form
        className="filters row g-3 align-items-end"
        onSubmit={(e) => {
          e.preventDefault();
          runSearch(0);
        }}
      >
        {/* Città */}
        <div className="col-12 col-md-3">
          <label className="form-label">Città</label>
          <input
            className="form-control"
            value={form.city}
            onChange={(e) => update({ city: e.target.value })}
          />
        </div>

        {/* Artista / Genere */}
        <div className="col-12 col-md-3">
          <label className="form-label">Artista/Genere</label>
          <input
            className="form-control"
            value={form.keyword}
            onChange={(e) => update({ keyword: e.target.value })}
          />
        </div>

        {/* Quando: pulsanti rapidi + range date */}
        <div className="col-12 col-md-4">
          <label className="form-label">Quando</label>

          {/* Pulsanti rapidi */}
          <div className="quick-range-row mb-2">
            <button
              type="button"
              className={
                "quick-range-pill" + (quickRange === "today" ? " active" : "")
              }
              onClick={() => applyQuickRange("today")}
            >
              Oggi
            </button>
            <button
              type="button"
              className={
                "quick-range-pill" + (quickRange === "week" ? " active" : "")
              }
              onClick={() => applyQuickRange("week")}
            >
              Questa settimana
            </button>
            <button
              type="button"
              className={
                "quick-range-pill" + (quickRange === "month" ? " active" : "")
              }
              onClick={() => applyQuickRange("month")}
            >
              Questo mese
            </button>

            {/* reset date minimal */}
            <button
              type="button"
              className="quick-reset-icon"
              onClick={clearDates}
              title="Reset periodo"
            >
              🔁
            </button>
          </div>

          {/* Duo Dal / Al */}
          <div className="d-flex justify-content-between small mb-1">
            <span className="date-label">Dal</span>
            <span className="date-label">Al</span>
          </div>

          <div className="row g-2">
            <div className="col-6">
              <input
                type="date"
                className="form-control date-field"
                value={form.start}
                onChange={(e) => {
                  setQuickRange(null);
                  update({ start: e.target.value });
                }}
              />
            </div>
            <div className="col-6">
              <input
                type="date"
                className="form-control date-field"
                value={form.end}
                onChange={(e) => {
                  setQuickRange(null);
                  update({ end: e.target.value });
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottone Cerca */}
        <div className="col-12 col-md-2">
          <button className="btn btn-primary w-100">Cerca</button>
        </div>
      </form>

      {loading && <p className="mt-3">Caricamento…</p>}
      {error && <p className="mt-3 text-danger">{error}</p>}
      {info && !error && <p className="mt-3 text-success">{info}</p>}

      {/* Stato “nessun evento disponibile” */}
      {!loading && !error && data.events?.length === 0 && (
        <div className="text-center text-light py-5">
          <div className="mb-3">
            <span className="display-1 d-block">🎧</span>
          </div>
          <h4 className="mb-2">Nessun evento disponibile</h4>
          <p className="text-muted mb-0">
            Prova a cambiare città, data o parola chiave.
          </p>
        </div>
      )}

      {/* Griglia eventi */}
      {data.events?.length > 0 && (
        <div className="row row-cols-1 row-cols-md-3 g-3 mt-2">
          {data.events.map((ev) => (
            <div className="col" key={ev.id}>
              <EventCard ev={ev} onAddFavorite={() => handleAddFavorite(ev)} />
            </div>
          ))}
        </div>
      )}

      {data.totalPages > 1 && (
        <div className="d-flex align-items-center justify-content-between mt-3">
          <button
            className="btn btn-outline-secondary"
            disabled={form.page <= 0}
            onClick={() => runSearch(form.page - 1)}
          >
            « Precedente
          </button>

          <span className="small text-info-light">
            Pagina {form.page + 1} di {data.totalPages || 1}
          </span>

          <button
            className="btn btn-outline-secondary"
            disabled={form.page + 1 >= (data.totalPages || 1)}
            onClick={() => runSearch(form.page + 1)}
          >
            Successiva »
          </button>
        </div>
      )}
    </div>
  );
}
