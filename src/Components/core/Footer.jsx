
import "./Footer.scss";

export function Footer() {
  const year = new Date().getFullYear();

return (
  <footer className="app-footer">
    <div className="app-footer__text">
      <p>© {year} DAW Tests. Todos los derechos reservados.</p>
    </div>

    <div className="app-footer__social">
      <p>Creado y diseñado por Emad Kadyear</p>
      <a
        href="https://www.linkedin.com/in/emad-kadyear/"
        target="_blank"
        rel="noreferrer"
        aria-label="Perfil de Emad en LinkedIn">
        <img src="/linkedln.svg" alt="Logo LinkedIn" />
      </a>

      <a
        href="https://github.com/Ematius"
        target="_blank"
        rel="noreferrer"
        aria-label="Perfil de Emad en GitHub">
        <img src="/github.svg" alt="Logo GitHub" />
      </a>
    </div>
  </footer>
);

}
