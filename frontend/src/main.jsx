import React from "react";
import ReactDOM from "react-dom/client";
import App from "/src/App.jsx";  // <--- percorso assoluto, non relativo
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "/src/styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
