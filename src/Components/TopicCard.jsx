

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
  function calcularNota() {
    if(attempts === 0) {
      return "Test sin hacer";
    }
    return (((30 - lastTestIncorrectCount) / 30) * 10).toFixed(2);
  }
 

  return (
    <Link to={to} className="topic-card">
      <span className="topic-card__badge">{id}</span>
      <h3 className="topic-card__title">{title}</h3>
      <p className="topic-card__meta">{numQuestion}</p>
      <p className="topic-card__meta">Hecho {attempts} veces</p>
      <p className="topic-card__meta">
        En el ultimo test: {lastTestIncorrectCount} incorrectas
      </p>
      <p className="topic-card__meta">
      Nota: {calcularNota()}
      </p>
    </Link>
  );
}
