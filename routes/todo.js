
// todo.js
const express = require("express");
const router = express.Router();

// Data dummy
let perpus = [
  { id: 1, judul: "Ombak", },
  { id: 2, judul: "Laut", },
];

// Endpoint untuk mendapatkan semua tugas
router.get("/", (req, res) => {
  res.json(perpus);
});

// Endpoint untuk mendapatkan tugas berdasarkan ID
router.get("/:id", (req, res) => {
  const todo = perpus.find((t) => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).send("Buku tidak ditemukan");
  res.json(todo);
});

// Endpoint untuk menambahkan tugas baru
router.post("/", (req, res) => {
  const newTodo = {
    id: perpus.length + 1,
    task: req.body.task,
  };
  perpus.push(newTodo);
  res.status(201).json(newTodo);
});

// Endpoint untuk memperbarui tugas
router.put("/:id", (req, res) => {
  const perpus = perpus.find((t) => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).send("Buku tidak ditemukan");

  todo.task = req.body.task;
  res.json(todo);
});

// Endpoint untuk menghapus tugas
router.delete("/:id", (req, res) => {
  const todoIndex = perpus.findIndex((t) => t.id === parseInt(req.params.id));
  if (todoIndex === -1) return res.status(404).send("Buku tidak ditemukan");

  perpus.splice(todoIndex, 1);
  res.status(204).send();
});

module.exports = router;
// Tambahkan ini untuk mengekspor data todos juga
module.exports.perpus = perpus;