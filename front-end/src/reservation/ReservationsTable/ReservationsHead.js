function ReservationsHead({ columns }) {
  return (
    <thead>
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
