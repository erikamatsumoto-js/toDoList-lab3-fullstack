import * as sqlite from "sqlite";
import type { Database } from "sqlite";
import sqlite3 from "sqlite3";

export let database: Database;

database = await sqlite.open({
  driver: sqlite3.Database,
  filename: "test.sqlite",
});

await database.run("PRAGMA foreign_keys = ON");
