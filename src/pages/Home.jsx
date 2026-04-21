
import "./Home.scss";

import { ModuleCard } from "../Components/ModuleCard";


const modules = [
  { id: "sistemas", title: "Sistemas Informáticos", subtitle: "14 tests" },
  { id: "entornosDesarrollo", title: "Entornos de Desarrollo", subtitle: "14 tests" },
  { id: "ingles", title: "Inglés", subtitle: "3 temas" },
  {
    id: "baseDatos",
    title: "Base de datos",
    subtitle: "14 tests",
  },
  { id:"introduccionProgramacion", title: "Introducción a la programación", subtitle: "15 temas"},
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
