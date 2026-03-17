

import { useParams, useNavigate } from "react-router-dom";

import { getQuiz } from "../data/quizLoader";
import { useEffect, useState } from "react";
import { QuizQuestion } from "../Components/QuizQuestion";
import { QuizProgress } from "../Components/QuizProgress";
import "./Quiz.scss";

function resolveFolder(moduloId) {
  const map = {
    sistemas: "sistemas",
    sistemas2: "sistemas2",
    baseDatos: "baseDatos",
  };
  return map[moduloId] ?? null;
}


export function Quiz()
{
  const { moduloId, topicId } = useParams();
  const navigate = useNavigate();

  const folder = resolveFolder(moduloId);
  const questions = folder ? getQuiz(folder, topicId) : null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [roundQuestionIndexes, setRoundQuestionIndexes] = useState([]);
  const [pendingQuestionIndexes, setPendingQuestionIndexes] = useState([]);
  const [solvedQuestionIndexes, setSolvedQuestionIndexes] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [answerCorrect, setAnswerCorrect] = useState(0);
  const [hasAnsweredCurrent, setHasAnsweredCurrent] = useState(false);


  useEffect(() => {
    setCurrentIndex(0);
    setRoundQuestionIndexes(
      Array.isArray(questions) ? questions.map((_, idx) => idx) : []
    );
    setPendingQuestionIndexes([]);
    setSolvedQuestionIndexes([]);
    setQuizFinished(false);
    setSelectedOption(null);
    setFeedback(null);
    setAnswerCorrect(0);
    setHasAnsweredCurrent(false);
  }, [moduloId, topicId]);

  useEffect(() => {
    setAnswerCorrect(solvedQuestionIndexes.length);
  }, [solvedQuestionIndexes]);


  const roundLength = roundQuestionIndexes.length;
  const originalIndex =
    roundLength > 0 ? roundQuestionIndexes[currentIndex] : null;
  const currentQuestion =
    questions && originalIndex !== null ? questions?.[originalIndex] ?? null : null;

  function handleOptionChange(optionKey) {
    if (hasAnsweredCurrent) return;
    setSelectedOption(optionKey);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!questions) return;
    if (hasAnsweredCurrent) return;
    if (!selectedOption) return;

    const idxInOriginal =
      roundLength > 0 ? roundQuestionIndexes[currentIndex] : null;
    if (idxInOriginal === null) return;

    const question = questions[idxInOriginal];
    if (!question) return;

    const correctArray = Array.isArray(question.respuesta_correcta)
      ? question.respuesta_correcta
      : [];

    const isCorrect = correctArray.includes(selectedOption);

    if (isCorrect) {
      setFeedback("✔ Has respondido correctamente");
      setPendingQuestionIndexes((prev) => prev.filter((x) => x !== idxInOriginal));
      setSolvedQuestionIndexes((prev) => {
        if (prev.includes(idxInOriginal)) return prev;
        return [...prev, idxInOriginal];
      });
    } else {
      setFeedback("✘ Te has equivocado");
      setPendingQuestionIndexes((prev) => {
        if (prev.includes(idxInOriginal)) return prev;
        if (solvedQuestionIndexes.includes(idxInOriginal)) return prev;
        return [...prev, idxInOriginal];
      });
    }

    setHasAnsweredCurrent(true);
  }

  function handleNext() {
    if (!questions) return;
    if (quizFinished) return;
    if (!hasAnsweredCurrent) return;

    const lastIndexInRound = roundLength - 1;
    if (currentIndex < lastIndexInRound) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      const nextRound = pendingQuestionIndexes;
      if (nextRound.length > 0) {
        setRoundQuestionIndexes(nextRound);
        setCurrentIndex(0);
      } else {
        setQuizFinished(true);
      }
    }

    setSelectedOption(null);
    setFeedback(null);
    setHasAnsweredCurrent(false);
  }

  function handleLess() {
    // Navegación hacia atrás desactivada por consistencia del flujo de dominio
    return;
  }


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

  if (quizFinished) {
    return (
      <div className="page-container">
        <article className="quiz">
          <section className="quiz-header">
            <h1>Quiz</h1>
            <p>Módulo: {moduloId}</p>
            <p>Tema: {topicId}</p>
          </section>

          <QuizProgress
            current={answerCorrect}
            total={questions.length}
            correctCount={answerCorrect}
            pendingCount={pendingQuestionIndexes.length}
          />

          <section className="quiz-question">
            <h2>Quiz completado</h2>
            <p>
              Dominadas: {answerCorrect}/{questions.length}
            </p>
          </section>

          <button type="button" className="btn-back" onClick={() => navigate(-1)}>
            Volver atrás
          </button>
        </article>
      </div>
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
          current={answerCorrect}
          total={questions.length}
          correctCount={answerCorrect}
          pendingCount={pendingQuestionIndexes.length}
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
          <button onClick={handleLess} disabled={true}>
            Anterior
          </button>

          <button
            onClick={handleNext}
            disabled={quizFinished || !hasAnsweredCurrent}>
            Siguiente
          </button>
        </section>
        <button type="button" className="btn-back" onClick={() => navigate(-1)}>
          Volver atrás
        </button>
      </article>
    </div>
  );
}
