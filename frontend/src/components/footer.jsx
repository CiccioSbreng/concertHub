export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="main-footer mt-4">
      <div className="container app-container d-flex flex-column flex-md-row align-items-center justify-content-between gap-2 py-2">

        <div className="footer-text">
          © {year} ConcertHub — Tutti i diritti riservati
        </div>

        <div className="footer-secondary">
          Realizzato con React e passione 🎵
        </div>



      </div>
    </footer>
  );
}
