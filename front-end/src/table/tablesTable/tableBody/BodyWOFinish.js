import React from "react";
import logger from "../../../utils/logger";

/**
 * Defines the body of the tables' table.
 * @param tables
 *  an array of tables for which the user wants to view.
 *  @param columns
 *  the labels and accessors for the columns of the tables table.
 * @returns {JSX.Element}
 */

function BodyWOFinish({ columns, tables }) {
  const file_name = "BodyWOFinish";
  logger.info({
    file_name,
    method_name: file_name,
    message: `started ${file_name}`,
    params: `tables: ${tables}, columns: ${columns}`,
  });

  const tableRows = tables.map((table) => {
    const availability = table.reservation_id ? "occupied" : "free";
    let tData = "";
    return (
      <tr key={table.table_id}>
        {columns.map(({ accessor }) => {
          if (accessor === "available") {
            tData = availability;
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

export default BodyWOFinish;
