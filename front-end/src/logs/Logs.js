import React, { useState, useEffect } from "react";
import LogsHead from "./LogsHead";
import LogsBody from "./LogsBody";
import ErrorAlert from "../layout/ErrorAlert";
import { listLogs } from "../utils/api";
import logger from "../utils/logger";

function Logs() {
  const file_name = "Logs";
  logger.info({
    file_name,
    method_name: file_name,
    message: `started ${file_name}`,
  });

  const [logs, setLogs] = useState({
    log_id: "",
    file_name: "",
    method_name: "",
    label: "",
    value: "",
    message: "",
    params: "",
    created_at: "",
    updated_at: "",
  });
  const [error, setError] = useState(null);

  useEffect(loadLogs, []);

  function loadLogs() {
    const method_name = "loadLogs";
    logger.debug({
      file_name,
      method_name,
      message: `started ${method_name}`,
    });
    const abortController = new AbortController();
    setError(null);
    listLogs(abortController.signal)
      .then((response) => {
        logger.trace({
          file_name,
          method_name: `${method_name}/listLogs`,
          message: `valid`,
          params: `Response: ${response}`,
        });
        setLogs(response);
      })
      .catch(setError);
    return () => abortController.abort();
  }

  const columns = [
    { label: "Log Id", accessor: "log_id" },
    { label: "File Name", accessor: "file_name" },
    { label: "Method Name", accessor: "method_name" },
    { label: "Message", accessor: "message" },
    { label: "Params", accessor: "params" },
    { label: "Created At", accessor: "created_at" },
    { label: "Updated At", accessor: "updated_at" },
  ];

  return (
    <div className="table_container">
      <h1>Sortable table with React</h1>
      <table className="table">
        <ErrorAlert error={error} />
        <LogsHead columns={columns} />
        <LogsBody columns={columns} logs={logs} />
      </table>
    </div>
  );
}

export default Logs;
