import "dotenv/config"; // eslint-disable-line
import { Connection } from "rabbitmq-client";
import { getData } from "./getData.js";

const main = async () => {
  const { pilots } = await getData();

  const rabbit = new Connection(
    `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@localhost`
  );
  const pub = rabbit.createPublisher({
    confirm: true,
    maxAttempts: 2,
    queues: [
      {
        queue: "vatsim-pilot-data",
        durable: true,
      },
    ],
  });

  await pub.send({ routingKey: "vatsim-pilot-data", durable: true }, pilots);

  await pub.close();
  await rabbit.close();
};

main();
