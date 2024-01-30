import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { changeReservationStatus, readReservation } from "../../utils/api";
// import logger from "../../utils/logger";
import ErrorAlert from "../../layout/ErrorAlert";

//Was going to adjust if table could be seated through today's date, but caused tests to fail.
// let today = new Date();
// const dd = String(today.getDate()).padStart(2, "0");
// const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
// const yyyy = today.getFullYear();
// today = yyyy + "-" + mm + "-" + dd;

function ReservationsBody({ reservations, columns }) {
  // const file_name = "ReservationsBody";
  // logger.info({
  //   file_name,
  //   method_name: file_name,
  //   message: `started ${file_name}`,
  //   params: `reservations: ${reservations}, columns: ${columns}`,
  // });

  const [error, setError] = useState(null);
  const history = useHistory();

  if (reservations && reservations.length) {
    function cancelHandler({ target }) {
      // const method_name = "cancelHandler";
      // logger.debug({
      //   file_name,
      //   method_name,
      //   message: `started ${method_name}`,
      // });

      if (window.confirm("Do you want to cancel this reservation?")) {
        const abortController = new AbortController();
        setError(null);
        readReservation(target.value, abortController.signal).then((result) =>
          changeReservationStatus(
            { ...result, status: "cancelled" },
            abortController.signal
          )
            .then((response) => {
              // logger.trace({
              //   file_name,
              //   method_name: `${method_name}/readReservation`,
              //   message: `valid`,
              //   params: `Response: ${response}`,
              // });
              history.goBack();
            })
            .catch((err) => {
              setError(err);
            })
        );
        return () => abortController.abort();
      }
    }

    const tableRows = reservations.map((reservation) => {
      const addSeat = (
        <td key="seat" data-reservation-id-status={reservation.reservation_id}>
          <Link
            to={`/reservations/${reservation.reservation_id}/seat`}
            className="btn btn-primary"
          >
            Seat
          </Link>
        </td>
      );
      const addNoSeat = (
        <td key="seat" data-reservation-id-status={reservation.reservation_id}>
          <button className="btn btn-primary" disabled>
            Seat
          </button>
        </td>
      );
      const addEdit = (
        <Link
          to={`/reservations/${reservation.reservation_id}/edit`}
          className="btn btn-primary"
        >
          Edit
        </Link>
      );
      const addCancel = (
        <button
          className="btn btn-primary"
          type="button"
          onClick={cancelHandler}
          data-reservation-id-cancel={reservation.reservation_id}
          value={reservation.reservation_id}
        >
          Cancel Reservation
        </button>
      );
      let tData = "";
      return (
        <tr key={reservation.reservation_id}>
          {columns.map(({ accessor }) => {
            if (accessor === "seat") {
              return reservation.status === "booked" ? addSeat : addNoSeat;
            } else if (accessor === "edit") {
              tData = addEdit;
            } else if (accessor === "cancel_reservation") {
              tData = addCancel;
            } else {
              tData = reservation[accessor] ? reservation[accessor] : "——";
            }
            return <td key={accessor}>{tData}</td>;
          })}
        </tr>
      );
    });
    return (
      <>
        <ErrorAlert error={error} />
        <tbody>{tableRows}</tbody>
      </>
    );
  }
  return <tbody></tbody>;
}

export default ReservationsBody;
