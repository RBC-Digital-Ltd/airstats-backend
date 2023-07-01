import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export const query = async (text: string, params: any) => {
  const result = await pool.query(text, params);

  return result;
};
