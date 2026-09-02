# Analisis PRD & Rencana Implementasi
## Aplikasi Absensi Siswa

Dokumen ini berisi hasil analisis PRD dan project plan untuk membangun aplikasi absensi siswa dengan backend MySQL.

---

## 1. Analisis PRD

### 1.1 Ringkasan Produk
- **Produk**: Aplikasi web absensi siswa.
- **Stack**: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + MySQL.
- **Pengguna**: Guru / wali kelas.
- **Data**: MySQL database via `mysql2` driver.
- **Gaya UI**: Liquid Glass (glassmorphism) — bersih, modern, banyak whitespace.

### 1.2 Pemetaan Fitur

| # | Fitur | Endpoint |
|---|-------|----------|
| 1 | Daftar nama siswa | GET /api/students |
| 2 | Tombol Hadir / Tidak Hadir per siswa | Client-side |
| 3 | Tombol Simpan Absensi + konfirmasi | POST /api/attendance |
| 4 | Ringkasan real-time | Client-side (derivasi state) |

---

## 2. Keputusan Teknis

| Aspek | Keputusan | Alasan |
|-------|-----------|--------|
| Framework | Next.js 16 (App Router) + TypeScript | Sesuai PRD |
| Styling | Tailwind CSS v4 | Sesuai PRD |
| State management | `useState` + custom hook `useAttendance` | Skala kecil |
| Backend API | Next.js Route Handlers | Built-in, tanpa server terpisah |
| Database | MySQL via `mysql2` | Relational, cocok untuk data absensi |
| Persistensi | MySQL (table `attendance`) | Data tetap tersimpan setelah refresh |
| Ikon | `lucide-react` | Ikon outline simpel |

---

## 3. Database Schema

```sql
CREATE TABLE students (
  id VARCHAR(10) PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(10) NOT NULL,
  status ENUM('hadir', 'tidak_hadir') NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_attendance (student_id, date),
  FOREIGN KEY (student_id) REFERENCES students(id)
);
```

---

## 4. API Endpoints

### GET /api/students
- Mengembalikan daftar semua siswa dari database.
- Response: `[{ id: string, name: string }]`

### POST /api/attendance
- Menyimpan data absensi untuk tanggal tertentu.
- Request body: `{ date: string, records: [{ studentId, status }] }`
- Menggunakan `INSERT ... ON DUPLICATE KEY UPDATE` untuk upsert.

---

## 5. Environment Variable

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=absensi
```
