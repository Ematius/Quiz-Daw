
import "./QuizProgress.scss";

export function QuizProgress({ total, correctCount, pendingCount }){

    return (
      <section className="quiz-progress">
        <p>
          Preguntas acertadas: {correctCount}/{total}
        </p>
        <p>Preguntas incorrectas en repaso: {pendingCount}</p>
        {/* {pendingCount > 0 && <p>Repasando preguntas falladas</p>} */}
      </section>
    );
}