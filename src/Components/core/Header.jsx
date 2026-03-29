

import { Link, useNavigate } from "react-router-dom";

import "./Header.scss";
import logo from "../../assets/logo.png";
import { useAuth } from "../../context/AuthContext";



export function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

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

        <nav className="app-header__actions" aria-label="Usuario y cuenta">
          {isAuthenticated && user ? (
            <>
              <span className="app-header__user-name">{user.name}</span>
              <Link to="/panel" className="btn-back app-header__btn">
                Panel personal
              </Link>
              <button
                type="button"
                className="btn-back app-header__btn"
                onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="btn-back app-header__btn">
              Entrar / crear cuenta
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
