import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { today } from "../utils/date-time";

function ReservationCreate() {
  const history = useHistory();
  const [error, setError] = useState(null);

  const [reservation, setReservation] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  });

  function cancelHandler() {
    history.push("/");
  }

  function changeHandler({ target: { name, value } }) {
    setReservation((previousReservation) => ({
      ...previousReservation,
      [name]: value,
    }));
  }

  function submitHandler(event) {
    event.preventDefault();
    createReservation(reservation)
      .then(() => {
        history.push("/");
      })
      .catch(setError);
  }

  return (
    <main>
      <h1 className="mb-3">Create Reservation</h1>
      <ErrorAlert error={error} />
      <form onSubmit={submitHandler} className="mb-4">
        <div className="row mb-3">
          <div className="col-6 form-group">
            <label className="form-label" htmlFor="first_name">
              First Name
            </label>
            <input
              className="form-control"
              id="first_name"
              name="first_name"
              type="text"
              value={reservation.first_name}
              onChange={changeHandler}
              required={true}
            />
          </div>
          <div className="col-6 form-group">
            <label className="form-label" htmlFor="last_name">
              Last Name
            </label>
            <input
              className="form-control"
              id="last_name"
              name="last_name"
              type="text"
              value={reservation.last_name}
              onChange={changeHandler}
              required={true}
            />
          </div>
          <div className="col-6 form-group">
            <label className="form-label" htmlFor="mobile_number">
              Mobile Number
            </label>
            <input
              className="form-control"
              id="mobile_number"
              name="mobile_number"
              type="tel"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              placeholder="xxx-xxx-xxxx"
              value={reservation.mobile_number}
              onChange={changeHandler}
              required={true}
            />
            <small>Format: 123-456-7890</small>
          </div>
          <div className="col-6 form-group">
            <label className="form-label" htmlFor="reservation_date">
              Reservation Date
            </label>
            <input
              className="form-control"
              id="reservation_date"
              name="reservation_date"
              type="date"
              min={today()}
              value={reservation.reservation_date}
              onChange={changeHandler}
              required={true}
            />
          </div>
          <div className="col-6 form-group">
            <label className="form-label" htmlFor="reservation_time">
              Reservation Date
            </label>
            <input
              className="form-control"
              id="reservation_time"
              name="reservation_time"
              type="time"
              min="10:30"
              max="21:30"
              value={reservation.reservation_time}
              onChange={changeHandler}
              required={true}
            />
            <small>Office hours are 9am to 6pm</small>
          </div>
          <div className="col-6 form-group">
            <label className="form-label" htmlFor="people">
              Party Size
            </label>
            <input
              className="form-control"
              id="people"
              name="people"
              type="number"
              value={reservation.people}
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

export default ReservationCreate;
