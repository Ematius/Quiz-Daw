/** @format */

import { useAuth } from "../context/AuthContext";
import {
  buildPanelMatrix,
  formatModuleColumnTitle,
} from "../utils/buildPanelMatrix";
import "./Panel.scss";

export function Panel() {
  const { user } = useAuth();
  const { moduleKeys, rows, maxTopicRows } = buildPanelMatrix(user?.username);

  if (!moduleKeys.length || maxTopicRows === 0) {
    return (
      <div className="page-container panel-page">
        <h1 className="page-title">Panel personal</h1>
        <p>No hay módulos o temas definidos todavía.</p>
      </div>
    );
  }

  return (
    <div className="page-container panel-page">
      <h1 className="page-title">Panel personal</h1>
      <p className="panel-page__intro">
        Veces que has completado cada tema (dominio total del test). Celdas grises:
        ese tema no existe en ese módulo.
      </p>

      <div className="panel-table-wrap">
        <table className="panel-table">
          <thead>
            <tr>
              <th className="panel-table__corner" scope="col">
                Tema
              </th>
              {moduleKeys.map((mk) => (
                <th key={mk} scope="col" className="panel-table__module-head">
                  {formatModuleColumnTitle(mk)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.rowIndex}>
                <th scope="row" className="panel-table__row-head">
                  {row.label}
                </th>
                {row.cells.map((cell, ci) => {
                  const colKey = `${row.rowIndex}-${moduleKeys[ci]}`;
                  if (!cell.exists) {
                    return (
                      <td
                        key={colKey}
                        className="panel-table__cell panel-table__cell--na"
                        title="No existe en este módulo">
                        —
                      </td>
                    );
                  }
                  return (
                    <td
                      key={colKey}
                      className="panel-table__cell panel-table__cell--ok"
                      title={cell.title || cell.topicId}>
                      {cell.count}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
