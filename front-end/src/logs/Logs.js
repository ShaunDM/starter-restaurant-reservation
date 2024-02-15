import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import LogsHead from "./LogsHead";
import LogsBody from "./LogsBody";
import LogsNav from "./LogsNav";
import ErrorAlert from "../layout/ErrorAlert";
import { listLogs, truncateLogs } from "../utils/api";
import logger from "../utils/logger";

/**
 * Defines the logs page, lists log data for a developer.
 * @returns {JSX.Element}
 */

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
  const [logLevel, setLogLevel] = useState(30);

  const columns = [
    { label: "Log Id", accessor: "log_id" },
    { label: "Label", accessor: "label" },
    { label: "Value", accessor: "value" },
    { label: "File Name", accessor: "file_name" },
    { label: "Method Name", accessor: "method_name" },
    { label: "Message", accessor: "message" },
    { label: "Params", accessor: "params" },
    { label: "Created At", accessor: "created_at" },
    { label: "Updated At", accessor: "updated_at" },
  ];

  const levels = ["trace", "debug", "info", "warn", "error", "fatal", "silent"];

  const history = useHistory();

  useEffect(loadLogs, [logLevel]);

  function loadLogs() {
    const method_name = "loadLogs";
    logger.debug({
      file_name,
      method_name,
      message: `started ${method_name}`,
    });
    const abortController = new AbortController();
    setError(null);
    listLogs(logLevel, abortController.signal)
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

  function handleChange({ target }) {
    setLogLevel(target.value);
  }

  function clearLogs() {
    const method_name = "clearLogs";
    logger.debug({
      file_name,
      method_name,
      message: `started ${method_name}`,
    });
    const abortController = new AbortController();
    setError(null);
    truncateLogs(abortController.signal)
      .then(() => {
        logger.trace({
          file_name,
          method_name: `${method_name}/truncateLogs`,
          message: `valid`,
        });
        history.go(0);
      })
      .catch(setError);
    return () => abortController.abort();
  }

  return (
    <div className="table_container">
      <LogsNav
        levels={levels}
        clearLogs={clearLogs}
        handleChange={handleChange}
        logLevel={logLevel}
      />
      <ErrorAlert error={error} />
      <table className="table">
        <LogsHead columns={columns} />
        <LogsBody columns={columns} logs={logs} />
      </table>
      <button onClick={clearLogs} className="btn btn-primary">
        Truncate Logs
      </button>
    </div>
  );
}

export default Logs;
