import pino from "pino";
require("dotenv").config();

const LOG_LEVEL = parseInt(process.env.REACT_APP_LOG_LEVEL) || 30;
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

const headers = new Headers();
headers.append("Content-Type", "application/json");

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

const levels = [
  { label: "trace", value: 10 },
  { label: "debug", value: 20 },
  { label: "info", value: 30 },
  { label: "warn", value: 40 },
  { label: "error", value: 50 },
  { label: "fatal", value: 60 },
];

async function createLog(logEvent, LOG_LEVEL) {
  logEvent.level = levels.filter((e) => logEvent.level === e.value)[0];
  if (logEvent.level >= LOG_LEVEL) {
    const url = `${API_BASE_URL}/logging`;
    await fetchJson(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ data: logEvent }),
    });
  }
}

const logger = pino({
  browser: {
    serialize: true,
    asObject: true,
    write: (logEvent) => {
      createLog(logEvent, LOG_LEVEL);
    },
  },
});

export default logger;
