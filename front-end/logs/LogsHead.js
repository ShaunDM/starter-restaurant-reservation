/**
 * Defines the head of the logs table.
 * @param columns
 *  the labels and accessors for the columns of the logs table.
 * @returns {JSX.Element}
 */

const LogsHead = ({ columns }) => {
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
};

export default LogsHead;
