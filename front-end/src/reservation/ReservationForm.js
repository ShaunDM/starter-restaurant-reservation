import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  createReservation,
  readReservation,
  updateReservation,
} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
// import logger from "../utils/logger";

function ReservationForm() {
  // const file_name = "ReservationForm";
  // logger.info({
  //   file_name,
  //   method_name: file_name,
  //   message: `started ${file_name}`,
  // });

  const history = useHistory();
  const mountedRef = useRef(true);

  const { reservation_id } = useParams();
  const [error, setError] = useState(null);
  const [reservation, setReservation] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 2,
  });

  useEffect(loadReservation, [reservation_id]);

  function loadReservation() {
    // const method_name = "loadReservation";
    // logger.debug({
    //   file_name,
    //   method_name,
    //   message: `started ${method_name}`,
    // });

    if (reservation_id) {
      const abortController = new AbortController();
      setError(null);
      readReservation(reservation_id, abortController.signal)
        .then((response) => {
          // logger.trace({
          //   file_name,
          //   method_name: `${method_name}/readReservation`,
          //   message: `valid`,
          //   params: `Response: ${response}`,
          // });
          if (!mountedRef.current) return null;
          setReservation(response);
        })
        .catch((err) => {
          if (!mountedRef.current) return null;
          setError(err);
        });
      return () => abortController.abort();
    }
  }

  function cancelHandler() {
    // const method_name = "cancelHandler";
    // logger.debug({
    //   file_name,
    //   method_name,
    //   message: `started ${method_name}`,
    //   params: `reservation_id: ${reservation_id}`,
    // });
    if (reservation_id) {
      console.log("cancelHandler, Reservation form", reservation_id);
      history.go(-1);
    } else {
      history.push("/");
    }
  }

  function changeHandler({ target, target: { name, value } }) {
    // const method_name = "changeHandler";
    // logger.trace({
    //   file_name,
    //   method_name,
    //   message: `started ${method_name}`,
    //   params: `target: ${target}`,
    // });
    if (name === "people") {
      setReservation({ ...reservation, people: parseInt(value) });
    } else {
      setReservation((previousReservation) => ({
        ...previousReservation,
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
    //   params: `reservation: ${reservation}`,
    // });
    event.preventDefault();
    if (!reservation_id) {
      createReservation(reservation)
        .then((response) => {
          // logger.trace({
          //   file_name,
          //   method_name: `${method_name}/createReservation`,
          //   message: `valid`,
          //   params: `Response: ${response}`,
          // });
          history.push(`/dashboard?date=${reservation.reservation_date}`);
        })
        .catch(setError);
    } else {
      const abortController = new AbortController();
      updateReservation(reservation)
        .then((response) => {
          // logger.trace({
          //   file_name,
          //   method_name: `${method_name}/updateReservation`,
          //   message: `valid`,
          //   params: `Response: ${response}`,
          // });
          history.push(`/dashboard?date=${reservation.reservation_date}`);
        })
        .catch(setError);
      return () => abortController.abort();
    }
  }

  return (
    <form onSubmit={submitHandler} className="mb-4">
      <ErrorAlert error={error} />
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
            placeholder="xxx-xxx-xxxx"
            value={reservation.mobile_number}
            onChange={changeHandler}
            required={true}
          />
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
            // min={today()}
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
            // min="10:30"
            // max="21:30"
            value={reservation.reservation_time}
            onChange={changeHandler}
            required={true}
          />
          <small>
            Reservations are allowed for the hours of 10:30am to 9:30pm
          </small>
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
            // min="1"
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
  );
}

export default ReservationForm;
