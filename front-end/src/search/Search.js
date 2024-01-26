import React, { useEffect, useState } from "react";
import { searchReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function Search() {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [search, setSearch] = useState(null);
  const [load, setLoad] = useState(null);

  useEffect(loadSearch, [load]);

  function loadSearch() {
    if (!search) {
      return;
    }
    const abortController = new AbortController();
    setReservationsError(null);
    searchReservations(search, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function changeHandler({ target }) {
    setSearch(target.value);
  }

  function submitHandler(event) {
    event.preventDefault();
    setLoad(search);
  }

  let noReservationFound = "";
  let reservationRows = "";
  if (!reservations.length) {
    noReservationFound = "No reservations found";
  } else {
    reservationRows = reservations.map((reservation) => (
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
      </tr>
    ));
  }

  return (
    <main>
      <nav>
        <h1>Search</h1>
        <div className="d-md-flex mb-3">
          <h4 className="mb-0">{`Reservations for number: ${load}`}</h4>
        </div>
        <form onSubmit={submitHandler} className="mb-4">
          <div className="row mb-3">
            <div className="mx-3 form-group">
              <div>
                <label className="form-label" htmlFor="search">
                  Search
                </label>
              </div>
              <input
                className="me-3"
                name="mobile_number"
                type="text"
                placeholder="Enter a customer's phone number"
                value={search}
                onChange={changeHandler}
              />
              <button type="submit" className="btn, btn-primary">
                Submit
              </button>
            </div>
          </div>
        </form>
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
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>{reservationRows}</tbody>
        </table>
        <h4>{noReservationFound}</h4>
      </section>
    </main>
  );
}

export default Search;
