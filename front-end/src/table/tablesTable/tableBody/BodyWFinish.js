import React from "react";
import logger from "../../../utils/logger";

/**
 * Defines the body of the tables' table.
 * @param tables
 *  an array of tables for which the user wants to view.
 *  @param columns
 *  the labels and accessors for the columns of the tables table.
 * @param handleFinish
 *  Function to handle click of the "finish" button.
 * @returns {JSX.Element}
 */

function BodyWFinish({ columns, tables, handleFinish }) {
  const file_name = "BodyWFinish";
  logger.info({
    file_name,
    method_name: file_name,
    message: `started ${file_name}`,
    params: `tables: ${tables}, columns: ${columns}`,
  });

  const tableRows = tables.map((table) => {
    const availability = table.reservation_id ? "occupied" : "free";
    const finishButton = table.reservation_id ? (
      <button
        type="button"
        className="btn btn-secondary mr-2"
        name="finish"
        id={table.table_id}
        value={table.reservation_id}
        onClick={handleFinish}
      >
        Finish
      </button>
    ) : (
      <p></p>
    );

    let tData = "";

    return (
      <tr key={table.table_id}>
        {columns.map(({ accessor }) => {
          if (accessor === "available") {
            tData = availability;
          } else if (accessor === "finish") {
            tData = finishButton;
          } else {
            tData = table[accessor] ? table[accessor] : "——";
          }
          return <td key={accessor}>{tData}</td>;
        })}
      </tr>
    );
  });

  return (
    <>
      <tbody>{tableRows}</tbody>
    </>
  );
}

export default BodyWFinish;
