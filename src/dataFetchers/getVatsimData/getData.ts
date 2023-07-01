import got from "got";
import type { IVatsimData } from "./types";

export const getData = async (): Promise<IVatsimData> => {
  const data = await got
    .get("https://data.vatsim.net/v3/vatsim-data.json")
    .json();

  return data as IVatsimData;
};
