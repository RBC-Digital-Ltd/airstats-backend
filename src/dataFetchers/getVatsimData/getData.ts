import got from "got";

export const getData = async (): Promise<any> => {
  const data = await got
    .get("https://data.vatsim.net/v3/vatsim-data.json")
    .json();

  return data;
};
