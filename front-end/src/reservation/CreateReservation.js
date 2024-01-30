import React from "react";
import ReservationForm from "./ReservationForm";

// import { today } from "../utils/date-time";
//Can't use mins or maxes for the html inputs as it prevents thinkful tests from submitting to server, today function was going to be min for date.

function CreateReservation() {
  return (
    <main>
      <h1 className="mb-3">Create Reservation</h1>
      <ReservationForm />
    </main>
  );
}

export default CreateReservation;
