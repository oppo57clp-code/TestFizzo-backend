const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Mengaktifkan pembacaan JSON pada body request
app.use(express.json());

// Menghubungkan ke PostgreSQL (Supabase) menggunakan DATABASE_URL dari Railway
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// 1. Endpoint Utama (Cek Server)
app.get('/', (req, res) => {
  res.json({ message: 'Server Aplikasi Novel Fizo Berjalan dengan Baik!' });
});

// 2. Endpoint untuk Mengambil Semua Daftar Novel
app.get('/api/Novels', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Novels" ORDER BY id ASC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Gagal mengambil data novel' });
  }
});

// 3. Endpoint untuk Mengambil Daftar Bab Berdasarkan ID Novel
app.get('/api/novels/:novelId/chapters', async (req, res) => {
  try {
    const { novelId } = req.params;
    const result = await pool.query(
      'SELECT id, novel_id, chapter_number, title FROM chapters WHERE novel_id = $1 ORDER BY chapter_number ASC',
      [novelId]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Gagal mengambil daftar bab' });
  }
});

// 4. Endpoint untuk Mengambil Isi Teks Bab Berdasarkan ID Bab
app.get('/api/chapters/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM chapters WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Bab tidak ditemukan' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Gagal mengambil isi bab' });
  }
});

// Menyalakan server
app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
