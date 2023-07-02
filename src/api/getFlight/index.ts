import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { query } from "../../db/client";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const dbQuery = await query(
    `select f.*, json_agg(fd.* order by fd."timestamp" asc) as fd
  from flight f
  join flightdata fd on fd.flight_id = f.id
  where f.id = $1
  group by f.id`,
    [event.pathParameters?.id]
  );

  return {
    statusCode: 200,
    body: JSON.stringify(dbQuery.rows[0]),
  };
};
