/** @format */

import { Link } from "react-router-dom";
import "./TopicCard.scss";

export function TopicCard({ id, title, numQuestion, to }) {
  return (
    <Link to={to} className="topic-card">
      <span className="topic-card__badge">{id}</span>
      <h3 className="topic-card__title">{title}</h3>
      <p className="topic-card__meta">{numQuestion}</p>
    </Link>
  );
}
