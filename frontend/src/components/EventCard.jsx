// frontend/src/components/EventCard.jsx

export default function EventCard({ ev, onAddFavorite }) {
  return (
    <div className="card event h-100 border-0 appear">
      {ev.image && (
        <img
          src={ev.image}
          className="card-img-top"
          alt={ev.name}
          style={{ objectFit: "cover", height: 180 }}
        />
      )}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{ev.name}</h5>

        <p className="card-text mb-1">
          <strong>Quando:</strong>{" "}
          {ev.date ? new Date(ev.date).toLocaleString() : "—"}
        </p>

        <p className="card-text text-muted">
          {ev.venue} • {ev.city}
        </p>

        <div className="mt-auto">
          <div className="d-flex gap-2">
            <a
              href={ev.url}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary w-100"
            >
              Biglietti
            </a>

            {onAddFavorite && (
              <button
                type="button"
                className="btn btn-outline-light"
                onClick={onAddFavorite}
                title="Aggiungi ai preferiti"
              >
                ★
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
