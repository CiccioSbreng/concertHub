// frontend/src/App.jsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import LoginPage from "./pages/login";
import FavoritesPage from "./pages/Favorites";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell d-flex flex-column min-vh-100">
        <Navbar />

        <main className="flex-grow-1">
          <Routes>
            {/* Home vera su /home */}
            <Route path="/home" element={<Home />} />

            {/* redirect da / a /home */}
            <Route path="/" element={<Navigate to="/home" replace />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />

            {/* tutto il resto → /home */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
