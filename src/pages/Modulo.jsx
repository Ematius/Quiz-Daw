
import { useParams } from "react-router-dom";
import { TopicCard } from "../Components/TopicCard";
import { topicsByModule } from "../data/topicsByModule";
import "./Modulo.scss"





export function Modulo() {
  const { moduloId } = useParams();
  const topics = topicsByModule[moduloId] || [];

  return (
    <div className="page-container">
      <section className="module-page">
        <h1 className="page-title">Módulo: {moduloId}</h1>
        <p>Tests de los temas con sus explicaciones a cada opcion para repasar y estudiar</p>

        <section className="module-topics">
          {topics.map((topic) => (
            <TopicCard
              key={topic.id}
              id={topic.id}
              title={topic.title}
              numQuestion={`${topic.numQuestion} preguntas`}
              to={`/modulo/${moduloId}/${topic.id}`}
            />
          ))}
        </section>
      </section>
    </div>
  );
}
