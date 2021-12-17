import { Pool } from 'pg';
import config  from "config";

const pool = new Pool({
    user: config.get("user"),
    password: config.get("password"),
    host: config.get("host"),
    port: config.get("port"),
    database: config.get("database"),
});

export default pool;