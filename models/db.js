import pg from "pg";
const { Pool } = pg;

import dotenv from "dotenv";

dotenv.config();


const dbPool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export default dbPool;

dbPool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error connecting to the database", err);
  } else {
    console.log("Database connected successfully", res.rows[0]);
  }
});