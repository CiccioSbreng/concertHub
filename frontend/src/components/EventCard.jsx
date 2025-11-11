export default function EventCard({ ev }) {
  return (
    <div className="card h-100 shadow-sm border-0">
      {ev.image && <img src={ev.image} className="card-img-top" alt={ev.name} style={{objectFit:'cover', height:180}} />}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{ev.name}</h5>
        <p className="card-text mb-1"><strong>Quando:</strong> {ev.date ? new Date(ev.date).toLocaleString() : '—'}</p>
        <p className="card-text text-muted">{ev.venue} • {ev.city}</p>
        <div className="mt-auto">
          <a href={ev.url} target="_blank" rel="noreferrer" className="btn btn-outline-primary">Biglietti</a>
        </div>
      </div>
    </div>
  )
}
