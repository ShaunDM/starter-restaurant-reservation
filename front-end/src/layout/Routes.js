import React from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import CreateReservation from "../reservation/CreateReservation";
import CreateTable from "../table/CreateTable";
import SeatTable from "../table/SeatTable";
import SearchReservations from "../reservation/SearchReservations";
import EditReservation from "../reservation/EditReservation";
import Logs from "../logs/Logs";
import NotFound from "./NotFound";
import { currentDate } from "../utils/date-time";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */

function Routes() {
  const search = useLocation().search;
  const date = new URLSearchParams(search).get("date");

  return (
    <Switch>
      <Route exact={true} path="/search">
        <SearchReservations />
      </Route>
      <Route path="/reservations/new">
        <CreateReservation />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <SeatTable />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <EditReservation />
      </Route>
      <Route path="/tables/new">
        <CreateTable />
      </Route>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={currentDate(date)} />
      </Route>
      <Route path="/logs">
        <Logs />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
