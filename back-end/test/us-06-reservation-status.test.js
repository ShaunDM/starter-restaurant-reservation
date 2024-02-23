const request = require("supertest");

const app = require("../src/app");
const knex = require("../src/db/connection");
const api = require("../src/api");

describe("US-06 - Reservation status", () => {
  beforeAll(() => {
    return knex.migrate
      .forceFreeMigrationsLock()
      .then(() => knex.migrate.rollback(null, true))
      .then(() => knex.migrate.latest());
  });

  beforeEach(() => {
    return knex.seed.run();
  });

  afterAll(async () => {
    return await knex.migrate.rollback(null, true).then(() => knex.destroy());
  });

  describe("POST /reservations", () => {
    test("returns 201 if status is 'Booked'", async () => {
      const data = {
        first_name: "first",
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_date: api.today(),
        reservation_time: "17:30",
        people: 2,
      };

      const response = await request(app)
        .post("/reservations/new")
        .set("Accept", "application/json")
        .send({ data });

      expect(response.body.error).toBeUndefined();
      expect(response.body.data).toEqual(
        expect.objectContaining({
          first_name: "first",
          last_name: "last",
          mobile_number: "800-555-1212",
          people: 2,
          status: "Booked",
        })
      );
      expect(response.status).toBe(201);
    });

    test.each(["Sat", "Finished"])(
      "returns 400 if status is '%s'",
      async (status) => {
        const data = {
          first_name: "first",
          last_name: "last",
          mobile_number: "800-555-1212",
          reservation_date: api.today(),
          reservation_time: "17:30",
          people: 2,
          status,
        };

        const response = await request(app)
          .post("/reservations/new")
          .set("Accept", "application/json")
          .send({ data });

        expect(response.body.error).toContain(status);
        expect(response.status).toBe(400);
      }
    );
  });

  describe("PUT /reservations/:reservation_id/tables/:table_id/seat", () => {
    let reservationOne;
    let reservationTwo;
    let tableOne;

    const data = {
      first_name: "first",
      last_name: "last",
      mobile_number: "800-555-1212",
      reservation_date: api.today(),
      reservation_time: "17:30",
      people: 2,
    };

    beforeEach(async () => {
      await request(app)
        .post("/reservations/new")
        .set("Accept", "application/json")
        .send({ data });

      await request(app)
        .post("/reservations/new")
        .set("Accept", "application/json")
        .send({ data: { ...data, reservation_time: "18:30" } });

      [reservationOne, reservationTwo] = await knex("reservations")
        .where("reservation_date", data.reservation_date)
        .orderBy(["reservation_date", "reservation_time"]);
      tableOne = await knex("tables").where("table_name", "#1").first();
    });

    test("returns 400 for unknown status", async () => {
      expect(reservationOne).not.toBeUndefined();

      const response = await request(app)
        .put(
          `/reservations/${reservationOne.reservation_id}/tables/${tableOne.table_id}/seat`
        )
        .set("Accept", "application/json")
        .send({ data: { status: "unknown" } });

      expect(response.body.error).toContain("unknown");
      expect(response.status).toBe(400);
    });

    test("returns 400 if status is currently Finished (a Finished reservation cannot be updated)", async () => {
      expect(reservationOne).not.toBeUndefined();

      reservationOne.status = "Finished";
      await knex("reservations")
        .where({ reservation_id: reservationOne.reservation_id })
        .update(reservationOne, "*");

      const response = await request(app)
        .put(
          `/reservations/${reservationOne.reservation_id}/tables/${tableOne.table_id}/seat`
        )
        .set("Accept", "application/json")
        .send({ data: { status: "Sat" } });

      expect(response.body.error).toContain("Finished");
      expect(response.status).toBe(400);
    });
  });

  describe("PUT /reservations/:reservation_id/tables/:table_id/seat", () => {
    let reservationOne;
    let tableOne;
    let tableTwo;

    const data = {
      first_name: "first",
      last_name: "last",
      mobile_number: "800-555-1212",
      reservation_date: api.today(),
      reservation_time: "17:30",
      people: 2,
    };

    beforeEach(async () => {
      await request(app)
        .post("/reservations/new")
        .set("Accept", "application/json")
        .send({ data });

      reservationOne = await knex("reservations")
        .where("reservation_date", data.reservation_date)
        .orderBy(["reservation_date", "reservation_time"])
        .first();
      [tableOne, tableTwo] = await knex("tables").orderBy("table_name");
    });

    test("returns 200 and changes reservation status to 'Sat'", async () => {
      expect(tableOne).not.toBeUndefined();
      expect(reservationOne).not.toBeUndefined();

      const seatResponse = await request(app)
        .put(
          `/reservations/${reservationOne.reservation_id}/tables/${tableOne.table_id}/seat`
        )
        .set("Accept", "application/json")
        .send({ data: { status: "Sat" } });

      expect(seatResponse.body.error).toBeUndefined();
      expect(seatResponse.status).toBe(200);

      const reservationResponse = await request(app)
        .get(`/reservations/${reservationOne.reservation_id}`)
        .set("Accept", "application/json");

      expect(reservationResponse.body.error).toBeUndefined();
      expect(reservationResponse.body.data).toHaveProperty("status", "Sat");
      expect(reservationResponse.status).toBe(200);
    });

    test("returns 400 if reservation is already 'Sat'", async () => {
      expect(tableOne).not.toBeUndefined();
      expect(reservationOne).not.toBeUndefined();

      const firstSeatResponse = await request(app)
        .put(
          `/reservations/${reservationOne.reservation_id}/tables/${tableOne.table_id}/seat`
        )
        .set("Accept", "application/json")
        .send({ data: { status: "Sat" } });

      expect(firstSeatResponse.body.error).toBeUndefined();
      expect(firstSeatResponse.status).toBe(200);

      const secondSeatResponse = await request(app)
        .put(
          `/reservations/${reservationOne.reservation_id}/tables/${tableTwo.table_id}/seat`
        )
        .set("Accept", "application/json")
        .send({ data: { status: "Sat" } });

      expect(secondSeatResponse.body.error).toContain("sat");
      expect(secondSeatResponse.status).toBe(400);
    });
  });

  describe("PUT /reservations/:reservation_id/tables/:table_id/finish", () => {
    let reservationOne;
    let tableOne;
    const data = {
      first_name: "first",
      last_name: "last",
      mobile_number: "800-555-1212",
      reservation_date: api.today(),
      reservation_time: "17:30",
      people: 2,
    };

    beforeEach(async () => {
      await request(app)
        .post("/reservations/new")
        .set("Accept", "application/json")
        .send({ data });

      reservationOne = await knex("reservations")
        .where("reservation_date", data.reservation_date)
        .orderBy(["reservation_date", "reservation_time"])
        .first();
      tableOne = await knex("tables").orderBy("table_name").first();
    });

    test("returns 200 and changes reservation status to 'Finished'", async () => {
      expect(tableOne).not.toBeUndefined();
      expect(reservationOne).not.toBeUndefined();

      const seatResponse = await request(app)
        .put(
          `/reservations/${reservationOne.reservation_id}/tables/${tableOne.table_id}/seat`
        )
        .set("Accept", "application/json")
        .send({ data: { status: "Sat" } });

      expect(seatResponse.body.error).toBeUndefined();
      expect(seatResponse.status).toBe(200);

      const finishResponse = await request(app)
        .put(
          `/reservations/${reservationOne.reservation_id}/tables/${tableOne.table_id}/finish`
        )
        .set("Accept", "application/json")
        .send({ data: { status: "Finished" } });

      expect(finishResponse.body.error).toBeUndefined();
      expect(finishResponse.status).toBe(200);

      const reservationResponse = await request(app)
        .get(`/reservations/${reservationOne.reservation_id}`)
        .set("Accept", "application/json");

      expect(reservationResponse.body.error).toBeUndefined();
      expect(reservationResponse.body.data).toHaveProperty(
        "status",
        "Finished"
      );
      expect(reservationResponse.status).toBe(200);
    });
  });

  describe("GET /reservations/date=XXXX-XX-XX", () => {
    let reservationOne;
    const data = {
      first_name: "first",
      last_name: "last",
      mobile_number: "800-555-1212",
      reservation_date: api.today(),
      reservation_time: "17:30",
      people: 2,
    };

    beforeEach(async () => {
      await request(app)
        .post("/reservations/new")
        .set("Accept", "application/json")
        .send({ data });

      reservationOne = await knex("reservations")
        .where("reservation_date", data.reservation_date)
        .orderBy(["reservation_date", "reservation_time"])
        .first();
      tableOne = await knex("tables").orderBy("table_name").first();
    });

    test("does not include 'Finished' reservations", async () => {
      expect(tableOne).not.toBeUndefined();
      expect(reservationOne).not.toBeUndefined();

      const seatResponse = await request(app)
        .put(
          `/reservations/${reservationOne.reservation_id}/tables/${tableOne.table_id}/seat`
        )
        .set("Accept", "application/json")
        .send({ data: { status: "Sat" } });

      expect(seatResponse.body.error).toBeUndefined();
      expect(seatResponse.status).toBe(200);

      const finishResponse = await request(app)
        .put(
          `/reservations/${reservationOne.reservation_id}/tables/${tableOne.table_id}/finish`
        )
        .set("Accept", "application/json")
        .send({ data: { status: "Finished" } });

      expect(finishResponse.body.error).toBeUndefined();
      expect(finishResponse.status).toBe(200);

      const reservationsResponse = await request(app)
        .get(
          `/reservations?date=${api.formatDate(
            reservationOne.reservation_date
          )}`
        )
        .set("Accept", "application/json");

      expect(reservationsResponse.body.error).toBeUndefined();

      const finishedReservations = reservationsResponse.body.data.filter(
        (reservation) => reservation.status === "Finished"
      );

      expect(finishedReservations).toHaveLength(0);
    });
  });
});
