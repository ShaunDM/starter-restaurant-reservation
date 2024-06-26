/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

export async function createReservation(reservation, signal) {
  const url = `${API_BASE_URL}/reservations/new`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: reservation }),
    signal,
  };
  return await fetchJson(url, options);
}

export async function listTables(signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  // const options = {
  //   method: "GET",
  //   headers,
  //   signal,
  // };
  return await fetchJson(url, { headers, signal });
}

export async function createTable(table, signal) {
  const url = `${API_BASE_URL}/tables/new`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: table }),
    signal,
  };
  return await fetchJson(url, options);
}

export async function readReservation(reservation_id, signal) {
  const url = `${API_BASE_URL}/reservations/${reservation_id}`;
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

export async function seatTable(seat, signal) {
  const url = `${API_BASE_URL}/reservations/${seat.reservation_id}/tables/${seat.table_id}/seat`;
  const options = {
    method: "PUT",
    body: JSON.stringify({ data: { status: "Sat" } }),
    headers,
    signal,
  };
  return await fetchJson(url, options);
}

export async function finishTable(finish, signal) {
  const url = `${API_BASE_URL}/reservations/${finish.reservation_id}/tables/${finish.table_id}/finish`;
  const options = {
    method: "PUT",
    body: JSON.stringify({ data: { status: "Finished" } }),
    headers,
    signal,
  };
  return await fetchJson(url, options);
}

export async function cancelReservation(reservation_id, signal) {
  const url = `${API_BASE_URL}/reservations/${reservation_id}/cancel`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { status: "Cancelled" } }),
    signal,
  };
  return await fetchJson(url, options);
}

export async function searchReservations(signal) {
  const url = `${API_BASE_URL}/reservations${window.location.search}`;
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

export async function updateReservation(updatedReservation, signal) {
  const { reservation_id } = updatedReservation;
  const url = `${API_BASE_URL}/reservations/${reservation_id}/edit`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: updatedReservation }),
    signal,
  };
  return await fetchJson(url, options);
}

export async function listLogs(logLevel, signal) {
  console.log("logLevel", logLevel);
  let url = `${API_BASE_URL}/logging`;
  if (logLevel) {
    url = `${API_BASE_URL}/logging?level=${logLevel}`;
  }
  const options = {
    method: "GET",
    headers,
    signal,
  };
  console.log(url);
  return await fetchJson(url, options);
}

export async function truncateLogs(signal) {
  const url = `${API_BASE_URL}/logging`;
  const options = {
    method: "DELETE",
    headers,
    signal,
  };
  return await fetchJson(url, options);
}
