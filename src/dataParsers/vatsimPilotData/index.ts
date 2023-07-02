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
    let {
      departure,
      arrival,
      aircraft,
      aircraft_short: aircraftShort,
      aircraft_faa: aircraftFaa,
      alternate,
      remarks,
      route,
      flight_rules: flightRules,
      altitude: flightPlanAltitude,
      revision_id: revisionId,
      assigned_transponder: assignedTransponder,
    } = flightPlan || {};
    departure ||= "";
    arrival ||= "";
    aircraft ||= "";
    aircraftShort ||= "";
    aircraftFaa ||= "";
    alternate ||= "";
    remarks ||= "";
    route ||= "";
    flightRules ||= "";
    flightPlanAltitude ||= "";
    revisionId ||= 0;
    assignedTransponder ||= "";

    // GET FLIGHT BY CID
    const { rows } = await query(
      `SELECT * FROM Flight WHERE cid = $1 AND is_active = true`,
      [cid]
    );

    let id = rows[0]?.id;

    // IF NO FLIGHT -> ADD NEW FLIGHT
    if (rows.length === 0) {
      const result = await query(
        `INSERT INTO Flight (callsign, cid, departure, arrival, is_active, aircraft, aircraft_short, aircraft_faa, alternate, remarks, route, flight_rules, flight_plan_altitude, revision_id, assigned_transponder) VALUES ($1, $2, $3, $4, true, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING id`,
        [
          callsign,
          cid,
          departure,
          arrival,
          aircraft,
          aircraftShort,
          aircraftFaa,
          alternate,
          remarks,
          route,
          flightRules,
          flightPlanAltitude,
          revisionId,
          assignedTransponder,
        ]
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
        `INSERT INTO Flight (callsign, cid, departure, arrival, is_active, aircraft, aircraft_short, aircraft_faa, alternate, remarks, route, flight_rules, flight_plan_altitude, revision_id, assigned_transponder) VALUES ($1, $2, $3, $4, true, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING id`,
        [
          callsign,
          cid,
          departure,
          arrival,
          aircraft,
          aircraftShort,
          aircraftFaa,
          alternate,
          remarks,
          route,
          flightRules,
          flightPlanAltitude,
          revisionId,
          assignedTransponder,
        ]
      );

      id = result.rows[0].id;
    }
    // IF CALLSIGN, DEP AND ARR DIDN'T CHANGE -> RESET INACTIVE COUNT
    else if (rows[0].inactive_count > 0) {
      await query(`UPDATE Flight SET inactive_count = 0 WHERE id = $1`, [
        rows[0].id,
      ]);
    }

    if (
      rows.length > 0 &&
      (rows[0].aircraft !== aircraft ||
        rows[0].aircraft_short !== aircraftShort ||
        rows[0].aircraft_faa !== aircraftFaa ||
        rows[0].route !== route ||
        rows[0].flight_rules !== flightRules ||
        rows[0].flight_plan_altitude !== flightPlanAltitude ||
        rows[0].revision_id !== revisionId ||
        rows[0].assigned_transponder !== assignedTransponder)
    ) {
      await query(
        `UPDATE Flight SET aircraft = $1, aircraft_short = $2, aircraft_faa = $3, route = $4, flight_rules = $5, flight_plan_altitude = $6, revision_id = $7, assigned_transponder = $8 WHERE id = $9`,
        [
          aircraft,
          aircraftShort,
          aircraftFaa,
          route,
          flightRules,
          flightPlanAltitude,
          revisionId,
          assignedTransponder,
          rows[0].id,
        ]
      );
    }

    try {
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
    } catch (error) {
      console.log("error", error);
    }
    // ADD NEW FLIGHT DATA
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
