
import "./Footer.scss";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="page-container app-footer__inner">
        <p className="app-footer__copy">
          © {year} DAW Tests. Todos los derechos reservados.
        </p>

        <p className="app-footer__note">
          Proyecto personal de estudio — React, TypeScript/JavaScript y SCSS.
        </p>
      </div>
    </footer>
  );
}
