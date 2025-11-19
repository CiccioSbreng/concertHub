// frontend/src/components/footer.jsx

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="clean-footer">
      <div className="footer-inner">

        {/* Logo identico alla navbar */}
        <div className="footer-logo">
          Concert<span className="footer-logo-accent">Hub</span>
        </div>

        {/* Credito creatore */}
        <div className="footer-credit">
          Creato da <span className="footer-highlight">Ciccio Sbreng</span>
        </div>

        {/* Copyright */}
        <div className="footer-copy">
          © {year} ConcertHub · Tutti i diritti riservati
        </div>

      </div>
    </footer>
  );
}
