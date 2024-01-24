import React, { useEffect, useState } from "react";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import ErrorAlert from "../layout/ErrorAlert";
import { listTables, seatTable, readReservation } from "../utils/api";

function Seat() {
  const { reservation_id } = useParams();
  const [reservation, setReservation] = useState({});
  const [reservationErr, setReservationErr] = useState(null);
  const [seat, setSeat] = useState({
    reservation_id: reservation_id,
    table_id: "",
  });
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const history = useHistory();
  useEffect(loadDashboard, [reservation_id]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationErr(null);
    readReservation(reservation_id, abortController.signal)
      .then(setReservation)
      .catch(setReservationErr);
    setTablesError(null);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  function cancelHandler() {
    console.log(history);
    history.goBack();
  }

  function changeHandler({ target }) {
    setSeat({ ...seat, table_id: target.value });
  }

  function submitHandler(event) {
    event.preventDefault();
    setSubmitError(null);
    seatTable(seat)
      .then(() => {
        history.push("/");
      })
      .catch(setSubmitError);
  }

  const tableRows = tables.map((table) => (
    <tr key={table.table_id}>
      <th scope="row">{table.table_id}</th>
      <td>{table.table_name}</td>
      <td>{table.capacity}</td>
      <td>{table.available}</td>
    </tr>
  ));
  const list = tables.map((table) => (
    <option key={table.table_id} value={table.table_id}>
      {`${table.table_name} - ${table.capacity}`}
    </option>
  ));

  return (
    <main>
      <h1 className="mb-3">{`Seat reservation_id: ${reservation.reservation_id}`}</h1>
      <ErrorAlert error={reservationErr} />
      <ErrorAlert error={tablesError} />
      <ErrorAlert error={submitError} />
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
      <section>
        <form onSubmit={submitHandler} className="mb-4">
          <div className="row mb-3">
            <label className="form-label" htmlFor="cloudCover">
              Select a table to seat reservation
            </label>
            <select
              className="form-control"
              id="table"
              name="table_id"
              value={seat.table_id}
              onChange={changeHandler}
            >
              <option value="">Table to seat</option>
              {list}
            </select>
          </div>
          <div className="col-6 form-group">
            <button
              type="button"
              className="btn btn-secondary mr-2"
              onClick={cancelHandler}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Seat;
