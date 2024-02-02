import React from "react";

function LogsNav({ levels, clearLogs, handleChange, logLevel }) {
  let value = 0;
  const levelOptions = levels.map((level) => {
    value += 10;
    return (
      <option key={level} value={value}>
        {level}
      </option>
    );
  });

  return (
    <nav>
      <h1>Frontend Logs</h1>
      <div className="row">
        <div className="col-10">
          <select
            id="logLevel"
            name="logLevel"
            onChange={handleChange}
            value={logLevel}
          >
            <option value={null}>All logs</option>
            {levelOptions}
          </select>
        </div>
        <button onClick={clearLogs} className="btn btn-primary">
          Truncate Logs
        </button>
      </div>
    </nav>
  );
}

export default LogsNav;
