import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { readReservation, updateReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm";
// import logger from "../utils/logger";

/**
 * Defines the edit reservation page.
 * @returns {JSX.Element}
 */

function EditReservation() {
  const { reservation_id } = useParams();
  const history = useHistory();

  const reservationInit = {
    reservation_id: -1,
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 2,
    status: "",
    created_at: "",
    updated_at: "",
  };

  const [reservation, setReservation] = useState(reservationInit);
  const [error, setError] = useState(null);

  useEffect(loadReservation, [reservation_id]);

  function loadReservation() {
    // const method_name = "loadReservation";
    // logger.debug({
    //   file_name,
    //   method_name,
    //   message: `started ${method_name}`,
    // });

    if (reservation_id) {
      const abortController = new AbortController();
      setError(null);
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
        .catch((err) => {
          setError(err);
        });
      return () => abortController.abort();
    }
  }

  function cancelHandler() {
    // const method_name = "cancelHandler";
    // logger.debug({
    //   file_name,
    //   method_name,
    //   message: `started ${method_name}`,
    //   params: `reservation_id: ${reservation_id}`,
    // });
    history.go(-1);
  }

  function changeHandler({ target, target: { name, value } }) {
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
    updateReservation(reservation)
      .then((response) => {
        // logger.trace({
        //   file_name,
        //   method_name: `${method_name}/updateReservation`,
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
      <h1 className="mb-3">Edit Reservation</h1>
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

export default EditReservation;

// const file_name = "EditReservation";
// logger.info({
//   file_name,
//   method_name: file_name,
//   message: `started ${file_name}`,
// });
// const { reservation_id } = useParams();
// const reservation = { reservation_id: reservation_id };
// const [error, setError] = useState(null);

// const history = useHistory();

// function cancelHandler() {
//   const method_name = "cancelHandler";
//   logger.debug({
//     file_name,
//     method_name,
//     message: `started ${method_name}`,
//   });
//   if (window.confirm("Do you want to cancel this reservation?")) {
//     const abortController = new AbortController();
//     setError(null);
//     readReservation(reservation_id, abortController.signal).then(
//       (response) => {
//         logger.trace({
//           file_name,
//           method_name: `${method_name}/readReservation`,
//           message: `valid`,
//           params: `Response: ${response}`,
//         });
//         changeReservationStatus(
//           { ...response, status: "cancelled" },
//           abortController.signal
//         )
//           .then((response) => {
//             logger.trace({
//               file_name,
//               method_name: `${method_name}/readReservation.then(changeReservationStatus)`,
//               message: `valid`,
//               params: `Response: ${response}`,
//             });
//             history.goBack();
//           })
//           .catch((err) => {
//             setError(err);
//           });
//       }
//     );
//     return () => abortController.abort();
//   }
// }
