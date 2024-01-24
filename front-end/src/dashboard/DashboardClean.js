import React from "react";
import Tables from "./Tables";
import Reservations from "./Reservations";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

function DashboardClean({ date }) {
  return (
    <main>
      <h1>Dashboard</h1>
      <Reservations date={date} />
      <Tables />
    </main>
  );
}

export default DashboardClean;
