import React from "react";
import { Link, useLocation } from "react-router-dom";
import { previous, next } from "../utils/date-time";

function Nav({ date, reservationsFound }) {
  const search = useLocation().search;
  let currentDay = new URLSearchParams(search).get("date");
  if (!currentDay) {
    currentDay = date;
  }
  const nextDay = next(currentDay);
  const previousDay = previous(currentDay);
  return (
    <section className="row mb-1">
      <div className="col">
        <div className="row bg-dark p-0">
          <h1 className="col-6 text-light">Dashboard</h1>
          <div className="col-md-2">
            <Link
              className="nav-link text-light"
              to={`/dashboard?date=${previousDay}`}
            >
              <span className="oi oi-caret-left" />
              &nbsp; Previous Day
            </Link>
          </div>
          <div className="col-md-2">
            <Link className="nav-link text-light" to={`/dashboard`}>
              Today
            </Link>
          </div>
          <div className="col-md-2">
            <Link
              className="nav-link text-light"
              to={`/dashboard?date=${nextDay}`}
            >
              Next Day &nbsp;
              <span className="oi oi-caret-right" />
            </Link>
          </div>
        </div>
        <h5 className="row mx-0 my-1 m-md-1">{`Reservations for date: ${currentDay}`}</h5>
        <h5 className="row mx-0 my-1 m-md-1">{reservationsFound}</h5>
      </div>
      <div className="row"></div>
    </section>
  );
}

export default Nav;
