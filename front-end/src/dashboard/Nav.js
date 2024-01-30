import React from "react";
import { Link, useLocation } from "react-router-dom";
import { previous, next } from "../utils/date-time";

function Nav({ date }) {
  const search = useLocation().search;
  let currentDay = new URLSearchParams(search).get("date");
  if (!currentDay) {
    currentDay = date;
  }
  const nextDay = next(currentDay);
  const previousDay = previous(currentDay);
  return (
    <nav>
      <h1>Dashboard</h1>
      <h4 className="mb-0">{`Reservations for date: ${currentDay}`}</h4>

      <button className="nav-item btn">
        <Link className="nav-link" to={`/dashboard?date=${previousDay}`}>
          Previous Day
        </Link>
      </button>
      <button className="nav-item btn">
        <Link className="nav-link" to={`/dashboard`}>
          Today
        </Link>
      </button>
      <button className="nav-item btn">
        <Link className="nav-link" to={`/dashboard?date=${nextDay}`}>
          Next Day
        </Link>
      </button>
    </nav>
  );
}

export default Nav;
