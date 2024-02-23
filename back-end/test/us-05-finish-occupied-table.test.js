const request = require("supertest");

const app = require("../src/app");
const knex = require("../src/db/connection");

const api = require("../src/api");

describe("US-05 - Finish an occupied table", () => {
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

  describe("PUT /reservations/:reservation_id/tables/:table_id/finish", () => {
    let barTableOne;
    let tableOne;
    let reservation;
    const today = api.today();

    const data = {
      first_name: "first",
      last_name: "last",
      mobile_number: "800-555-1212",
      reservation_date: today,
      reservation_time: "21:30",
      people: 1,
    };

    beforeEach(async () => {
      barTableOne = await knex("tables").where("table_name", "Bar #1").first();
      tableOne = await knex("tables").where("table_name", "#1").first();
      const response = await request(app)
        .post("/reservations/new")
        .set("Accept", "application/json")
        .send({ data });
      reservation = await knex("reservations")
        .where("reservation_id", response.body.data.reservation_id)
        .first();
    });

    test("returns 404 for non-existent table_id", async () => {
      expect(reservation).not.toBeUndefined();

      const response = await request(app)
        .put(`/reservations/${reservation.reservation_id}/tables/99/seat`)
        .set("Accept", "application/json")
        .send({ data: { status: "Finished" } });

      expect(response.body.error).toContain("99");
      expect(response.status).toBe(404);
    });

    test("returns 400 if table_id is not occupied.", async () => {
      expect(tableOne).not.toBeUndefined();
      expect(reservation).not.toBeUndefined();

      const response = await request(app)
        .put(
          `/reservations/${reservation.reservation_id}/tables/${tableOne.table_id}/finish`
        )
        .set("Accept", "application/json")
        .send({ data: { status: "Finished" } });

      expect(response.body.error).toContain("unoccupied");
      expect(response.status).toBe(400);
    });

    test("returns 400 if reservation is finished for a future date.", async () => {
      const satReservation = await knex("reservations")
        .where("status", "Sat")
        .first();
      expect(tableOne).not.toBeUndefined();
      expect(satReservation).not.toBeUndefined();

      const response = await request(app)
        .put(
          `/reservations/${satReservation.reservation_id}/tables/${tableOne.table_id}/finish`
        )
        .set("Accept", "application/json")
        .send({ data: { status: "Finished" } });

      expect(response.body.error).toContain("earlier");
      expect(response.status).toBe(400);
    });

    test("returns 200 if table_id is occupied ", async () => {
      expect(tableOne).not.toBeUndefined();
      expect(reservation).not.toBeUndefined();

      const seatResponse = await request(app)
        .put(
          `/reservations/${reservation.reservation_id}/tables/${tableOne.table_id}/seat`
        )
        .set("Accept", "application/json")
        .send({ data: { status: "Sat" } });

      expect(seatResponse.body.error).toBeUndefined();
      expect(seatResponse.status).toBe(200);

      const finishResponse = await request(app)
        .put(
          `/reservations/${reservation.reservation_id}/tables/${tableOne.table_id}/finish`
        )
        .set("Accept", "application/json")
        .send({ data: { status: "Finished" } });

      expect(finishResponse.body.error).toBeUndefined();
      expect(finishResponse.body.data.reservation).toHaveProperty(
        "status",
        "Finished"
      );
      expect(finishResponse.body.data.table).toHaveProperty(
        "reservation_id",
        null
      );
      expect(finishResponse.status).toBe(200);
    });
  });
});
