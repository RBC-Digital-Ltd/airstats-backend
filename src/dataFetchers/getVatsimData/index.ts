import { getData } from "./getData.js";

const main = async () => {
  const data = await getData();
  console.log(data);
};

main();
