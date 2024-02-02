import React from "react";
import TableBody from "./TableBody";
import TableHead from "./TableHead";
// import logger from "../../utils/logger";

/**
 * Renders a list of tables for various pages, due to causing failures in tests for dashboard, not present in it.
 * @param tables
 *  an array of tables the user wants to view .
 * @returns {JSX.Element}
 */

function TablesTable({ tables }) {
  // const file_name = "TablesTable";
  // logger.info({
  //   file_name,
  //   method_name: file_name,
  //   message: `started ${file_name}`,
  //   params: `tables: ${tables}`,
  // });

  const columns = [
    { label: "Table ID", accessor: "table_id" },
    { label: "Table Name", accessor: "table_name" },
    { label: "Capacity", accessor: "capacity" },
    { label: "Availability", accessor: "reservation_id" },
  ];

  return (
    <table className="table table-striped">
      <TableHead columns={columns} />
      <TableBody columns={columns} tables={tables} />
    </table>
  );
}

export default TablesTable;
