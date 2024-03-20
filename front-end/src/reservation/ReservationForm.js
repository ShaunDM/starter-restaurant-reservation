import React, { useEffect } from "react";
import { today } from "../utils/date-time";
import logger from "../utils/logger";

/**
 * Defines the form to create or edit a reservation.
 * @param reservation
 *  the reservation for which the user wants to edit or create.
 * @param cancelHandler
 *  the function that is triggered should a user press the cancel button.
 * @param changeHandler
 *  the function that is triggered should a user enter data into the form.
 * @param submitHandler
 *  the function that is triggered should a user submit the form.
 *  @returns {JSX.Element}
 */

function ReservationForm({
  reservation,
  cancelHandler,
  changeHandler,
  submitHandler,
}) {
  const file_name = "ReservationForm";
  logger.info({
    file_name,
    method_name: file_name,
    message: `started ${file_name}`,
  });

  useEffect(() => {
    // const script = document.createElement("script");

    // script.innnerHTML = () => {
    //   const input = document.querySelector("input");
    //   input.addEventListener("invalid", (e) => console.log(e.message));
    // };
    // document.body.appendChild(script);

    return () => {
      // document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <form onSubmit={submitHandler} className="mb-4">
        <div className="row my-3 font-weight-bold">
          <div className="col-6 form-group ">
            <label className="form-label" htmlFor="first_name">
              First Name
              <input
                className="form-control"
                id="first_name"
                name="first_name"
                type="text"
                value={reservation.first_name}
                onChange={changeHandler}
                required={true}
              />
            </label>
          </div>
          <div className="col-6 form-group">
            <label className="form-label " htmlFor="last_name">
              Last Name
              <input
                className="form-control"
                id="last_name"
                name="last_name"
                type="text"
                value={reservation.last_name}
                onChange={changeHandler}
                required={true}
              />
            </label>
          </div>
          <div className="col-6 form-group">
            <label className="form-label" htmlFor="mobile_number">
              Mobile Number
              <input
                className="form-control"
                id="mobile_number"
                name="mobile_number"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                maxLength={12}
                placeholder="xxx-xxx-xxxx"
                value={reservation.mobile_number}
                onChange={changeHandler}
                required={true}
              />
            </label>
          </div>
          <div className="col-6 form-group">
            <label className="form-label" htmlFor="reservation_date">
              Reservation Date
              <input
                className="form-control"
                id="reservation_date"
                name="reservation_date"
                type="date"
                placeholder="YYYY-MM-DD"
                pattern="\d{4}-\d{2}-\d{2}"
                min={today()}
                value={reservation.reservation_date}
                onChange={changeHandler}
                required={true}
              />
            </label>
            {/* <small>Date must be in format YYYY-MM-DD</small> */}
          </div>
          <div className="col-6 form-group">
            <label className="form-label" htmlFor="reservation_time">
              Reservation Time
              <input
                className="form-control"
                id="reservation_time"
                name="reservation_time"
                placeholder="HH:MM, military time"
                pattern="[0-9]{2}:[0-9]{2}"
                type="time"
                min="10:30"
                max="21:30"
                value={reservation.reservation_time}
                onChange={changeHandler}
                required={true}
              />
              <small>
                Reservations are allowed for the hours of 10:30am to 9:30pm
              </small>
            </label>
          </div>
          <div className="col-6 form-group">
            <label className="form-label" htmlFor="people">
              Party Size
              <input
                className="form-control"
                id="people"
                name="people"
                type="number"
                min="1"
                value={reservation.people}
                onChange={changeHandler}
                required={true}
              />
            </label>
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
    </>
  );
}

export default ReservationForm;
