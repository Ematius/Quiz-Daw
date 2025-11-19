

import { useParams } from "react-router-dom";
import UT1_quiz from "../data/sistemas/UT1_quiz.json";
import UT2_quiz from "../data/sistemas/UT2_quiz.json";
import UT3_quiz from "../data/sistemas/UT3_quiz.json";
import UT4_quiz from "../data/sistemas/UT4_quiz.json";
import UT5_quiz from "../data/sistemas/UT5_quiz.json";
import UT6_quiz from "../data/sistemas/UT6_quiz.json";
import UT7_quiz from "../data/sistemas/UT7_quiz.json";
import { useState } from "react";
import { QuizQuestion } from "../Components/QuizQuestion";
import { QuizProgress } from "../Components/QuizProgress";
import "./Quiz.scss";

const QUIZ = {
  UT1: UT1_quiz,
  UT2: UT2_quiz,
  UT3: UT3_quiz,
  UT4: UT4_quiz,
  UT5: UT5_quiz,
  UT6: UT6_quiz,
  UT7: UT7_quiz,
};

export function Quiz() {
  const { moduloId, topicId } = useParams();

  const questions = QUIZ[topicId] || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuestion = questions[currentIndex];

  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const [answerCorrect, setAnswerCorrect] = useState(0);

  const [hasAnsweredCurrent, setHasAnsweredCurrent] = useState(false);

  function handleOptionChange(optionKey) {
    setSelectedOption(optionKey);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (hasAnsweredCurrent) return;

    if (!selectedOption) return;

    const question = questions[currentIndex];
    if (!question) return;

    const isCorrect = question.respuesta_correcta.includes(selectedOption);

    if (isCorrect) {
      setFeedback("✔ Has respondido correctamente");
      setAnswerCorrect((prev) => prev + 1);

    } else {
      setFeedback("✘ Te has equivocado");
    }
    setHasAnsweredCurrent(true);

  }

  function handleNext() {
    setCurrentIndex((prevIndex) => {
      if (prevIndex < questions.length - 1) {
        return prevIndex + 1;
      }
      return prevIndex;
    });
    setSelectedOption(null);
    setFeedback(null);
    setHasAnsweredCurrent(false);
  }

  function handleLess() {
    setCurrentIndex((prevIndex) => {
      if (prevIndex > 0) {
        return prevIndex - 1;
      }
      return prevIndex;
    });
    setSelectedOption(null);
    setFeedback(null);
    setHasAnsweredCurrent(false);
  }

  return (
    <div className="page-container">
      <article className="quiz">
        <section className="quiz-header">
          <h1>Quiz</h1>
          <p>Módulo: {moduloId}</p>
          <p>Tema: {topicId}</p>
        </section>

        <QuizProgress
          index={currentIndex}
          total={questions.length}
          correctCount={answerCorrect}
        />

        <QuizQuestion
          question={currentQuestion}
          selectedOption={selectedOption}
          feedback={feedback}
          onOptionChange={handleOptionChange}
          onSubmit={handleSubmit}
          hasAnsweredCurrent={hasAnsweredCurrent}
        />

        <section className="quiz-button">
          <button onClick={handleLess} disabled={currentIndex === 0}>
            Anterior
          </button>
          <button onClick={handleNext} disabled={currentIndex === -1}>
            Siguiente
          </button>
        </section>
      </article>
    </div>
  );
}
