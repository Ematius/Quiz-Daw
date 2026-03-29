/** @format */

import { useState } from "react";
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import "./Auth.scss";

export function Auth() {
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  function handleEntrar(e) {
    e.preventDefault();
    setError("");
    const result = login(username);
    if (result.ok) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
  }

  function handleCrearCuenta(e) {
    e.preventDefault();
    setError("");
    const result = register(name, username);
    if (result.ok) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="page-container auth-page">
      <h1 className="page-title">Cuenta local</h1>
      <p className="auth-page__hint">
        Solo se guarda en este navegador. Sin contraseña ni servidor.
      </p>

      <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
        <label className="auth-form__label">
          Nombre
          <input
            type="text"
            className="auth-form__input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            placeholder="Tu nombre"
          />
        </label>
        <label className="auth-form__label">
          Usuario
          <input
            type="text"
            className="auth-form__input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            placeholder="Nombre de usuario único"
          />
        </label>

        {error && <p className="auth-form__error">{error}</p>}

        <div className="auth-form__actions">
          <button
            type="button"
            className="btn-back auth-form__btn"
            onClick={handleEntrar}>
            Entrar
          </button>
          <button
            type="button"
            className="btn-back auth-form__btn auth-form__btn--primary"
            onClick={handleCrearCuenta}>
            Crear cuenta
          </button>
        </div>
      </form>

      <Link to="/" className="auth-page__link">
        Volver al inicio
      </Link>
    </div>
  );
}
