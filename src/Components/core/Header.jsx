

import { Link } from "react-router-dom";

import "./Header.scss";
import logo from "../../assets/logo.png";



export function Header() {
  return (
    <header className="app-header">
      <div className="page-container app-header__inner">
        <div className="app-header__brand">
          <Link to="/" className="app-header__logo">
          <img src={logo}  />
          </Link>

          <div className="app-header__text">
            <p className="app-header__title">Test Quiz</p>
            <p className="app-header__subtitle">
              Repasa los tests y estudia a la par
            </p>
          </div>
        </div>

      </div>
    </header>
  );
}
