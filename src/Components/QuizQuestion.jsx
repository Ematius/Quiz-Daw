
import "./QuizQuestion.scss";

export function QuizQuestion({
  question,
  selectedOption,
  feedback,
  onOptionChange,
  onSubmit,
  hasAnsweredCurrent,
}) {
  if (!question) return <p>No hay preguntas</p>;

  return (
    <section className="quiz-question">
      <h2>{question.pregunta}</h2>

      <form onSubmit={onSubmit}>
        {question.opciones.map((opcion) => {
          const optionId = `option-${opcion.clave}`;
          const visibleLetter = opcion.displayLetter ?? opcion.clave;

          return (
            <div key={opcion.clave}>
              <input
                type="radio"
                id={optionId}
                name="groupOptions"
                value={opcion.clave}
                checked={selectedOption === opcion.clave}
                onChange={() => onOptionChange(opcion.clave)}
              />
              <label htmlFor={optionId}>
                {visibleLetter}) {opcion.texto}
              </label>
            </div>
          );
        })}

        <button type="submit" disabled={hasAnsweredCurrent || !selectedOption}>
          Comprobar respuesta
        </button>
      </form>

      <div className="card-explication">
        {feedback && (
          <div className="card-explication__feedback">
            <p
              className="card-explication__status"
              style={{
                color: feedback.startsWith("✔")
                  ? "#22c55e"
                  : "#ef4444",
                fontSize: "1.15rem",
                fontWeight: 700,
                textAlign: "center",
                width: "100%",
              }}
            >
              {feedback}
            </p>
            <p className="card-explication__intro">
              Explicación de las opciones:
            </p>
          </div>
        )}

        {feedback !== null &&
          question.explicacion.analisis_incorrectas.map((option) => (
            <div key={option.clave} className="analisis-opcion">
              <span className="analisis-opcion__badge">
                {question.displayLetterByKey?.[option.clave] ?? option.clave}
              </span>
              <p className="analisis-opcion__text">{option.motivo}</p>
            </div>
          ))}

        {feedback && (
          <div className="explicacion-detalle">
            <p className="explicacion-detalle__title">
              Explicaciones más en profundidad
            </p>

            <div className="explicacion-detalle__grid">
              <div className="explicacion-detalle__item">
                <h4>Temario</h4>
                <p>{question.explicacion.temario}</p>
              </div>
              <div className="explicacion-detalle__item">
                <h4>Resumen didáctico</h4>
                <p>{question.explicacion.resumen_didactico}</p>
              </div>
              <div className="explicacion-detalle__item">
                <h4>Ejemplo práctico</h4>
                <p>{question.explicacion.ejemplo_practico}</p>
              </div>
              <div className="explicacion-detalle__item">
                <h4>Conclusión final</h4>
                <p>{question.explicacion.conclusion_final}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
