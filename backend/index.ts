import express from "express";
import * as sqlite from "sqlite";
import type { Database } from "sqlite";
import sqlite3 from "sqlite3";
import cors from "cors";

export let database: Database;

const app = express();

database = await sqlite.open({
  driver: sqlite3.Database,
  filename: "lab3.sqlite",
});

await database.run("PRAGMA foreign_keys = ON");

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

/*cors alternativ
//måste placeras ovanför alla app.get,put,delete anroper (den ska köras först)
app.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
*/
app.use(express.json());

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  created_at: number;
}

interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  due_date: number;
  category_id: number;
  user_id: number;
  created_at: number;
}

interface Category {
  id: number;
  title: string;
  user_id: number;
  created_at: number;
}

await database.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

await database.run(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    user_id INTEGER ,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

await database.run(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT,
    status TEXT,
    due_date DATETIME,
    category_id INTEGER,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

//Home
app.get("/", (request, response) => {
  response.send({ msg: "Priorio" });
});

//Sign in
app.post("/login", async (request, response) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return response.status(400).json({
      message: "Email and password are required.",
    });
  }

  const user = await database.get(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
  );

  if (user) {
    response.status(200).json({
      message: "Signed in successfully.",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } else {
    response.status(401).json({
      message: "Invalid email or password.",
    });
  }
});

// Register
app.post("/register", async (request, response) => {
  const { username, email, password } = request.body;

  if (!username || !email || !password) {
    return response.status(400).json({
      message: "Username, email and password are required.",
    });
  }

  const existingUser = await database.get(
    "SELECT * FROM users WHERE username = ? OR email = ?",
    [username, email],
  );

  if (existingUser) {
    return response.status(409).json({
      message: "Username or email is already in use.",
    });
  }

  await database.run(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, password],
  );

  return response.status(201).json({
    message: "Account created successfully.",
  });
});

//Today
app.get("/today", async (request, response) => {
  const tasks: Task[] = await database.all(
    `
  SELECT * FROM tasks WHERE DATE(due_date) = DATE('now', 'localtime')`,
  );
  response.send(tasks);
});

//Add new task
app.post("/today", cors(corsOptions), async (request, response) => {
  const { title, description, priority, status, due_date, category_id } =
    request.body;

  await database.run(
    `
    INSERT INTO tasks ( title, description, priority, status, due_date, category_id, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [title, description, priority, status, due_date, category_id],
  );

  return response.status(201).send();
});

//Edit task
app.put("/today/:id", cors(corsOptions), async (request, response) => {
  const { id } = request.params;
  const { title, description, priority, status, due_date, category_id } =
    request.body;

  await database.run(
    `
    UPDATE tasks
    SET title = ?,
        description = ?,
        priority = ?,
        status = ?,
        due_date = ?,
        category_id = ?
    WHERE id = ? 
    `,
    [title, description, priority, status, due_date, category_id, id],
  );

  return response.status(200).send();
});

//Delete task
app.delete("/today/:id", cors(corsOptions), async (request, response) => {
  const { id } = request.params;

  await database.run(
    `
    DELETE FROM tasks
    WHERE id = ? 
    `,
    [id],
  );

  response.status(200).json({
    message: "Task deleted successfully.",
  });
});

//All tasks
app.get("/tasks", async (request, response) => {
  const tasks: Task[] = await database.all(
    "SELECT * FROM tasks ORDER BY due_date",
  );
  response.send(tasks);
});

//Search filter
app.get("/search", cors(corsOptions), async (request, response) => {
  const { title } = request.query;

  let tasks;

  if (title) {
    tasks = await database.all(
      `
      SELECT * FROM tasks
      WHERE title LIKE ?
      ORDER BY due_date
      `,
      [`%${title}%`],
    );
  } else {
    tasks = await database.all(
      `
      SELECT * FROM tasks
      ORDER BY due_date
      `,
    );
  }

  response.json(tasks);
});

// Priority filter
app.get("/tasks/priority", async (request, response) => {
  const { priority } = request.query;

  const tasks = await database.all(
    `
    SELECT * FROM tasks
    WHERE priority = ?
    ORDER BY due_date
    `,
    [priority],
  );

  response.send(tasks);
});

// Category filter
app.get("/tasks/category", async (request, response) => {
  const { category_id } = request.query;

  const tasks = await database.all(
    `
    SELECT * FROM tasks
    WHERE category_id = ?
    ORDER BY due_date
    `,
    [category_id],
  );

  response.send(tasks);
});
//Add new task
app.post("/tasks", cors(corsOptions), async (request, response) => {
  const { title, description, priority, status, due_date, category_id } =
    request.body;

  await database.run(
    `
    INSERT INTO tasks ( title, description, priority, status, due_date, category_id, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [title, description, priority, status, due_date, category_id],
  );

  return response.status(201).send();
});

//Edit task
app.put("/tasks/:id", cors(corsOptions), async (request, response) => {
  const { id } = request.params;
  const { title, description, priority, status, due_date, category_id } =
    request.body;

  await database.run(
    `
    UPDATE tasks
    SET title = ?,
        description = ?,
        priority = ?,
        status = ?,
        due_date = ?,
        category_id = ?
    WHERE id = ? 
    `,
    [title, description, priority, status, due_date, category_id, id],
  );

  return response.status(200).send();
});

//Delete task
app.delete("/tasks/:id", cors(corsOptions), async (request, response) => {
  const { id } = request.params;

  await database.run(
    `
    DELETE FROM tasks
    WHERE id = ? 
    `,
    [id],
  );

  response.status(200).json({
    message: "Task deleted successfully.",
  });
});

//Category
app.get("/categories", cors(corsOptions), async (request, response) => {
  const categories: Category[] = await database.all("SELECT * FROM categories");
  response.send(categories);
});

//Add category
app.post("/categories", cors(corsOptions), async (request, response) => {
  const { title } = request.body;

  await database.run(
    `
    INSERT INTO categories (title)
    VALUES (?)
    `,
    [title],
  );

  response.status(201).send();
});

//Setting
app.get("/setting", async (request, response) => {
  const users: User[] = await database.all("SELECT * FROM users");
  response.send(users);
});

app.listen(3000, () => {
  console.log("Webbtjänsten kan nu ta emot anrop.");
});

// $ winpty /c/sqlite/sqlite3.exe
// TypeScript-kod kan konverteras till JavaScript-kod via $ npx tsc
