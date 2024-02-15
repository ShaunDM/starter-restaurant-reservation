import React, { useEffect, useState } from "react";
import { listReservations, listTables, finishTable } from "../utils/api";
import ReservationsTable from "../reservation/reservationsTable/ReservationsTable";
import TablesTable from "../table/tablesTable/TablesTable";
import Nav from "./Nav";
import ErrorAlert from "../layout/ErrorAlert";
import logger from "../utils/logger";

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

  const reservationsFound = !reservations.length
    ? "No reservations"
    : `Reservations: ${reservations.length}`;

  useEffect(loadDashboard, [date, finish]);

  function loadDashboard() {
    const method_name = "loadDashboard";
    logger.debug({
      file_name,
      method_name,
      message: `started ${method_name}`,
    });

    const loadReservations = () => {
      const method_name = "loadReservations";
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
      return () => abortController.abort();
    };

    const loadTables = () => {
      const method_name = "loadTables";
      logger.debug({
        file_name,
        method_name,
        message: `started ${method_name}`,
      });

      const abortController = new AbortController();
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
    };

    loadReservations();
    loadTables();
  }

  useEffect(tableFinish, [finish]);

  function tableFinish() {
    const method_name = "tableFinish";
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
            setFinish({ reservation_id: "", table_id: "" });
          })
          .catch((err) => {
            setTablesError(err);
          });
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
      reservation_id: target.value,
      table_id: target.id,
    });
  }

  return (
    <main>
      <Nav date={date} reservationsFound={reservationsFound} />
      <section>
        <ErrorAlert error={reservationsError} />
        <ErrorAlert error={tablesError} />
      </section>
      <section>
        <ReservationsTable reservations={reservations} />
        <TablesTable tables={tables} handleFinish={handleFinish} />
      </section>
    </main>
  );
}

export default Dashboard;
