import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
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

  const params = new URL(window.location).searchParams;
  const param = params.get("mobile_number");

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(loadResults, [param]);

  function loadResults() {
    const method_name = "loadResults";
    logger.debug({
      file_name,
      method_name,
      message: `started ${method_name}`,
      params: `query: ${param}`,
    });
    if (!param) {
      setReservations([]);
    } else {
      const abortController = new AbortController();
      setReservationsError(null);
      searchReservations(abortController.signal)
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

  function submitHandler() {
    const method_name = "submitHandler";
    logger.debug({
      file_name,
      method_name,
      message: `started ${method_name}`,
      params: `query: ${query}`,
    });
  }
  let reservationsFound = !reservations.length
    ? "No reservations found"
    : `Reservations found: ${reservations.length}`;
  reservationsFound = !param ? (
    ""
  ) : (
    <div className="d-md-flex mb-3">
      <h4>{reservationsFound}</h4>
    </div>
  );

  const searched = !param
    ? "No search criteria"
    : `Reservations for number: ${param}`;

  return (
    <main>
      <nav>
        <div className="row bg-dark p-0">
          <h1 className="text-light ml-3">Search</h1>
        </div>
        <div className="d-md-flex mb-3">
          <h4 className="mb-0">{searched}</h4>
        </div>
        {reservationsFound}
        <form onSubmit={submitHandler} className="mb-0">
          <div className="row mb-3">
            <div className="mx-3 form-group">
              <div>
                <label className="form-label" htmlFor="mobile_number">
                  Search
                </label>
              </div>
              <div>
                <input
                  id="mobile_number"
                  className="mr-1"
                  name="mobile_number"
                  type="text"
                  placeholder="Enter a customer's phone number"
                  value={query}
                  onChange={changeHandler}
                />
                <button className="btn btn-primary btn-sm" type="submit">
                  <Link
                    to={`/search?mobile_number=${query}`}
                    className="text-decoration-none text-white"
                  >
                    Submit
                  </Link>
                </button>
              </div>
            </div>
          </div>
        </form>
      </nav>
      <ErrorAlert error={reservationsError} />
      <section>
        <ReservationsTable reservations={reservations} />
      </section>
    </main>
  );
}

export default SearchReservations;
