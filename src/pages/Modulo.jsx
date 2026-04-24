
import { useParams,useNavigate } from "react-router-dom";
import { TopicCard } from "../Components/TopicCard";
import { topicsByModule } from "../data/topicsByModule";
import { useAuth } from "../context/AuthContext";
import { readCompletions, readLastTestIncorrects } from "../storage/quizAppStorage";
import "./Modulo.scss"






export function Modulo() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { moduloId } = useParams();
  const topics = topicsByModule[moduloId] || [];
  const completions = readCompletions();
  const lastTestIncorrects = readLastTestIncorrects();

  return (
    <div className="page-container">
      <section className="module-page">
        <h1 className="page-title">Módulo: {moduloId.charAt(0).toUpperCase() + moduloId.slice(1)}</h1>
        <p>
          Tests de los temas con sus explicaciones a cada opcion para repasar y
          estudiar
        </p>

        <section className="module-topics">
          {topics.map((topic) => (
            <TopicCard
              key={topic.id}
              id={topic.id}
              title={topic.title}
              numQuestion={`${topic.numQuestion} preguntas`}
              attempts={completions?.[session?.username]?.[moduloId]?.[String(topic.id)] ?? 0}
              lastTestIncorrectCount={lastTestIncorrects?.[session?.username]?.[moduloId]?.[String(topic.id)] ?? 0}
              to={`/modulo/${moduloId}/${topic.id}`}
            />
          ))}
        </section>

        <button type="button" className="btn-back" onClick={() => navigate(-1)}>
          Volver atrás
        </button>
      </section>
    </div>
  );
}
