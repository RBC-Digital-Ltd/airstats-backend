import { Pool } from "pg";

const pool = new Pool();

export const query = async (text: string, params: any) => {
  const result = await pool.query(text, params);

  return result;
};
