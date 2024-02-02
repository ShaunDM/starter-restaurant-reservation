import React from "react";
// import logger from "../utils/logger";

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
  // const file_name = "ReservationForm";
  // logger.info({
  //   file_name,
  //   method_name: file_name,
  //   message: `started ${file_name}`,
  // });
  return (
    <form onSubmit={submitHandler} className="mb-4">
      <div className="row my-3 font-weight-bold">
        <div className="col-6 form-group ">
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
          <label className="form-label " htmlFor="last_name">
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
