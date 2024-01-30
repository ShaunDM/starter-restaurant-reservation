import pino from "pino";
require("dotenv").config();

const LOG_LEVEL = process.env.LOG_LEVEL || "info";

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

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";
const headers = new Headers();
headers.append("Content-Type", "application/json");

const send = async function (level, logEvent, a, b) {
  console.log(LOG_LEVEL);
  const url = `${API_BASE_URL}/logging`;
  await fetchJson(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ data: logEvent }),
  });
};

const logger = pino({
  browser: {
    serialize: true,
    asObject: true,
    transmit: {
      level: LOG_LEVEL,
      send,
    },
  },
});

export default logger;
