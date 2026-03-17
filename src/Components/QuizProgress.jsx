
import "./QuizProgress.scss";

export function QuizProgress({ current, total, correctCount, pendingCount }){

    return (
      <section className="quiz-progress">
        <p>
          {current}/{total}
        </p>
        <p>Preguntas acertadas: {correctCount}</p>
        <p>Preguntas incorrectas en repaso: {pendingCount}</p>
        {pendingCount > 0 && <p>Repasando preguntas falladas</p>}
      </section>
    );
}