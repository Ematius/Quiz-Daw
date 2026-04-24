

import { Link } from "react-router-dom";
import "./TopicCard.scss";

export function TopicCard({
  id,
  title,
  numQuestion,
  to,
  attempts = 0,
  lastTestIncorrectCount = 0,
}) {
  return (
    <Link to={to} className="topic-card">
      <span className="topic-card__badge">{id}</span>
      <h3 className="topic-card__title">{title}</h3>
      <p className="topic-card__meta">{numQuestion}</p>
      <p className="topic-card__meta">Hecho {attempts} veces</p>
      <p className="topic-card__meta">
        En el ultimo test: {lastTestIncorrectCount} incorrectas
      </p>
    </Link>
  );
}
