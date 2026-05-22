import express from "express";
import * as sqlite from "sqlite";
import type { Database } from "sqlite";
import sqlite3 from "sqlite3";

export let database: Database;

const app = express();

database = await sqlite.open({
  driver: sqlite3.Database,
  filename: "lab3.sqlite",
});

await database.run("PRAGMA foreign_keys = ON");

//måste placeras ovanför alla app.get,put,delete anroper (den ska köras först)
app.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/", (_request, response) => {
  response.send({ msg: "Hello World!" });
});

app.listen(3000, () => {
  console.log("Webbtjänsten kan nu ta emot anrop.");
});

// $ winpty /c/sqlite/sqlite3.exe
