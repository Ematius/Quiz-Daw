
import { useParams } from "react-router-dom";
import { TopicCard } from "../Components/TopicCard";
import "./Modulo.scss"


const topicsByModule = {
  sistemas: [
    {
      id: "UT1",
      title: "Explotación de sistemas microinformáticos",
      numQuestion: 30,
    },
    {
      id: "UT2",
      title: "Instalación de sistemas operativos y máquinas virtuales",
      numQuestion: 30,
    },
    {
      id: "UT3",
      title: "Gestión de la información",
      numQuestion: 30,
    },
    {
      id: "UT4",
      title: "Configuración de sistemas operativos",
      numQuestion: 30,
    },
    {
      id: "UT5",
      title: "Conexión de sistemas de red",
      numQuestion: 30,
    },
    {
      id: "UT6",
      title: "Gestión de recursos en una red",
      numQuestion: 30,
    },
    {
      id: "UT7",
      title: "Explotación de aplicaciones informáticas de propósito general",
      numQuestion: 30,
    },
    {
      id:"UT8",
      title: "Preguntas nuevas, que conviene estudiar",
      numQuestion: 41,
    },
  ],
};


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
