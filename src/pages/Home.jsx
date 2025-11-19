
import "./Home.scss";

import { ModuleCard } from "../Components/ModuleCard";


const modules = [
  { id: "sistemas", title: "Sistemas Informáticos", subtitle: "7 temas" },
  { id: "ingles", title: "Inglés", subtitle: "en progreso" },
];



export function Home() {

  return (
    <div className="page-container home-page">
      <header className="home-header">
        <h1 className="page-title">Módulos</h1>
        <p className="home-subtitle">
          Elegir los módulos disponibles con sus test
        </p>
      </header>

      <section className="home-modules">
        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            title={module.title}
            subtitle={module.subtitle}
            to={`/modulo/${module.id}`}
          />
        ))}
      </section>
    </div>
  );
}
