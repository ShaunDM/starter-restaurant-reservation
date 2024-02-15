import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ReservationForm from "./ReservationForm";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation } from "../utils/api";
// import { today } from "../utils/date-time";

/**
 * Defines the page to create reservations.
 *
 * @returns {JSX.Element}
 */

function CreateReservation() {
  //Can't use mins or maxes for the html inputs as it prevents thinkful tests from submitting to server and consequently failing tests, today function was going to be min for date.

  const history = useHistory();

  const reservationInit = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  };

  const [error, setError] = useState(null);
  const [reservation, setReservation] = useState(reservationInit);

  // if (reservation.mobile_number.length < 4) {
  //   setReservation({
  //     ...reservation,
  //     mobile_number: reservation.mobile_number.replace(/[^0-9]/, ""),
  //   });
  // }

  function cancelHandler() {
    // const method_name = "cancelHandler";
    // logger.debug({
    //   file_name,
    //   method_name,
    //   message: `started ${method_name}`,
    //   params: `reservation_id: ${reservation_id}`,
    // });
    history.push("/");
  }

  function changeHandler({ target, target: { name, value } }) {
    // const method_name = "changeHandler";
    // logger.trace({
    //   file_name,
    //   method_name,
    //   message: `started ${method_name}`,
    //   params: `target: ${target}`,
    // });
    if (name === "people") {
      setReservation({ ...reservation, people: parseInt(value) });
    } else {
      setReservation((previousReservation) => ({
        ...previousReservation,
        [name]: value,
      }));
    }
  }

  function submitHandler(event) {
    // const method_name = "submitHandler";
    // logger.debug({
    //   file_name,
    //   method_name,
    //   message: `started ${method_name}`,
    //   params: `reservation: ${reservation}`,
    // });
    event.preventDefault();
    const abortController = new AbortController();

    createReservation(reservation)
      .then((response) => {
        // logger.trace({
        //   file_name,
        //   method_name: `${method_name}/createReservation`,
        //   message: `valid`,
        //   params: `Response: ${response}`,
        // });
        history.push(`/dashboard?date=${reservation.reservation_date}`);
      })
      .catch(setError);
    return () => abortController.abort();
  }

  return (
    <main>
      <nav className="row bg-dark p-0">
        <h1 className="mb-3 ml-3 text-light">Create Reservation</h1>
      </nav>
      <ErrorAlert error={error} />
      <ReservationForm
        reservation={reservation}
        cancelHandler={cancelHandler}
        changeHandler={changeHandler}
        submitHandler={submitHandler}
      />
    </main>
  );
}

export default CreateReservation;
