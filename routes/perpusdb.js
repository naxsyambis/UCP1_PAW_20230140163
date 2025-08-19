const express = require('express');
const router = express.Router();
const db = require('../database/db'); 

// Endpoint untuk mendapatkan semua buku
router.get('/', (req, res) => {
    db.query('SELECT * FROM buku', (err, results) => {
        if (err) {
             console.error("Error fetching data:", err); // Tambahkan log ini
             return res.status(500).send('Internal Server Error');
        }
        res.json("perpustakaan", {
            buku: results, layout: "layouts/main-layout"
        });
    });
});

// Endpoint untuk mendapatkan buku berdasarkan ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM buku WHERE id = ?', [req.params.id], (err, results) => {
        if (err) {
            console.error("Error fetching book by ID:", err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length === 0) return res.status(404).send('Buku tidak ditemukan');
        res.json(results[0]);
    });
});

// Endpoint untuk menambahkan buku baru
router.post('/', (req, res) => {
    const { judul } = req.body;
    if (!judul || judul.trim() === '') {
        return res.status(400).send('Judul tidak boleh kosong');
    }

    db.query('INSERT INTO buku (judul) VALUES (?)', [judul.trim()], (err, results) => {
        if (err) {
            console.error("Error adding book:", err);
            return res.status(500).send('Internal Server Error');
        }
        // Perbaiki: 'newBuku' tidak terdefinisi, harusnya 'newTodo' atau buat ulang objeknya
        const newBuku = { id: results.insertId, judul: judul.trim() }; 
        res.status(201).json(newBuku);
    });
});

// Endpoint untuk memperbarui buku
router.put('/:id', (req, res) => {
    const { judul } = req.body;

    db.query('UPDATE buku SET judul = ? WHERE id = ?', [judul, req.params.id], (err, results) => {
        if (err) {
            console.error("Error updating book:", err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.affectedRows === 0) return res.status(404).send('Buku tidak ditemukan');
        res.json({ id: req.params.id, judul });
    });
});

// Endpoint untuk menghapus buku
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM buku WHERE id = ?', [req.params.id], (err, results) => {
        if (err) {
            console.error("Error deleting book:", err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.affectedRows === 0) return res.status(404).send('Buku tidak ditemukan');
        res.status(204).send();
    });
});

module.exports = router;