/**
 * Defines the body of the logs table.
 * @param logs
 *  an array of logs the developer wants to view.
 * @param columns
 *  the labels and accessors for the columns of the logs table.
 * @returns {JSX.Element}
 */

function LogsBody({ logs, columns }) {
  let tableRows = "";
  if (logs.length) {
    tableRows = logs.map((log) => {
      return (
        <tr key={log.log_id}>
          {columns.map(({ accessor }) => {
            const tData = log[accessor] ? log[accessor] : "——";
            return <td key={accessor}>{tData}</td>;
          })}
        </tr>
      );
    });
  }
  return <tbody>{tableRows}</tbody>;
}

export default LogsBody;
