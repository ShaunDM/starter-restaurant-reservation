import React, { useEffect, useState } from "react";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import TablesTable from "./tablesTable/TablesTable";
import ErrorAlert from "../layout/ErrorAlert";
import { listTables, seatTable, readReservation } from "../utils/api";
// import logger from "../utils/logger";

/**
 * Defines the page for the user to seat a reservation to a table.
 * @returns {JSX.Element}
 */

function SeatTable() {
  // const file_name = "SeatTable";
  // logger.info({
  //   file_name,
  //   method_name: file_name,
  //   message: `started ${file_name}`,
  // });

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
    // const method_name = "loadDashboard";
    // logger.debug({
    //   file_name,
    //   method_name,
    //   message: `started ${method_name}`,
    // });

    const abortController = new AbortController();
    setReservationErr(null);
    readReservation(reservation_id, abortController.signal)
      .then((response) => {
        // logger.trace({
        //   file_name,
        //   method_name: `${method_name}/readReservation`,
        //   message: `valid`,
        //   params: `Response: ${response}`,
        // });
        setReservation(response);
      })
      .catch(setReservationErr);
    setTablesError(null);
    listTables(abortController.signal)
      .then((response) => {
        // logger.trace({
        //   file_name,
        //   method_name: `${method_name}/listTables`,
        //   message: `valid`,
        //   params: `Response: ${response}`,
        // });
        setTables(response);
      })
      .catch(setTablesError);
    return () => abortController.abort();
  }

  function cancelHandler() {
    // const method_name = "cancelHandler";
    // logger.debug({
    //   file_name,
    //   method_name,
    //   message: `started ${method_name}`,
    // });
    history.goBack();
  }

  function changeHandler({ target }) {
    // const method_name = "changeHandler";
    // logger.trace({
    //   file_name,
    //   method_name,
    //   message: `started ${method_name}`,
    //   params: `target: ${target}`,
    // });
    setSeat({ ...seat, table_id: target.value });
  }

  function submitHandler(event) {
    // const method_name = "submitHandler";
    // logger.debug({
    //   file_name,
    //   method_name,
    //   message: `started ${method_name}`,
    //   params: `seat: ${seat}`,
    // });
    event.preventDefault();
    setSubmitError(null);
    seatTable(seat)
      .then((response) => {
        // logger.trace({
        //   file_name,
        //   method_name: `${method_name}/seatTable`,
        //   message: `valid`,
        //   params: `Response: ${response}`,
        // });
        history.push("/");
      })
      .catch(setSubmitError);
  }

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
        <TablesTable tables={tables} />
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

export default SeatTable;
