
import "./QuizProgress.scss";

export function QuizProgress({index,total,correctCount}){

    return (
      <section className="quiz-progress">
        <p>
          {index + 1}/{total}
        </p>
        <p>Preguntas acertadas: {correctCount}</p>
      </section>
    );
}