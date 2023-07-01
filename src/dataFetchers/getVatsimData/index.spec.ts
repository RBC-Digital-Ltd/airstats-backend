import nock from "nock";
import { handler } from "./index";

describe("getVatsimData", () => {
  it("should call vatsim to get the data", async () => {
    const nockMock = nock("https://data.vatsim.net")
      .get("/v3/vatsim-data.json")
      .reply(200, {})
      .persist();
    await handler();
    expect(nockMock.isDone()).toBeTrue();
  });
});
