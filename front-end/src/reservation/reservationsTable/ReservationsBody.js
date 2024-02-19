import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import logger from "../../utils/logger";
import { today } from "../../utils/date-time";

/**
 * Defines the body of the reservation's table.
 * @param reservations
 *  an array of reservations for which the user wants to view.
 *  @param columns
 *  the labels and accessors for the columns of the reservations table.
 *  @param cancelHandler
 *  the function that handles cancelling a reservation.
 * @returns {JSX.Element}
 */

function ReservationsBody({ reservations, columns, cancelHandler }) {
  const file_name = "ReservationsBody";
  logger.info({
    file_name,
    method_name: file_name,
    message: `started ${file_name}`,
    params: `reservations: ${reservations}, columns: ${columns}`,
  });

  //Was going to adjust so that the reservation could only be sat if it was for today's date, but caused tests to fail.

  if (reservations && reservations.length) {
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
      const addNoEdit = (
        <td key="edit" data-reservation-id-status={reservation.reservation_id}>
          <button className="btn btn-info" disabled>
            Edit
          </button>
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
      const addNoCancel = (
        <td
          key="cancel"
          data-reservation-id-status={reservation.reservation_id}
        >
          <button className="btn btn-danger" disabled>
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
                reservation.status !== "Booked"
              ) {
                return addNoSeat;
              }
              return addSeat;
            } else if (accessor === "edit") {
              if (
                reservation.status === "Finished" ||
                reservation.status === "Cancelled"
              ) {
                return addNoEdit;
              }
              return addEdit;
            } else if (accessor === "cancel_reservation") {
              if (reservation.status !== "Booked") {
                return addNoCancel;
              }
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
        <tbody>{tableRows}</tbody>
      </>
    );
  }
  return <tbody></tbody>;
}

export default ReservationsBody;
