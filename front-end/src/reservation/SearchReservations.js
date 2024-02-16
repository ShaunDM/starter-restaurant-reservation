import React, { useEffect, useState } from "react";
import { searchReservations } from "../utils/api";
import ReservationsTable from "./reservationsTable/ReservationsTable";
import ErrorAlert from "../layout/ErrorAlert";
import logger from "../utils/logger";

/**
 * Defines the search page, user searches for reservations by mobile_number.
 *
 * @returns {JSX.Element}
 */

function SearchReservations() {
  const file_name = "SearchReservations";
  logger.info({
    file_name,
    method_name: file_name,
    message: `started ${file_name}`,
  });

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [query, setQuery] = useState("");
  const [load, setLoad] = useState(null);

  useEffect(loadResults, [load]);

  function loadResults() {
    const method_name = "loadResults";
    logger.debug({
      file_name,
      method_name,
      message: `started ${method_name}`,
      params: `query: ${load}`,
    });
    if (!load) {
      return;
    }
    const abortController = new AbortController();
    setReservationsError(null);
    searchReservations(load, abortController.signal)
      .then((response) => {
        logger.trace({
          file_name,
          method_name: `${method_name}/searchReservations`,
          message: `valid`,
          params: `Response: ${response}`,
        });
        setReservations(response);
      })
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function changeHandler({ target }) {
    const method_name = "changeHandler";
    logger.trace({
      file_name,
      method_name,
      message: `started ${method_name}`,
      params: `target: ${target}`,
    });
    setQuery(target.value);
  }

  function submitHandler(event) {
    const method_name = "submitHandler";
    logger.debug({
      file_name,
      method_name,
      message: `started ${method_name}`,
      params: `query: ${query}`,
    });
    event.preventDefault();
    setLoad(query);
  }

  const reservationFound = !reservations.length
    ? "No reservations found"
    : `Reservations found: ${reservations.length}`;

  const searched = load ? load : "";

  return (
    <main>
      <nav>
        <div className="row bg-dark p-0">
          <h1 className="text-light ml-3">Search</h1>
        </div>
        <div className="d-md-flex mb-3">
          <h4 className="mb-0">{`Reservations for number: ${searched}`}</h4>
        </div>
        <form onSubmit={submitHandler} className="mb-4">
          <div className="row mb-3">
            <div className="mx-3 form-group">
              <div>
                <label className="form-label" htmlFor="mobile_number">
                  Search
                </label>
              </div>
              <input
                id="mobile_number"
                className="me-3"
                name="mobile_number"
                type="text"
                placeholder="Enter a customer's phone number"
                value={query}
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
        <h4>{reservationFound}</h4>
        <ReservationsTable reservations={reservations} />
      </section>
    </main>
  );
}

export default SearchReservations;
