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

const pub = rabbit.createPublisher({
  confirm: true,
  maxAttempts: 2,
  queues: [
    {
      queue: "vatsim-pilot-individual-data",
      durable: true,
    },
  ],
});

const sub = rabbit.createConsumer(
  {
    queue: "vatsim-pilot-data",
    queueOptions: { durable: true },
    qos: { prefetchCount: 1 },
  },
  async (msg) => {
    const data: IVatsimPilot[] = msg.body;

    const cids = data.map((pilot) => pilot.cid);

    await query(
      `UPDATE Flight SET inactive_count = inactive_count + 1 WHERE cid <> ALL ($1) AND is_active = true`,
      [cids]
    );

    await query(
      `UPDATE Flight SET is_active = false WHERE inactive_count >= 10 AND is_active = true`,
      null
    );

    await Promise.all(
      data.map(async (pilot) => {
        await pub.send(
          { routingKey: "vatsim-pilot-individual-data", durable: true },
          pilot
        );
      })
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
