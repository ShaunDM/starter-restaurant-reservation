import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { listTables, finishTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function Tables() {
  const [finish, setFinish] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const history = useHistory();

  useEffect(loadTables, [tables]);

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  useEffect(seatNewGuests, [finish]);

  function seatNewGuests() {
    const abortController = new AbortController();
    setTablesError(null);
    if (finish) {
      if (
        window.confirm(
          "Is this table ready to seat new guests? This cannot be undone."
        )
      ) {
        finishTable(finish, abortController.signal)
          .then(() => history.go(0))
          .catch(setTablesError);
        return () => abortController.abort();
      }
      setFinish(null);
    }
  }

  function handleFinish({ target }) {
    console.log(target.value);
    setFinish(target.value);
  }

  const tableRows = tables.map((table) => {
    if (table.reservation_id) {
      return (
        <tr key={table.table_id}>
          <th scope="row">{table.table_id}</th>
          <td>{table.table_name}</td>
          <td>{table.capacity}</td>
          <td data-table-id-status={table.table_id}>occupied</td>
          <td>
            <button
              type="button"
              className="btn btn-secondary mr-2"
              data-table-id-finish={table.table_id}
              value={table.table_id}
              onClick={handleFinish}
            >
              Finish
            </button>
          </td>
        </tr>
      );
    }
    return (
      <tr key={table.table_id}>
        <th scope="row">{table.table_id}</th>
        <td>{table.table_name}</td>
        <td>{table.capacity}</td>
        <td data-table-id-status={table.table_id}>free</td>
      </tr>
    );
  });

  return (
    <section>
      <ErrorAlert error={tablesError} />
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Table ID</th>
            <th scope="col">Table Name</th>
            <th scope="col">Capacity</th>
            <th scope="col">Availability</th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
    </section>
  );
}

export default Tables;
