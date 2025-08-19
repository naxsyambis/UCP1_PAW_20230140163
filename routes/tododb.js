const express = require('express');
const router = express.Router();
const db = require('../database/db'); // Mengimpor koneksi database

// Endpoint untuk mendapatkan semua tugas
router.get('/', (req, res) => {
    db.query('SELECT * FROM buku', (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.json(results);
    });
});

// Endpoint untuk mendapatkan tugas berdasarkan ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM buku WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.length === 0) return res.status(404).send('Buku tidak ditemukan');
        res.json(results[0]);
    });
});

// Endpoint untuk menambahkan tugas baru
router.post('/', (req, res) => {
    const { judul } = req.body;
    if (!judul || judul.trim() === '') {
        return res.status(400).send('Buku tidak boleh kosong');
    }

    db.query('INSERT INTO buku (judul) VALUES (?)', [judul.trim()], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        const newTodo = { id: results.insertId, judul: judul.trim(), completed: false };
        res.status(201).json(newTodo);
    });
});

// Endpoint untuk memperbarui tugas
router.put('/:id', (req, res) => {
    const { judul, author, tahunterbit } = req.body;

    db.query('UPDATE buku SET judul = ?, author = ? tahunterbit = ?  WHERE id = ?', [judul, author, tahunterbit, req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Buku tidak ditemukan');
        res.json({ id: req.params.id, task, completed });
    });
});

// Endpoint untuk menghapus tugas
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM buku WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Buku tidak ditemukan');
        res.status(204).send();
    });
});

module.exports = router;

