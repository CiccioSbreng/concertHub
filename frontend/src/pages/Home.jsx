import { useEffect, useState } from "react";
import { searchEvents, toUtcStart, toUtcEnd } from "../lib/api";
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

  function update(p) {
    setForm((f) => ({ ...f, ...p }));
  }

  async function runSearch(page = 0) {
    setLoading(true);
    setError("");
    try {
      const res = await searchEvents({
        city: form.city,
        keyword: form.keyword,
        size: form.size,
        page,
        start: toUtcStart(form.start),
        end: toUtcEnd(form.end),
      });
      setData(res);
      setForm((f) => ({ ...f, page: res.page ?? page }));
    } catch (e) {
      setError("Nessun risultato o errore di rete.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    runSearch(0);
  }, []);

  return (
    <div className="container py-5 app-container">
      <form
        className="filters row g-2 align-items-end"
        onSubmit={(e) => {
          e.preventDefault();
          runSearch(0);
        }}
      >
        <div className="col-12 col-md-4">
          <label className="form-label">Città</label>
          <input
            className="form-control"
            value={form.city}
            onChange={(e) => update({ city: e.target.value })}
          />
        </div>

        <div className="col-12 col-md-4">
          <label className="form-label">Artista/Genere</label>
          <input
            className="form-control"
            value={form.keyword}
            onChange={(e) => update({ keyword: e.target.value })}
          />
        </div>

        <div className="col-6 col-md-2">
          <label className="form-label">Dal</label>
          <input
            type="date"
            className="form-control"
            value={form.start}
            onChange={(e) => update({ start: e.target.value })}
          />
        </div>

        <div className="col-6 col-md-2">
          <label className="form-label">Al</label>
          <input
            type="date"
            className="form-control"
            value={form.end}
            onChange={(e) => update({ end: e.target.value })}
          />
        </div>

        <div className="col-12 col-md-2">
          <button className="btn btn-primary w-100">Cerca</button>
        </div>
      </form>

      {loading && <p className="mt-3">Caricamento…</p>}
      {error && <p className="mt-3 text-danger">{error}</p>}

      {!loading && !error && data.events?.length === 0 && (
        <p className="mt-4 text-center no-events-text">
          🎵 Non ci sono eventi in programma al momento.
        </p>
      )}

      <div className="row row-cols-1 row-cols-md-3 g-3 mt-2">
        {data.events?.map((ev) => (
          <div className="col" key={ev.id}>
            <EventCard ev={ev} />
          </div>
        ))}
      </div>

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
