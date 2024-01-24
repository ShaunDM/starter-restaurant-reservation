import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function Reservations({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  //Setting the date variable to the query string, should it exist, here to preserve given code
  const search = useLocation().search;
  const qDate = new URLSearchParams(search).get("date");
  if (qDate) {
    date = qDate;
  }

  useEffect(loadReservations, [date]);

  function loadReservations() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
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
      <td>
        <Link
          to={`/reservations/${reservation.reservation_id}/seat`}
          className="btn btn-primary"
        >
          Seat
        </Link>
      </td>
    </tr>
  ));

  return (
    <div>
      <nav>
        <div className="d-md-flex mb-3">
          <h4 className="mb-0">{`Reservations for date: ${date}`}</h4>
        </div>
      </nav>
      <ErrorAlert error={reservationsError} />
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
    </div>
  );
}

export default Reservations;
