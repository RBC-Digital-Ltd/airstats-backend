import got from "got";

export const handler = async (): Promise<void> => {
  const data = await got
    .get("https://data.vatsim.net/v3/vatsim-data.json")
    .json();

  console.log(data);
};

handler();
