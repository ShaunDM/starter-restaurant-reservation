/**
 * Defines the head of the reservations table
 *  @param columns
 *  the labels and accessors for the columns of the reservations table.
 * @returns {JSX.Element}
 */

function ReservationsHead({
  columns = [
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
    { label: "Cancel Reservation", accessor: "cancel_reservation" },
  ],
}) {
  return (
    <thead className="thead-dark">
      <tr>
        {columns.map(({ label, accessor }) => {
          return (
            <th scope="col" key={accessor}>
              {label}
            </th>
          );
        })}
      </tr>
    </thead>
  );
}

export default ReservationsHead;
