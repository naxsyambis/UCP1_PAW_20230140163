require("dotenv").config();
const express = require("express");
const app = express();
const db =require("./database/db");

//const port = 3010; ini emang catatan
const todoRoutes = require("./routes/tododb.js");
const { perpus } = require("./routes/todo.js");
const port = process.env.PORT;

const expressLayouts = require("express-ejs-layouts");
app.use(expressLayouts);

app.use(express.json());
app.set("view engine", "ejs");
app.use("/perpus", todoRoutes);

app.get("/", (req, res) => { //sampai sini
  res.render("index", {
    layout: "layouts/main-layout",
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", {
    layout: "layouts/main-layout",
  });
});

//endpoint untuk mendapatkan data todos
app.get("/todos-data", (req, res) => {
  res.json(perpus); //mengembalikan data todos dalam format json
});

app.get("/todos-list", (req, res) => {
  res.render("todos-page", { todos: todos, layout: "layouts/main-layout" });
});

app.post("/todos-list/add", (req, res) => {
  const { task } = req.body;
  if (!task || task.trim() === "") {
    return res.status(400).send("Task tidak boleh kosong");
  }

  const newTodo = {
    id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
    task: task.trim(),
  };
  todos.push(newTodo);

  res.redirect("/todos-list");
});

app.put("/todos-list/edit/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { judul } = req.body;
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).send("Tugas tidak ditemukan");
  }
  if (!judul || judul.trim() === "") {
    return res.status(400).send("Task tidak boleh kosong");
  }

  todo.judul = judul.trim();
  res.redirect("/todos-list");
});

app.delete("/todos-list/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = perpus.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).send("Tugas tidak ditemukan");
  }

  todos.splice(index, 1);
  res.redirect("/todos-list");
});


app.get("/todo-view", (req,res) => {
  db.query("SELECT * FROM perpus", (err, todos) => {
    if (err) return res.status(500).send("internal server error")
    res.render("todo", {
      todos: todos, layout: "layouts/main-layout"
    });
  });
});



//middleware
app.use((req, res) => {
  res.status(404).send("404 - Page Not Found");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});