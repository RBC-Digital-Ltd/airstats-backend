import type { APIGatewayProxyResult } from "aws-lambda";

export const handler = async (): Promise<APIGatewayProxyResult> => ({
  statusCode: 200,
  body: JSON.stringify({
    message: "Hello World!",
  }),
});
