import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
// import logger from "../utils/logger";

/**
 * Defines the page for a user to create a table.
 * @returns {JSX.Element}
 */

function CreateTable() {
  // const file_name = "SeatTable";
  // logger.info({
  //   file_name,
  //   method_name: file_name,
  //   message: `started ${file_name}`,
  // });
  const history = useHistory();
  const [error, setError] = useState(null);

  const [table, setTable] = useState({
    table_name: "",
    capacity: "",
  });

  function cancelHandler() {
    // const method_name = "cancelHandler";
    // logger.debug({
    //   file_name,
    //   method_name,
    //   message: `started ${method_name}`,
    // });
    history.goBack();
  }

  function changeHandler({ target, target: { name, value } }) {
    // const method_name = "changeHandler";
    // logger.trace({
    //   file_name,
    //   method_name,
    //   message: `started ${method_name}`,
    //   params: `target: ${target}`,
    // });
    if (name === "capacity") {
      setTable((previousTable) => ({
        ...previousTable,
        capacity: parseInt(value),
      }));
    } else {
      setTable((previousTable) => ({
        ...previousTable,
        [name]: value,
      }));
    }
  }

  function submitHandler(event) {
    // const method_name = "submitHandler";
    // logger.debug({
    //   file_name,
    //   method_name,
    //   message: `started ${method_name}`,
    //   params: `table: ${table}`,
    // });
    event.preventDefault();
    createTable(table)
      .then((response) => {
        // logger.trace({
        //   file_name,
        //   method_name: `${method_name}/createTable`,
        //   message: `valid`,
        //   params: `Response: ${response}`,
        // });
        history.push("/");
      })
      .catch(setError);
  }

  return (
    <main>
      <h1 className="mb-3">Create Table</h1>
      <ErrorAlert error={error} />
      <form onSubmit={submitHandler} className="mb-4">
        <div className="row mb-3">
          <div className="col-6 form-group">
            <label className="form-label" htmlFor="table_name">
              Table Name
            </label>
            <input
              className="form-control"
              id="table_name"
              name="table_name"
              type="text"
              // minlength="2"
              value={table.table_name}
              onChange={changeHandler}
              required={true}
            />
          </div>
          <div className="col-6 form-group">
            <label className="form-label" htmlFor="capacity">
              Capacity
            </label>
            <input
              className="form-control"
              id="capacity"
              name="capacity"
              type="number"
              // min="1"
              value={table.capacity}
              onChange={changeHandler}
              required={true}
            />
          </div>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-secondary mr-2"
            onClick={cancelHandler}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </main>
  );
}

export default CreateTable;
