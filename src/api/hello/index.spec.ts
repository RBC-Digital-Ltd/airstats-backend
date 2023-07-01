// import type { APIGatewayProxyResult } from "aws-lambda";
import type { APIGatewayProxyResult } from "aws-lambda";
import { handler } from ".";

// Test Hello

describe("Hello", () => {
  it("should return a message", async () => {
    const response: APIGatewayProxyResult = await handler();
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({ message: "Hello World!" });
  });
});
