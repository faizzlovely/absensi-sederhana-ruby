CREATE DATABASE IF NOT EXISTS absensi;
USE absensi;

CREATE TABLE IF NOT EXISTS students (
  id VARCHAR(10) PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(10) NOT NULL,
  status ENUM('hadir', 'tidak_hadir') NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_attendance (student_id, date),
  FOREIGN KEY (student_id) REFERENCES students(id)
);

-- Seed data 30 siswa
INSERT IGNORE INTO students (id, name) VALUES
('s1', 'Ahmad Fauzi'),
('s2', 'Aisyah Putri'),
('s3', 'Andi Saputra'),
('s4', 'Anisa Rahmawati'),
('s5', 'Bagas Pratama'),
('s6', 'Budi Santoso'),
('s7', 'Citra Dewi'),
('s8', 'Dedi Kurniawan'),
('s9', 'Desi Ayu Lestari'),
('s10', 'Eka Putri'),
('s11', 'Fajar Nugroho'),
('s12', 'Gita Sari'),
('s13', 'Hendra Wijaya'),
('s14', 'Indah Permata'),
('s15', 'Joko Prasetyo'),
('s16', 'Kartika Sari'),
('s17', 'Lukman Hakim'),
('s18', 'Maya Putri'),
('s19', 'Nanda Pratama'),
('s20', 'Omar Faruk'),
('s21', 'Putri Ayu'),
('s22', 'Rizki Ramadhan'),
('s23', 'Siti Nurhaliza'),
('s24', 'Taufik Rahman'),
('s25', 'Ulya Maghfiroh'),
('s26', 'Vina Oktaviani'),
('s27', 'Wahyu Setiawan'),
('s28', 'Yolanda Putri'),
('s29', 'Zainal Abidin'),
('s30', 'Zahra Amelia');
