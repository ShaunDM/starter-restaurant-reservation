import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { cancelReservation } from "../../utils/api";
import ReservationsBody from "./ReservationsBody";
import ReservationsHead from "./ReservationsHead";
import ErrorAlert from "../../layout/ErrorAlert";
import logger from "../../utils/logger";

/**
 * Renders a list of reservations for various pages.
 * @param reservations
 *  an array of reservations the user wishes to view.
 * @returns {JSX.Element}
 */

function ReservationsTable({ reservations }) {
  const file_name = "ReservationsTable";
  logger.info({
    file_name,
    method_name: file_name,
    message: `started ${file_name}`,
    params: `reservations: ${reservations}`,
  });

  const [error, setError] = useState(null);
  const history = useHistory();

  const columns = [
    { label: "Reservation ID", accessor: "reservation_id" },
    { label: "First Name", accessor: "first_name" },
    { label: "Last Name", accessor: "last_name" },
    { label: "Mobile Number", accessor: "mobile_number" },
    { label: "Reservation Date", accessor: "reservation_date" },
    { label: "Reservation Time", accessor: "reservation_time" },
    { label: "People", accessor: "people" },
    { label: "Status", accessor: "status" },
    { label: "Seat", accessor: "seat" },
    { label: "Edit", accessor: "edit" },
    { label: "Cancel", accessor: "cancel_reservation" },
  ];

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
      cancelReservation(target.value, abortController.signal)
        .then((response) => {
          logger.trace({
            file_name,
            method_name: `${method_name}/cancelReservation`,
            message: `valid`,
            params: `Response: ${response}`,
          });
          history.go(0);
        })
        .catch((err) => {
          setError(err);
        });
      return () => abortController.abort();
    }
  }

  return (
    <>
      <ErrorAlert error={error} />
      <table className="table table-striped">
        <ReservationsHead columns={columns} />
        <ReservationsBody
          columns={columns}
          reservations={reservations}
          cancelHandler={cancelHandler}
        />
      </table>
    </>
  );
}

export default ReservationsTable;
