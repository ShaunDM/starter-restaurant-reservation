import React from "react";
import ReservationsBody from "./ReservationsBody";
import ReservationsHead from "./ReservationsHead";
// import logger from "../../utils/logger";

function ReservationsTable({ reservations }) {
  // const file_name = "ReservationsTable";
  // logger.info({
  //   file_name,
  //   method_name: file_name,
  //   message: `started ${file_name}`,
  //   params: `reservations: ${reservations}`,
  // });

  const columns = [
    { label: "Reservation ID", accessor: "reservation_id" },
    { label: "First Name", accessor: "first_name" },
    { label: "Last Name", accessor: "last_name" },
    { label: "Mobile Number", accessor: "mobile_number" },
    { label: "Reservation Date", accessor: "reservation_date" },
    { label: "Reservation Time", accessor: "reservation_time" },
    { label: "People", accessor: "people" },
    { label: "Status", accessor: "status" },
    { label: "Edit", accessor: "edit" },
    { label: "Seat", accessor: "seat" },
    { label: "Cancel Reservation", accessor: "cancel_reservation" },
  ];

  return (
    <table className="table">
      <ReservationsHead columns={columns} />
      <ReservationsBody columns={columns} reservations={reservations} />
    </table>
  );
}

export default ReservationsTable;
