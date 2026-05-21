import express from "express";

const app = express();

app.get("/", (_request, response) => {
  response.send("Hello World!");
});

app.listen(3000, () => {
  console.log("Webbtjänsten kan nu ta emot anrop.");
});

// $ winpty /c/sqlite/sqlite3.exe
