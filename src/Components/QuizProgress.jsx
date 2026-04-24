
import "./QuizProgress.scss";

export function QuizProgress({ total, correctCount, pendingCount }){

    return (
      <section className="quiz-progress">
        <p>
          Preguntas acertadas: {correctCount + 1} /{total + 1}
        </p>
        <p>Preguntas incorrectas en repaso: {pendingCount}</p>
        {/* {pendingCount > 0 && <p>Repasando preguntas falladas</p>} */}
      </section>
    );
}