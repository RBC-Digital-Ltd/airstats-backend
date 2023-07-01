import { Connection } from "rabbitmq-client";
import { getData } from "./getData.js";

const main = async () => {
  const data = await getData();
  console.log(data);

  const rabbit = new Connection("amqp://localhost");
  const pub = rabbit.createPublisher({
    confirm: true,
    maxAttempts: 2,
    exchanges: [{ exchange: "my-events", type: "topic" }],
  });

  await pub.send("vatsim-data", data);

  await pub.close();
  await rabbit.close();
};

main();
