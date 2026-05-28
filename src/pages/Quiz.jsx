

import { useParams, useNavigate } from "react-router-dom";

import { getQuiz } from "../data/quizLoader";
import { useEffect, useMemo, useRef, useState } from "react";
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
    lenguajeMarcas: "lenguajeMarcas",
    empleabilidad: "empleabilidad",
    repasoGlobal: "repasoGlobal"
  };
  return map[moduloId] ?? null;
}

const DISPLAY_LETTERS = ["a", "b", "c", "d"];

function shuffleArray(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function prepareQuestion(question) {
  if (!question || !Array.isArray(question.opciones)) return question;

  const shuffledOptions = shuffleArray(question.opciones).map((option, index) => ({
    ...option,
    displayLetter: DISPLAY_LETTERS[index] ?? option.clave,
  }));

  const displayLetterByKey = shuffledOptions.reduce((acc, option) => {
    acc[option.clave] = option.displayLetter;
    return acc;
  }, {});

  return {
    ...question,
    opciones: shuffledOptions,
    displayLetterByKey,
  };
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
  const preparedQuestions = useMemo(() => {
    if (!Array.isArray(questions)) return questions;
    return questions.map((question) => prepareQuestion(question));
  }, [questions, moduloId, topicId]);

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

  const totalQuestions = preparedQuestions?.length ?? 0;
  const answerCorrect = solvedQuestionIndexes.length;

  useEffect(() => {
    setCurrentIndex(0);
    const initialIndexes = Array.isArray(preparedQuestions)
      ? preparedQuestions.map((_, idx) => idx)
      : [];
    setRoundQuestionIndexes(shuffleArray(initialIndexes));
    setPendingQuestionIndexes([]);
    setSolvedQuestionIndexes([]);
    setQuizFinished(false);
    setSelectedOption(null);
    setFeedback(null);
    setHasAnsweredCurrent(false);
    completionRecordedRef.current = false;
  }, [moduloId, topicId, preparedQuestions]);


  const roundLength = roundQuestionIndexes.length;
  const originalIndex =
    roundLength > 0 ? roundQuestionIndexes[currentIndex] : null;
  const currentQuestion =
    preparedQuestions && originalIndex !== null
      ? preparedQuestions?.[originalIndex] ?? null
      : null;

  function handleOptionChange(optionKey) {
    if (hasAnsweredCurrent) return;
    setSelectedOption(optionKey);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!preparedQuestions) return;
    if (hasAnsweredCurrent) return;
    if (!selectedOption) return;

    const idxInOriginal =
      roundLength > 0 ? roundQuestionIndexes[currentIndex] : null;
    if (idxInOriginal === null) return;

    const question = preparedQuestions[idxInOriginal];
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
    if (!preparedQuestions) return;
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

  if (!preparedQuestions) {
    return (
      <p>
        No existe: src/data/{folder}/{topicId}.json
      </p>
    );
  }

  if (preparedQuestions.length === 0) {
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
