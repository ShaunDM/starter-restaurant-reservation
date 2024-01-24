import React, { useEffect, useState } from "react";
import { useLocation, Link, useHistory } from "react-router-dom";
import { listReservations, listTables, finishTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import DashboardClean from "./DashboardClean";

/*For some reason test -04: seat button has href with /reservations/${reservation_id}/seat, has a timeout error when using DashboardClean. As such this Dashboard has to be used as I don't want to alter tests for an assignment.*/

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [finish, setFinish] = useState(null);

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
          .catch((err) => {
            setTablesError(err);
          });
        return () => abortController.abort();
      }
      setFinish(null);
    }
    return () => abortController.abort();
  }

  function handleFinish({ target }) {
    console.log(target.value);
    setFinish(target.value);
  }

  const reservationRows = reservations.map((reservation) => (
    <tr key={reservation.reservation_id}>
      <th scope="row">{reservation.reservation_id}</th>
      <td>{reservation.first_name}</td>
      <td>{reservation.last_name}</td>
      <td>{reservation.mobile_number}</td>
      <td>{reservation.reservation_date}</td>
      <td>{reservation.reservation_time}</td>
      <td>{reservation.people}</td>
      <td data-reservation-id-status={reservation.reservation_id}>
        <Link
          to={`/reservations/${reservation.reservation_id}/seat`}
          className="btn btn-primary"
        >
          Seat
        </Link>
      </td>
    </tr>
  ));

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

  // return <DashboardClean date={date} />;

  return (
    <main>
      <nav>
        <h1>Dashboard</h1>
        <div className="d-md-flex mb-3">
          <h4 className="mb-0">{`Reservations for date: ${date}`}</h4>
        </div>
      </nav>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
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
