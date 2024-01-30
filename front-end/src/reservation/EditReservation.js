import React from "react";
// import {
//   useParams,
//   useHistory,
// } from "react-router-dom/cjs/react-router-dom.min";
import ReservationForm from "./ReservationForm";
// import ErrorAlert from "../layout/ErrorAlert";
// import { changeReservationStatus, readReservation } from "../utils/api";
// import logger from "../utils/logger";

function EditReservation() {
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

  return (
    <main>
      <h1 className="mb-3">Edit Reservation</h1>
      {/* <ErrorAlert error={error} /> */}
      <ReservationForm />
    </main>
  );
}

export default EditReservation;
