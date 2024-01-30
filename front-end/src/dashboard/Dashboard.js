import React, { useEffect, useState } from "react";
import { useLocation, Link, useHistory } from "react-router-dom";
import {
  listReservations,
  listTables,
  finishTable,
  changeReservationStatus,
  readReservation,
} from "../utils/api";
import Nav from "./Nav";
import ErrorAlert from "../layout/ErrorAlert";
// import logger from "../utils/logger";
/*For some reason test -05 and higher fail if I use dashboardClean in ignore file, so I'm sticking with this...*/

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  // const file_name = "Dashboard";
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [finish, setFinish] = useState({ reservation_id: "", table_id: "" });
  const [error, setError] = useState(null);

  const history = useHistory();

  //Setting the date variable to the query string, should it exist, here to preserve given code
  const search = useLocation().search;
  const qDate = new URLSearchParams(search).get("date");
  if (qDate) {
    date = qDate;
  }

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    setTablesError(null);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  useEffect(seatNewGuests, [finish, history]);

  function seatNewGuests() {
    const abortController = new AbortController();
    setTablesError(null);
    if (finish.table_id && finish.reservation_id) {
      if (
        window.confirm(
          "Is this table ready to seat new guests? This cannot be undone."
        )
      ) {
        finishTable(finish, abortController.signal)
          .then(() => history.go(0))
          .catch((err) => {
            setTablesError(err);
          });
        return () => abortController.abort();
      }
    }
    return () => abortController.abort();
  }

  function handleFinish({ target }) {
    setFinish({
      reservation_id: target.id,
      table_id: target.value,
    });
  }

  function cancelHandler({ target }) {
    // const method_name = "cancelHandler";
    // logger.debug({
    //   file_name,
    //   method_name,
    //   message: `started ${method_name}`,
    // });

    if (window.confirm("Do you want to cancel this reservation?")) {
      const abortController = new AbortController();
      setError(null);
      readReservation(target.value, abortController.signal).then((result) =>
        changeReservationStatus(
          { ...result, status: "cancelled" },
          abortController.signal
        )
          .then((response) => {
            // logger.trace({
            //   file_name,
            //   method_name: `${method_name}/readReservation`,
            //   message: `valid`,
            //   params: `Response: ${response}`,
            // });
            history.go(0);
          })
          .catch((err) => {
            setError(err);
          })
      );
      return () => abortController.abort();
    }
  }

  const reservationRows = reservations.map((reservation) => {
    if (reservation.status === "seated") {
      return (
        <tr key={reservation.reservation_id}>
          <th scope="row">{reservation.reservation_id}</th>
          <td>{reservation.first_name}</td>
          <td>{reservation.last_name}</td>
          <td>{reservation.mobile_number}</td>
          <td>{reservation.reservation_date}</td>
          <td>{reservation.reservation_time}</td>
          <td>{reservation.people}</td>
          <td data-reservation-id-status={reservation.reservation_id}>
            {reservation.status}
          </td>
          <td data-reservation-id-status={reservation.reservation_id}>
            <Link
              to={`/reservations/${reservation.reservation_id}/edit`}
              className="btn btn-primary"
            >
              Edit
            </Link>
          </td>
          <td data-reservation-id-cancel={reservation.reservation_id}>
            <button
              className="btn btn-primary"
              type="button"
              onClick={cancelHandler}
              value={reservation.reservation_id}
            >
              Cancel
            </button>
          </td>
        </tr>
      );
    }
    return (
      <tr key={reservation.reservation_id}>
        <th scope="row">{reservation.reservation_id}</th>
        <td>{reservation.first_name}</td>
        <td>{reservation.last_name}</td>
        <td>{reservation.mobile_number}</td>
        <td>{reservation.reservation_date}</td>
        <td>{reservation.reservation_time}</td>
        <td>{reservation.people}</td>
        <td data-reservation-id-status={reservation.reservation_id}>
          {reservation.status}
        </td>
        <td data-reservation-id-status={reservation.reservation_id}>
          <Link
            to={`/reservations/${reservation.reservation_id}/seat`}
            className="btn btn-primary"
          >
            Seat
          </Link>
        </td>
        <td data-reservation-id-status={reservation.reservation_id}>
          <Link
            to={`/reservations/${reservation.reservation_id}/edit`}
            className="btn btn-primary"
          >
            Edit
          </Link>
        </td>
        <td data-reservation-id-cancel={reservation.reservation_id}>
          <button
            className="btn btn-primary"
            type="button"
            onClick={cancelHandler}
            data-reservation-id-cancel={reservation.reservation_id}
            value={reservation.reservation_id}
          >
            Cancel Reservation
          </button>
        </td>
      </tr>
    );
  });

  const tableRows = tables.map((table) => {
    if (table.reservation_id) {
      console.log(table);
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
      <ErrorAlert error={error} />
      <section>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Reservation ID</th>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Mobile Number</th>
              <th scope="col">Reservation Date</th>
              <th scope="col">Reservation Time</th>
              <th scope="col">People</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>{reservationRows}</tbody>
        </table>
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
