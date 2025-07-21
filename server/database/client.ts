// Get variables from .env file for database connection
const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

// Create a connection pool to the PostgreSQL database
import { Pool } from "pg";

const client = new Pool({
  host: DB_HOST,
  port: Number.parseInt(DB_PORT as string),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

// Ready to export
export default client;

// Types export
import type { PoolClient, QueryResult } from "pg";

type DatabaseClient = Pool;
type Result = QueryResult;
type Rows = QueryResult["rows"];

export type { DatabaseClient, Result, Rows };
