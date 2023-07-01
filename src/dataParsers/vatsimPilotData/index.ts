import "dotenv/config"; // eslint-disable-line
import { Connection } from "rabbitmq-client";

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
    queue: "vatsim-pilot-data",
    queueOptions: { durable: true },
    qos: { prefetchCount: 1 },
  },
  async (msg) => {
    console.log("received message (user-events)", msg);
    // // eslint-disable-next-line no-promise-executor-return
    // await new Promise((resolve) => setTimeout(resolve, 100));
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
  // Stop consuming. Wait for any pending message handlers to settle.
  await sub.close();
  await rabbit.close();
}
process.on("SIGINT", onShutdown);
process.on("SIGTERM", onShutdown);
