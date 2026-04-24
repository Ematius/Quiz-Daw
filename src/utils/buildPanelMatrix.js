/** @format */

import { topicsByModule } from "../data/topicsByModule";
import {
  readCompletions,
  readLastTestIncorrects,
} from "../storage/quizAppStorage";

/**
 * Formato legible del id de módulo sin duplicar listas de módulos.
 * @param {string} moduleKey
 */
export function formatModuleColumnTitle(moduleKey) {
  const k = String(moduleKey);
  if (!k) return "";
  const spaced = k.replace(/([a-z])([A-Z])/g, "$1 $2");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/**
 * @param {string} username
 * @returns {{
 *   moduleKeys: string[],
 *   maxTopicRows: number,
 *   rows: Array<{
 *     rowIndex: number,
 *     label: string,
 *     cells: Array<{
 *       exists: boolean,
 *       topicId: string | null,
 *       title: string | null,
 *       count: number,
 *       lastTestIncorrectCount: number,
 *       grade: string
 *     }>
 *   }>
 * }}
 */
export function buildPanelMatrix(username) {
  const moduleKeys = Object.keys(topicsByModule || {});
  const completions = readCompletions();
  const lastTestIncorrects = readLastTestIncorrects();
  const userData = username ? completions[String(username).trim()] : null;
  const userLastIncorrects = username
    ? lastTestIncorrects[String(username).trim()]
    : null;

  let maxTopicRows = 0;
  for (const mk of moduleKeys) {
    const list = topicsByModule[mk];
    const len = Array.isArray(list) ? list.length : 0;
    if (len > maxTopicRows) maxTopicRows = len;
  }

  const rows = [];
  for (let r = 0; r < maxTopicRows; r += 1) {
    const label = `Tema ${r + 1}`;
    const cells = moduleKeys.map((mk) => {
      const list = topicsByModule[mk];
      const topic = Array.isArray(list) ? list[r] : undefined;
      if (!topic || !topic.id) {
        return {
          exists: false,
          topicId: null,
          title: null,
          count: 0,
          lastTestIncorrectCount: 0,
          grade: "Test sin hacer",
        };
      }
      const tid = String(topic.id).trim();
      const count = userData?.[mk]?.[tid] ?? 0;
      const lastTestIncorrectCount = userLastIncorrects?.[mk]?.[tid] ?? 0;
      const grade =
        count === 0
          ? "0.0"
          : (((30 - lastTestIncorrectCount) / 30) * 10).toFixed(2);
      return {
        exists: true,
        topicId: tid,
        title: topic.title ?? null,
        count,
        lastTestIncorrectCount,
        grade,
      };
    });
    rows.push({ rowIndex: r, label, cells });
  }

  return { moduleKeys, maxTopicRows, rows };
}
