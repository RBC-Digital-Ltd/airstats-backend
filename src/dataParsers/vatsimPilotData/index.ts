import "dotenv/config"; // eslint-disable-line
import { Connection } from "rabbitmq-client";
import { pool, query } from "../../db/client";
import { IVatsimPilot } from "../../dataFetchers/getVatsimData/types";

const rabbit = new Connection(
  `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@localhost`
);
rabbit.on("error", (err) => {
  console.log("RabbitMQ connection error", err);
});
rabbit.on("connection", () => {
  console.log("Connection successfully (re)established");
});

const sub = rabbit.createConsumer(
  {
    queue: "vatsim-pilot-individual-data",
    queueOptions: { durable: true },
    qos: { prefetchCount: 1 },
  },
  async (msg) => {
    const data: IVatsimPilot = msg.body;

    const {
      callsign,
      cid,
      flight_plan: flightPlan,
      latitude,
      longitude,
      altitude,
      groundspeed,
      transponder,
      heading,
      qnh_i_hg: qnhIHg,
      qnh_mb: qnhMb,
      last_updated: lastUpdated,
    } = data;
    let { departure, arrival } = flightPlan || {};
    departure ||= "";
    arrival ||= "";

    // GET FLIGHT BY CID
    const { rows } = await query(
      `SELECT * FROM Flight WHERE cid = $1 AND is_active = true`,
      [cid]
    );

    let id = rows[0]?.id;

    // IF NO FLIGHT -> ADD NEW FLIGHT
    if (rows.length === 0) {
      const result = await query(
        `INSERT INTO Flight (callsign, cid, departure, arrival, is_active) VALUES ($1, $2, $3, $4, true) RETURNING id`,
        [callsign, cid, departure, arrival]
      );

      id = result.rows[0].id;
    }
    // IF CALLSIGN, DEP OR ARR CHANGED -> MARK OLD FLIGHT AS INACTIVE AND ADD NEW FLIGHT
    else if (
      rows[0].departure !== departure ||
      rows[0].arrival !== arrival ||
      rows[0].callsign !== callsign
    ) {
      await query(`UPDATE Flight SET is_active = false WHERE id = $1`, [
        rows[0].id,
      ]);

      const result = await query(
        `INSERT INTO Flight (callsign, cid, departure, arrival, is_active) VALUES ($1, $2, $3, $4, true) RETURNING id`,
        [callsign, cid, departure, arrival]
      );

      id = result.rows[0].id;
    }
    // IF CALLSIGN, DEP AND ARR DIDN'T CHANGE -> RESET INACTIVE COUNT
    else if (rows[0].inactive_count > 0) {
      await query(`UPDATE Flight SET inactive_count = 0 WHERE id = $1`, [
        rows[0].id,
      ]);
    }

    // ADD NEW FLIGHT DATA
    await query(
      `INSERT INTO flightdata
      (
        flight_id,
        latitude,
        longitude,
        altitude,
        groundspeed,
        transponder,
        heading,
        qnh_i_hg,
        qnh_mb,
        timestamp
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        id,
        latitude,
        longitude,
        altitude,
        groundspeed,
        transponder,
        heading,
        qnhIHg,
        qnhMb,
        lastUpdated,
      ]
    );
  }
);

sub.on("error", (err) => {
  // Maybe the consumer was cancelled, or the connection was reset before a
  // message could be acknowledged.
  console.log("consumer error (user-events)", err);
});

// await pub.send("vatsim-data", data);

// await pub.close();
// await rabbit.close();

// Clean up when you receive a shutdown signal
async function onShutdown() {
  await pool.end();
  // Stop consuming. Wait for any pending message handlers to settle.
  await sub.close();
  await rabbit.close();
}
process.on("SIGINT", onShutdown);
process.on("SIGTERM", onShutdown);
