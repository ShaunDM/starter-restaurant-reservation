import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import ReservationCreate from "../reservationCreate/ReservationCreate";
import TableCreate from "../tableCreate/TableCreate";
import Seat from "../seat/Seat";
import Search from "../search/Search";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */

function Routes() {
  return (
    <Switch>
      <Route path="/reservations/new">
        <ReservationCreate />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <Seat />
      </Route>
      <Route path="/tables/new">
        <TableCreate />
      </Route>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={today()} />
      </Route>
      <Route path="/search">
        <Search />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
