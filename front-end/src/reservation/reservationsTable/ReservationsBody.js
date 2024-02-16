import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { changeReservationStatus, readReservation } from "../../utils/api";
import ErrorAlert from "../../layout/ErrorAlert";
import logger from "../../utils/logger";
import { today } from "../../utils/date-time";

/**
 * Defines the body of the reservation's table.
 * @param reservations
 *  an array of reservations for which the user wants to view.
 *  @param columns
 *  the labels and accessors for the columns of the reservations table.
 * @returns {JSX.Element}
 */

function ReservationsBody({ reservations, columns }) {
  const file_name = "ReservationsBody";
  logger.info({
    file_name,
    method_name: file_name,
    message: `started ${file_name}`,
    params: `reservations: ${reservations}, columns: ${columns}`,
  });

  //Was going to adjust so that the reservation could only be seated if it was for today's date, but caused tests to fail.

  const [error, setError] = useState(null);
  const history = useHistory();

  if (reservations && reservations.length) {
    function cancelHandler({ target }) {
      const method_name = "cancelHandler";
      logger.debug({
        file_name,
        method_name,
        message: `started ${method_name}`,
      });

      if (window.confirm("Do you want to cancel this reservation?")) {
        const abortController = new AbortController();
        setError(null);
        readReservation(target.value, abortController.signal).then((result) =>
          changeReservationStatus(
            { ...result, status: "cancelled" },
            abortController.signal
          )
            .then((response) => {
              logger.trace({
                file_name,
                method_name: `${method_name}/readReservation`,
                message: `valid`,
                params: `Response: ${response}`,
              });
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
            className="btn btn-dark"
          >
            Seat
          </Link>
        </td>
      );
      const addNoSeat = (
        <td key="seat" data-reservation-id-status={reservation.reservation_id}>
          <button className="btn btn-dark" disabled>
            Seat
          </button>
        </td>
      );
      const addEdit = (
        <td key="edit" data-reservation-id-status={reservation.reservation_id}>
          <Link
            to={`/reservations/${reservation.reservation_id}/edit`}
            className="btn btn-info"
          >
            Edit
          </Link>
        </td>
      );
      const addCancel = (
        <td
          key="cancel"
          data-reservation-id-cancel={reservation.reservation_id}
        >
          <button
            className="btn btn-danger"
            type="button"
            onClick={cancelHandler}
            value={reservation.reservation_id}
          >
            Cancel
          </button>
        </td>
      );
      let tData = "";
      return (
        <tr key={reservation.reservation_id}>
          {columns.map(({ accessor }) => {
            if (accessor === "seat") {
              if (
                reservation.reservation_date !== today() ||
                reservation.status !== "booked"
              ) {
                return addNoSeat;
              }
              return addSeat;
            } else if (accessor === "edit") {
              return addEdit;
            } else if (accessor === "cancel_reservation") {
              return addCancel;
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
