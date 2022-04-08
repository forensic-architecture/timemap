import React from "react";
import { marked } from "marked";

const fontSize = window.innerWidth > 1000 ? 14 : 18;

const Popup = ({
  content = [],
  styles = {},
  isOpen = true,
  onClose,
  title,
  theme = "light",
  isMobile = false,
  children,
}) => (
  <div>
    <div
      className={`infopopup ${isOpen ? "" : "hidden"} ${
        theme === "dark" ? "dark" : "light"
      } ${isMobile ? "mobile" : ""}`}
      style={{ ...styles, fontSize }}
    >
      <div className="legend-header">
        <button
          onClick={onClose}
          className="side-menu-burg over-white is-active"
        >
          <span />
        </button>
        <h2>{title}</h2>
      </div>
      {content.map((t, idx) => (
        <div key={idx} dangerouslySetInnerHTML={{ __html: marked(t) }} />
      ))}
      {children}
    </div>
  </div>
);

export default Popup;
