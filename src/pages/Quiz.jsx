

import { useParams, useNavigate } from "react-router-dom";

import { getQuiz } from "../data/quizLoader";
import { useEffect, useRef, useState } from "react";
import { QuizQuestion } from "../Components/QuizQuestion";
import { QuizProgress } from "../Components/QuizProgress";
import { useAuth } from "../context/AuthContext";
import {
  recordLastTestIncorrects,
  recordTopicCompletion,
} from "../storage/quizAppStorage";
import "./Quiz.scss";

function resolveFolder(moduloId) {
  const map = {
    sistemas: "sistemas",
    entornosDesarrollo: "entornosDesarrollo",
    baseDatos: "baseDatos",
    introduccionProgramacion: "introduccionProgramacion",
    ingles: "ingles",
  };
  return map[moduloId] ?? null;
}


export function Quiz()
{
  const { moduloId, topicId: topicIdParam } = useParams();
  const topicId =
    topicIdParam != null
      ? (() => {
          try {
            return decodeURIComponent(topicIdParam);
          } catch {
            return topicIdParam;
          }
        })()
      : "";
  const navigate = useNavigate();
  const { user } = useAuth();

  const folder = resolveFolder(moduloId);
  const questions = folder ? getQuiz(folder, topicId) : null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [roundQuestionIndexes, setRoundQuestionIndexes] = useState([]);
  const [pendingQuestionIndexes, setPendingQuestionIndexes] = useState([]);
  const [solvedQuestionIndexes, setSolvedQuestionIndexes] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [hasAnsweredCurrent, setHasAnsweredCurrent] = useState(false);

  const solvedRef = useRef([]);
  const completionRecordedRef = useRef(false);
  useEffect(() => {
    solvedRef.current = solvedQuestionIndexes;
  }, [solvedQuestionIndexes]);

  const totalQuestions = questions?.length ?? 0;
  const answerCorrect = solvedQuestionIndexes.length;

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
    setHasAnsweredCurrent(false);
    completionRecordedRef.current = false;
  }, [moduloId, topicId]);


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
        if (solvedRef.current.includes(idxInOriginal)) return prev;
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
      setPendingQuestionIndexes((pending) => {
        if (pending.length > 0) {
          if (roundLength === totalQuestions && user?.username) {
            recordLastTestIncorrects(user.username, moduloId, topicId, pending.length);
          }
          setRoundQuestionIndexes([...pending]);
          setCurrentIndex(0);
        } else if (solvedRef.current.length === totalQuestions) {
          if (!completionRecordedRef.current) {
            completionRecordedRef.current = true;
            setQuizFinished(true);
            if (user?.username) {
              recordTopicCompletion(user.username, moduloId, topicId);
            }
          }
        }
        return pending;
      });
    }

    setSelectedOption(null);
    setFeedback(null);
    setHasAnsweredCurrent(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
            total={totalQuestions}
            correctCount={answerCorrect}
            pendingCount={pendingQuestionIndexes.length}
          />

          <section className="quiz-question">
            <h2>Felicidades, has repasado por completo este tema</h2>
            <p>
              Has dominado todas las preguntas: {answerCorrect}/{totalQuestions}
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
          total={totalQuestions}
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
