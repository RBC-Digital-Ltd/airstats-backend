import nock from "nock";
import { getData } from "./getData";

describe("getVatsimData", () => {
  it("should call vatsim to get the data", async () => {
    const mock = nock("https://data.vatsim.net")
      .get("/v3/vatsim-data.json")
      .reply(200, {
        test: "test",
      })
      .persist();
    const response = await getData();

    expect(response).toStrictEqual({
      test: "test",
    });
    expect(mock.isDone()).toBeTrue();
    mock.done();
  });
});
