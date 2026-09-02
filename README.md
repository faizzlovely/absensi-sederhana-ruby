# Absensi Siswa

Aplikasi web absensi siswa untuk guru / wali kelas — kelas 12 Rekayasa Perangkat Lunak.

## Tech Stack

- **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- **Backend**: Next.js API Routes
- **Database**: MySQL (via `mysql2` driver)
- **Icons**: lucide-react

## Persiapan

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

```bash
mysql -u root -p < scripts/init-db.sql
```

### 3. Konfigurasi Environment Variable

Buat file `.env` di root project:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=absensi
```

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka http://localhost:3000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | Ambil semua siswa dari database |
| POST | `/api/attendance` | Simpan data absensi per tanggal |

### POST /api/attendance

Request body:

```json
{
  "date": "2026-09-02",
  "records": [
    { "studentId": "s1", "status": "hadir" },
    { "studentId": "s2", "status": "tidak_hadir" }
  ]
}
```

## Struktur Project

```
absensi/
├── app/
│   ├── api/
│   │   ├── students/route.ts   → GET /api/students
│   │   └── attendance/route.ts → POST /api/attendance
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── AttendanceSummary.tsx
│   ├── SaveConfirmation.tsx
│   ├── StudentItem.tsx
│   ├── StudentList.tsx
│   └── SubmitButton.tsx
├── data/students.ts              → Fallback data (jika DB belum tersedia)
├── hooks/useAttendance.ts        → State + logic (fetch dari API)
├── lib/db.ts                     → MySQL connection pool
├── scripts/init-db.sql           → Database schema + seed data
├── types/index.ts                → Tipe data
├── .env.example                  → Template environment variable
└── package.json
```
