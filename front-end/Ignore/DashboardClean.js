import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { listReservations, listTables, finishTable } from "../src/utils/api";
import ReservationsTable from "../src/reservation/ReservationsTable/ReservationsTable";
import Nav from "./Nav";
import ErrorAlert from "../src/layout/ErrorAlert";
import logger from "../src/utils/logger";

// import DashboardClean from "./DashboardClean";

/*For some reason test -04: seat button has href with /reservations/${reservation_id}/seat, has a timeout error when using DashboardClean. As such this Dashboard has to be used as I don't want to alter tests for an assignment. Since the tests started failing I also didn't try to do the same thing with the tables table.*/

/**
 * Defines the dashboard page that uses other components to render different parts, caused errors in the tests so it is sidelined.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const file_name = "Dashboard";
  logger.info({
    file_name,
    method_name: file_name,
    message: `started ${file_name}`,
  });

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [finish, setFinish] = useState({ reservation_id: "", table_id: "" });

  const history = useHistory();

  //Setting the date variable to the query string, should it exist, here to preserve given code
  const search = useLocation().search;
  const qDate = new URLSearchParams(search).get("date");
  if (qDate) {
    date = qDate;
  }

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const method_name = "loadDashboard";
    logger.debug({
      file_name,
      method_name,
      message: `started ${method_name}`,
    });
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then((response) => {
        logger.trace({
          file_name,
          method_name: `${method_name}/listReservations`,
          message: `valid`,
          params: `Response: ${response}`,
        });
        setReservations(response);
      })
      .catch(setReservationsError);
    setTablesError(null);
    listTables(abortController.signal)
      .then((response) => {
        logger.trace({
          file_name,
          method_name: `${method_name}/listTables`,
          message: `valid`,
          params: `Response: ${response}`,
        });
        setTables(response);
      })
      .catch(setTablesError);
    return () => abortController.abort();
  }

  useEffect(seatReservation, [finish]);

  function seatReservation() {
    const method_name = "seatReservation";
    logger.debug({
      file_name,
      method_name,
      message: `started ${method_name}`,
    });
    const abortController = new AbortController();
    setTablesError(null);
    if (finish.table_id && finish.reservation_id) {
      if (
        window.confirm(
          "Is this table ready to seat new guests? This cannot be undone."
        )
      ) {
        finishTable(finish, abortController.signal)
          .then((response) => {
            logger.trace({
              file_name,
              method_name: `${method_name}/finishTable`,
              message: `valid`,
              params: `Response: ${response}`,
            });
            history.go(0);
          })
          .catch((err) => {
            setTablesError(err);
          });
        return () => abortController.abort();
      }
    }
    return () => abortController.abort();
  }

  function handleFinish({ target }) {
    const method_name = "handleFinish";
    logger.debug({
      file_name,
      method_name,
      message: `started ${method_name}`,
      params: `target: ${target}`,
    });
    setFinish({
      reservation_id: target.id,
      table_id: target.value,
    });
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
              id={table.reservation_id}
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

  // return <DashboardClean date={date} />;

  return (
    <main>
      <Nav date={date} />
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
      <section>
        <ReservationsTable reservations={reservations} />
      </section>
      <section>
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
    </main>
  );
}

export default Dashboard;
