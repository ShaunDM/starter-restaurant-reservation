import React from "react";
import BodyWFinish from "./BodyWFinish";
import BodyWOFinish from "./BodyWOFinish";
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

function TablesBody({ columns, tables, handleFinish }) {
  const file_name = "TablesBody";
  logger.info({
    file_name,
    method_name: file_name,
    message: `started ${file_name}`,
    params: `tables: ${tables}, columns: ${columns}`,
  });
  if (handleFinish) {
    return (
      <BodyWFinish
        columns={columns}
        tables={tables}
        handleFinish={handleFinish}
      />
    );
  }

  return <BodyWOFinish columns={columns} tables={tables} />;
}

export default TablesBody;
