
// ModuleCard.jsx
import { Link } from "react-router-dom";
import "./ModuleCard.scss";

export function ModuleCard({ title, subtitle, to }) {
  return (
    <Link to={to} className="module-card">
      <div className="module-card__body">
        <h2 className="module-card__title">{title}</h2>
        <p className="module-card__subtitle">{subtitle}</p>
      </div>
      <span className="module-card__cta">Empezar módulo →</span>
    </Link>
  );
}
