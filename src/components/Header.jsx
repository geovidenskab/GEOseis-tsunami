import React from "react";

const Header = ({ onBackToIntro }) => {
  return (
    <div className="header">
      <div className="header-content">
        <div className="title-section">
          <div className="app-icon">🌊</div>
          <div>
            <h1 className="app-title">GEO-tsunami</h1>
            <p className="app-subtitle">Tsunamivarsling og Risikovurdering</p>
          </div>
        </div>

        <div className="header-actions">
          {onBackToIntro && (
            <button
              onClick={onBackToIntro}
              style={{
                backgroundColor: "transparent",
                color: "#4A90E2",
                border: "1px solid #4A90E2",
                padding: "0.5rem 1rem",
                borderRadius: "5px",
                cursor: "pointer",
                marginRight: "1rem",
                fontSize: "0.9rem",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#4A90E2";
                e.target.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "#4A90E2";
              }}
            >
              ← Tilbage
            </button>
          )}

          {/* Diskrete knapper til de andre hjemmesider */}
          <div style={{ display: "flex", gap: "0.5rem", marginRight: "1rem" }}>
            <a
              href="https://geovidenskab.github.io/GEOseis_view/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: "transparent",
                color: "#2e7d32",
                border: "1px solid #2e7d32",
                padding: "0.4rem 0.8rem",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.8rem",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              GeoSeis-View
            </a>
            <a
              href="https://geovidenskab.github.io/epicenter/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: "transparent",
                color: "#1976d2",
                border: "1px solid #1976d2",
                padding: "0.4rem 0.8rem",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.8rem",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              GeoSeis-Epicenter
            </a>
          </div>

          <div className="version-info">
            <span className="version-text">v1.1</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
