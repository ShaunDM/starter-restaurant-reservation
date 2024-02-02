/**
 * Defiines the head of the tables table
 *  @param columns
 *  the labels and accessors for the columns of the tables table.
 * @returns {JSX.Element}
 */

function TablesHead({
  columns = [
    { label: "Table ID", accessor: "table_id" },
    { label: "Table Name", accessor: "table_name" },
    { label: "Capacity", accessor: "capacity" },
    { label: "Availability", accessor: "reservation_id" },
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

export default TablesHead;
