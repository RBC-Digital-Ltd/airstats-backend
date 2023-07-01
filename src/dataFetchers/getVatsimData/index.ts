import { Connection } from "rabbitmq-client";
import { getData } from "./getData.js";

const main = async () => {
  const { pilots } = await getData();

  const rabbit = new Connection("amqp://guest:guest@localhost");
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

  await Promise.all(
    pilots.map(async (pilot) => {
      await pub.send({ routingKey: "vatsim-pilot-data", durable: true }, pilot);
    })
  );

  await pub.close();
  await rabbit.close();
};

main();
