import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import logger from "../utils/logger";

/**
 * Defines the page for a user to create a table.
 * @returns {JSX.Element}
 */

function CreateTable() {
  const file_name = "CreateTable";
  logger.info({
    file_name,
    method_name: file_name,
    message: `started ${file_name}`,
  });

  const history = useHistory();
  const [error, setError] = useState(null);
  const [table, setTable] = useState({
    table_name: "",
    capacity: "",
  });

  function changeHandler({ target, target: { name, value } }) {
    const method_name = "changeHandler";
    logger.trace({
      file_name,
      method_name,
      message: `started ${method_name}`,
      params: `target: ${target}`,
    });

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

  function cancelHandler() {
    const method_name = "cancelHandler";
    logger.debug({
      file_name,
      method_name,
      message: `started ${method_name}`,
    });
    history.goBack();
  }

  function submitHandler(event) {
    const method_name = "submitHandler";
    logger.debug({
      file_name,
      method_name,
      message: `started ${method_name}`,
      params: `table: ${table}`,
    });

    event.preventDefault();
    const abortController = new AbortController();
    createTable(table)
      .then((response) => {
        logger.trace({
          file_name,
          method_name: `${method_name}/createTable`,
          message: `valid`,
          params: `Response: ${response}`,
        });

        history.push("/");
      })
      .catch(setError);
    return () => abortController.abort();
  }

  return (
    <main>
      <nav className="row bg-dark p-0 ">
        <h1 className="mb-3 ml-3 text-light">Create Table</h1>
      </nav>
      <ErrorAlert error={error} />
      <form onSubmit={submitHandler} className="mb-4">
        <div className="row my-3 font-weight-bold">
          <div className="col-md-6 form-group">
            <label className="form-label" htmlFor="table_name">
              Table Name
            </label>
            <input
              className="form-control"
              id="table_name"
              name="table_name"
              type="text"
              placeholder="Must be at least 2 characters"
              minlength="2"
              value={table.table_name}
              onChange={changeHandler}
              required={true}
            />
          </div>
          <div className="col-md-6 form-group">
            <label className="form-label" htmlFor="capacity">
              Capacity
            </label>
            <input
              className="form-control"
              id="capacity"
              name="capacity"
              type="number"
              placeholder="Must seat at least 1"
              min="1"
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
