# 📋 Analisis PRD & Rencana Implementasi
## Aplikasi Absensi Siswa — Frontend (Next.js + Tailwind CSS)

Dokumen ini berisi hasil analisis PRD dan project plan untuk membangun aplikasi absensi siswa versi frontend-only.

---

## 1. Analisis PRD

### 1.1 Ringkasan Produk
- **Produk**: Aplikasi web absensi siswa (frontend-only).
- **Stack**: Next.js (App Router) + TypeScript + Tailwind CSS.
- **Pengguna**: Guru / wali kelas.
- **Data**: Dummy statis di `/data/students.ts` (tanpa backend/database).
- **Gaya UI**: Liquid Glass (glassmorphism) — bersih, modern, banyak whitespace.
- **Di luar scope**: autentikasi, backend/database, riwayat lintas tanggal, export laporan.

### 1.2 Pemetaan Fitur ↔ User Stories

| # | Fitur | User Story | Requirement Detail |
|---|-------|------------|--------------------|
| 1 | Daftar nama siswa | US-1 | §4.1 |
| 2 | Tombol Hadir / Tidak Hadir per siswa | US-2 | §4.2 |
| 3 | Tombol Simpan Absensi + konfirmasi | US-4 | §4.3 |
| 4 | Ringkasan real-time (hadir / tidak hadir / belum) | US-3 | §4.4 |

### 1.3 Poin Penting & Catatan Analisis
1. **State 100% client-side** — semua interaksi harus instan, tanpa fetch/lag.
2. **Status mutable** — siswa boleh diubah hadir ↔ tidak hadir berkali-kali hingga tombol Simpan ditekan.
3. **Validasi (opsional di PRD)** — peringatan jika masih ada siswa belum diabsen saat Simpan ditekan. **Direkomendasikan diimplementasikan** karena ini bagian dari acceptance criteria yang diuji.
4. **Persistensi `localStorage`** — gunakan key ber-tanggal (`absensi-YYYY-MM-DD`) agar nantinya siap dihubungkan ke fitur riwayat (future scope).
5. **Aksesibilitas** — indikator status tidak boleh hanya mengandalkan warna; wajib diberi ikon (✓ / ✗).
6. **Responsive** — mobile 1 kolom full-width, desktop grid 2 kolom.
7. **Struktur folder & tipe data sudah ditentukan PRD** — patuhi agar konsisten dan mudah dipasang ke backend.
8. **Ringkasan harus update real-time tanpa reload** — cukup derivasi murni dari state records.
9. Data dummy ±30 siswa agar sesuai metrik keberhasilan (< 2 menit untuk satu kelas).

---

## 2. Keputusan Teknis

| Aspek | Keputusan | Alasan |
|-------|-----------|--------|
| Framework | Next.js 15 (App Router) + TypeScript | Sesuai PRD |
| Styling | Tailwind CSS | Sesuai PRD |
| State management | `useState` + custom hook `useAttendance` | Skala kecil; mudah di-refactor saat backend hadir |
| Persistensi | `localStorage` dengan key `absensi-YYYY-MM-DD` | Sesuai PRD; siap untuk future riwayat |
| Ikon | `lucide-react` | Ikon outline simpel, cocok gaya minimalis |
| Font | Inter via `next/font/google` | Sans-serif modern, sesuai §8.4 |
| Bahasa UI | Indonesia | Sesuai target pengguna (guru) |

---

## 3. Struktur Proyek (Target)

```
absensi/
├── app/
│   ├── layout.tsx           → Font Inter + metadata
│   ├── page.tsx             → Halaman utama (komposisi komponen + state)
│   └── globals.css          → Base style
├── components/
│   ├── AttendanceSummary.tsx  → Kartu ringkasan (hadir / tidak / belum)
│   ├── StudentList.tsx        → Container daftar siswa (grid)
│   ├── StudentItem.tsx        → Baris siswa + tombol hadir/tidak hadir
│   ├── SubmitButton.tsx       → Tombol "Simpan Absensi"
│   └── SaveConfirmation.tsx   → Notifikasi/konfirmasi sukses (toast/banner)
├── data/
│   └── students.ts           → Data dummy ±30 siswa
├── hooks/
│   └── useAttendance.ts      → State records + logic (set status, summary, save)
├── types/
│   └── index.ts              → Student, AttendanceStatus, AttendanceRecord
└── PLANNING.md               → Dokumen ini
```

*(Tambah folder `hooks/` di luar struktur PRD — bersifat penambahan, tidak bertentangan, dan membuat logic terpisah dari komponen agar mudah diuji.)*

---

## 4. Rencana Implementasi (Phases)

### Phase 0 — Inisialisasi Proyek
**Tugas:**
1. Cek environment: `node --version`, `npm --version`.
2. `npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm`
3. Install ikon: `npm install lucide-react`.
4. Bersihkan boilerplate default (hapus konten `page.tsx`, asset SVG default, style Tailwind bawaan yang tidak dipakai).
5. Set font Inter di `layout.tsx` via `next/font/google`.

**Verifikasi:** `npm run dev` → halaman kosong render tanpa error.

### Phase 1 — Fondasi: Tipe & Data Dummy
**Tugas:**
1. `types/index.ts`:
   - `type Student = { id: string; name: string }`
   - `type AttendanceStatus = "hadir" | "tidak_hadir" | null`
   - `type AttendanceRecord = { studentId: string; status: AttendanceStatus }`
2. `data/students.ts`: ±30 nama siswa Indonesia, urut alfabetis, id unik (`"s1"`…`"s30"`).

**Verifikasi:** `tsc --noEmit` lolos.

### Phase 2 — Hook State `useAttendance`
**Tugas:** `hooks/useAttendance.ts`
- `records: AttendanceRecord[]` — inisialisasi dari `students` (semua `null`).
- `setStatus(studentId, status)` → mengubah status; bisa dipanggil berulang (mutable sampai save).
- `summary` (derivasi): `hadir`, `tidakHadir`, `belumDiabsen`.
- `save()`:
  - Validasi: jika masih ada `belumDiabsen` → kembalikan info untuk ditampilkan sebagai peringatan.
  - Simpan ke `localStorage` key `absensi-YYYY-MM-DD` (nilai: records + timestamp).
  - Kembalikan status sukses untuk trigger konfirmasi UI.

**Verifikasi:** logika diuji manual via UI pada Phase 4; tidak ada `any`, semua tipe eksplisit.

### Phase 3 — Komponen UI
**Tugas:**
1. `StudentItem.tsx` — nama siswa + ikon status + 2 tombol **Hadir** / **Tidak Hadir**.
   - State aktif: hijau (hadir) / merah (tidak hadir); default: kaca netral.
   - Ikon ✓ / ✗ sebagai indikator non-warna (aksesibilitas).
2. `StudentList.tsx` — wrapper grid responsif (`grid-cols-1 md:grid-cols-2`).
3. `AttendanceSummary.tsx` — 3 kartu kaca: Hadir, Tidak Hadir, Belum Diabsen (angka real-time).
4. `SubmitButton.tsx` — tombol utama "Simpan Absensi" + state disable saat diproses.
5. `SaveConfirmation.tsx` — banner/toast sukses & peringatan validasi.

**Verifikasi:** render di browser, interseksi props sesuai API hook.

### Phase 4 — Halaman Utama & Integrasi
**Tugas:**
1. `app/page.tsx` — komposisi: `AttendanceSummary` (atas) → `StudentList` → `SubmitButton`.
2. Wire seluruh komponen ke `useAttendance`:
   - `setStatus` dari `StudentItem`.
   - `summary` ke `AttendanceSummary`.
   - `save` + validasi + konfirmasi ke `SubmitButton`/`SaveConfirmation`.
3. Alur sesuai §7 PRD: buka → daftar (belum diabsen) → klik status → ringkasan update → simpan → konfirmasi.

**Verifikasi:** jalankan seluruh user flow di browser; uji ubah status berkali-kali cepat.

### Phase 5 — Polish Desain "Liquid Glass"
**Tugas:**
1. Background: `min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100` + blob blur dekoratif (`blur-3xl`, opacity rendah).
2. Glass card: `bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl shadow-lg shadow-black/5`.
3. Tombol:
   - Hadir aktif: `bg-green-400/30 border-green-300/50 text-green-700`
   - Tidak hadir aktif: `bg-red-400/30 border-red-300/50 text-red-700`
   - Default: `bg-white/20 border-white/40 text-gray-600`
   - Simpan: `bg-blue-500/70 text-white border-blue-300/50 shadow-md`
4. Transisi `transition-all duration-300`, hover `scale-[1.02]`, active `scale-95`.
5. Tipografi: judul `text-2xl font-semibold text-gray-800`, body `text-sm text-gray-600`.
6. Responsive: `p-4` di mobile, `p-6` di desktop; semua elemen `w-full`.

**Verifikasi:** cek visual di viewport desktop & mobile (tidak ada teks terpotong/overflow).

### Phase 6 — QA & Build
**Tugas:**
1. `tsc --noEmit` → 0 error.
2. `npm run build` → sukses.
3. Uji manual seluruh Acceptance Criteria (lihat §5 di bawah).
4. Edge cases:
   - Semua siswa belum diabsen lalu tekan Simpan → muncul peringatan, data tidak tersimpan.
   - Sebagian belum → peringatan menyebutkan jumlah yang belum.
   - Ubah status cepat berulang → angka ringkasan tetap konsisten.
   - Reload halaman → kondisi baru (belum diabsen) karena scope harian frontend-only.

**Verifikasi:** checklist AC semua terpenuhi, build & typecheck sukses.

---

## 5. Checklist Acceptance Criteria (Acuan QA)

### §4.1 Daftar Siswa
- [ ] Semua siswa dari `data/students.ts` tampil.
- [ ] Nama terbaca jelas, urut alfabetis.

### §4.2 Tombol Hadir / Tidak Hadir
- [ ] Klik "Hadir" → status hadir, tombol hijau + ikon ✓.
- [ ] Klik "Tidak Hadir" → status tidak hadir, tombol merah + ikon ✗.
- [ ] Status bisa diubah berkali-kali sebelum simpan.

### §4.3 Simpan Absensi
- [ ] Klik "Simpan Absensi" → tersimpan ke `localStorage` (key ber-tanggal).
- [ ] Muncul konfirmasi sukses.
- [ ] Ada peringatan jika masih ada siswa belum diabsen (validasi).

### §4.4 Ringkasan
- [ ] Angka hadir / tidak hadir / belum selalu sesuai status terkini.
- [ ] Update otomatis tanpa reload.

---

## 6. Risiko & Catatan

| Risiko / Catatan | Mitigasi |
|------------------|----------|
| `create-next-app` berjalan interaktif | Berikan semua flag non-interaktif; direktori saat ini kosong sehingga aman. |
| Boilerplate Tailwind v4 (CSS-first) vs class config | Periksa versi Tailwind hasil scaffold; sesuaikan penulisan style (`@import "tailwindcss"` bila v4). |
| Teks tidak terbaca di atas kaca transparan | Patuhi kontras PRD (`text-gray-600`/`gray-800`), uji di posisi scroll berbeda. |
| localStorage penuh/tidak tersedia | Fallback: simpan tetap berjalan + `console.log` placeholder sesuai PRD §4.3. |
| Uji cepat ("klik berulang") | Semua update state murni & sinkron — tanpa async race condition. |

---

## 7. Urutan Eksekusi (Ringkas)

1. Phase 0: scaffold + install deps → 2. Phase 1: types & data → 3. Phase 2: hook → 4. Phase 3: komponen → 5. Phase 4: page + integrasi → 6. Phase 5: polish glass → 7. Phase 6: QA/build.
