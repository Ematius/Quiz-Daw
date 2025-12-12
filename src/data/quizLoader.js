
const quizzes = import.meta.glob("/src/data/**/*.json", { eager: true });

export function getQuiz(folder, topicId) {
  const key = `/src/data/${folder}/${topicId}_quiz.json`;
  return quizzes[key]?.default ?? null;
}
