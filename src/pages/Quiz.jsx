/** @format */

import { useParams } from "react-router-dom";
import { getQuiz } from "../data/quizLoader";
import { useEffect, useState } from "react";
import { QuizQuestion } from "../Components/QuizQuestion";
import { QuizProgress } from "../Components/QuizProgress";
import "./Quiz.scss";

function resolveFolder(moduloId) {
  const map = {
    sistemas: "sistemas",
    sistemas2: "sistemas2",
  };
  return map[moduloId] ?? null;
}

export function Quiz() {
  const { moduloId, topicId } = useParams();

  const folder = resolveFolder(moduloId);
  const questions = folder ? getQuiz(folder, topicId) : null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [answerCorrect, setAnswerCorrect] = useState(0);
  const [hasAnsweredCurrent, setHasAnsweredCurrent] = useState(false);

  // IMPORTANTE: resetear todo al cambiar de módulo/tema
  useEffect(() => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setFeedback(null);
    setAnswerCorrect(0);
    setHasAnsweredCurrent(false);
  }, [moduloId, topicId]);

  // IMPORTANTE: no accedas a questions[currentIndex] si questions es null
  const currentQuestion = questions?.[currentIndex] ?? null;

  function handleOptionChange(optionKey) {
    if (hasAnsweredCurrent) return;
    setSelectedOption(optionKey);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!questions) return;
    if (hasAnsweredCurrent) return;
    if (!selectedOption) return;

    const question = questions[currentIndex];
    if (!question) return;

    const correctArray = Array.isArray(question.respuesta_correcta)
      ? question.respuesta_correcta
      : [];

    const isCorrect = correctArray.includes(selectedOption);

    if (isCorrect) {
      setFeedback("✔ Has respondido correctamente");
      setAnswerCorrect((prev) => prev + 1);
    } else {
      setFeedback("✘ Te has equivocado");
    }

    setHasAnsweredCurrent(true);
  }

  function handleNext() {
    if (!questions) return;

    setCurrentIndex((prevIndex) => {
      if (prevIndex < questions.length - 1) return prevIndex + 1;
      return prevIndex;
    });

    setSelectedOption(null);
    setFeedback(null);
    setHasAnsweredCurrent(false);
  }

  function handleLess() {
    setCurrentIndex((prevIndex) => {
      if (prevIndex > 0) return prevIndex - 1;
      return prevIndex;
    });

    setSelectedOption(null);
    setFeedback(null);
    setHasAnsweredCurrent(false);
  }

  // Render seguro si no existe módulo o JSON
  if (!folder) {
    return <p>Módulo no soportado: {moduloId}</p>;
  }

  if (!questions) {
    return (
      <p>
        No existe: src/data/{folder}/{topicId}.json
      </p>
    );
  }

  if (questions.length === 0) {
    return (
      <p>
        El test existe pero no tiene preguntas: {folder}/{topicId}
      </p>
    );
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

          <button
            onClick={handleNext}
            disabled={currentIndex >= questions.length - 1}>
            Siguiente
          </button>
        </section>
      </article>
    </div>
  );
}
