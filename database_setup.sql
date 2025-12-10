-- Orbit Database Setup Script
-- Compatible with MySQL/MariaDB (without backticks)
-- Execute this script in your database management tool

-- Drop tables if they exist (optional, uncomment lines below if needed)
-- SET FOREIGN_KEY_CHECKS = 0;
-- DROP TABLE IF EXISTS dokumentasis, item_pengajuan_danas, laporan_kegiatans, pengajuan_kegiatans, prestasis, program_kerjas, users, cache_table, cache_locks, failed_jobs, job_batches, jobs, sessions, migrations;
-- SET FOREIGN_KEY_CHECKS = 1;

-- Cache tables (renamed to avoid 'key' reserved keyword)
CREATE TABLE IF NOT EXISTS cache_table (
  cache_key VARCHAR(255) NOT NULL,
  cache_value MEDIUMTEXT NOT NULL,
  expiration INT NOT NULL,
  PRIMARY KEY (cache_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cache_locks (
  lock_key VARCHAR(255) NOT NULL,
  owner VARCHAR(255) NOT NULL,
  expiration INT NOT NULL,
  PRIMARY KEY (lock_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Queue and job tables
CREATE TABLE IF NOT EXISTS failed_jobs (
  id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
  uuid VARCHAR(255) NOT NULL,
  connection TEXT NOT NULL,
  queue TEXT NOT NULL,
  payload LONGTEXT NOT NULL,
  exception LONGTEXT NOT NULL,
  failed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY failed_jobs_uuid_unique (uuid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS job_batches (
  id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  total_jobs INT NOT NULL,
  pending_jobs INT NOT NULL,
  failed_jobs INT NOT NULL,
  failed_job_ids LONGTEXT NOT NULL,
  options MEDIUMTEXT NULL,
  cancelled_at INT NULL,
  created_at INT NOT NULL,
  finished_at INT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS jobs (
  id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
  queue VARCHAR(255) NOT NULL,
  payload LONGTEXT NOT NULL,
  attempts TINYINT UNSIGNED NOT NULL,
  reserved_at INT UNSIGNED NULL,
  available_at INT UNSIGNED NOT NULL,
  created_at INT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  KEY jobs_queue_index (queue)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sessions (
  id VARCHAR(255) NOT NULL,
  user_id BIGINT UNSIGNED NULL,
  ip_address VARCHAR(45) NULL,
  user_agent TEXT NULL,
  payload LONGTEXT NOT NULL,
  last_activity INT NOT NULL,
  PRIMARY KEY (id),
  KEY sessions_user_id_index (user_id),
  KEY sessions_last_activity_index (last_activity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS migrations (
  id INT UNSIGNED AUTO_INCREMENT NOT NULL,
  migration VARCHAR(255) NOT NULL,
  batch INT NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Main application tables
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  two_factor_secret TEXT NULL,
  two_factor_recovery_codes TEXT NULL,
  two_factor_confirmed_at TIMESTAMP NULL,
  role ENUM('puskaka','ukm','bem','kongres','guest') NOT NULL DEFAULT 'guest',
  ormawa_id BIGINT UNSIGNED NULL,
  remember_token VARCHAR(100) NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  UNIQUE KEY users_username_unique (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS program_kerjas (
  id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  program_kerja VARCHAR(255) NOT NULL,
  kegiatan VARCHAR(255) NOT NULL,
  deskripsi_kegiatan TEXT NOT NULL,
  jenis_kegiatan VARCHAR(255) NOT NULL,
  estimasi_anggaran VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Belum Diajukan',
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  KEY program_kerjas_user_id_foreign (user_id),
  CONSTRAINT program_kerjas_user_id_foreign FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS pengajuan_kegiatans (
  id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  nama_kegiatan VARCHAR(255) NOT NULL,
  ketua_pelaksana VARCHAR(255) NOT NULL,
  tempat_pelaksanaan VARCHAR(255) NOT NULL,
  jumlah_peserta INT NOT NULL DEFAULT 0,
  tanggal_pelaksanaan DATE NOT NULL,
  total_anggaran DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  status VARCHAR(255) NOT NULL DEFAULT 'Belum Diajukan',
  deskripsi TEXT NULL,
  proposal_path VARCHAR(255) NULL,
  program_kerja_id BIGINT UNSIGNED NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  KEY pengajuan_kegiatans_user_id_foreign (user_id),
  KEY pengajuan_kegiatans_program_kerja_id_foreign (program_kerja_id),
  CONSTRAINT pengajuan_kegiatans_user_id_foreign FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT pengajuan_kegiatans_program_kerja_id_foreign FOREIGN KEY (program_kerja_id) REFERENCES program_kerjas (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS item_pengajuan_danas (
  id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
  pengajuan_kegiatan_id BIGINT UNSIGNED NOT NULL,
  nama_item VARCHAR(255) NOT NULL,
  deskripsi_item TEXT NULL,
  quantity INT NOT NULL,
  harga_satuan DECIMAL(15,2) NOT NULL,
  total_harga DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  KEY item_pengajuan_danas_pengajuan_kegiatan_id_foreign (pengajuan_kegiatan_id),
  CONSTRAINT item_pengajuan_danas_pengajuan_kegiatan_id_foreign FOREIGN KEY (pengajuan_kegiatan_id) REFERENCES pengajuan_kegiatans (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS laporan_kegiatans (
  id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  pengajuan_kegiatan_id BIGINT UNSIGNED NOT NULL,
  anggaran_disetujui DECIMAL(15,0) NULL,
  anggaran_realisasi DECIMAL(15,0) NULL,
  ringkasan TEXT NULL,
  status ENUM('Belum Diajukan','Diajukan','Direview','Disetujui','Direvisi','Ditolak') NULL DEFAULT 'Belum Diajukan',
  lpj_file VARCHAR(255) NULL,
  bukti_pengeluaran JSON NULL,
  dokumentasi JSON NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  KEY laporan_kegiatans_user_id_foreign (user_id),
  KEY laporan_kegiatans_pengajuan_kegiatan_id_foreign (pengajuan_kegiatan_id),
  CONSTRAINT laporan_kegiatans_user_id_foreign FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT laporan_kegiatans_pengajuan_kegiatan_id_foreign FOREIGN KEY (pengajuan_kegiatan_id) REFERENCES pengajuan_kegiatans (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS dokumentasis (
  id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  nama_kegiatan VARCHAR(255) NOT NULL,
  tanggal_kegiatan DATE NOT NULL,
  foto_path TEXT NOT NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  KEY dokumentasis_user_id_foreign (user_id),
  CONSTRAINT dokumentasis_user_id_foreign FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS prestasis (
  id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  nama_prestasi VARCHAR(255) NOT NULL,
  jenis_prestasi VARCHAR(255) NOT NULL,
  tingkat_kejuaraan VARCHAR(255) NOT NULL,
  nama_peraih VARCHAR(255) NOT NULL,
  tanggal_perolehan DATE NOT NULL,
  bukti_file VARCHAR(255) NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  KEY prestasis_user_id_foreign (user_id),
  CONSTRAINT prestasis_user_id_foreign FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default migration records (optional)
INSERT INTO migrations (migration, batch) VALUES
('0001_01_01_000000_create_users_table', 1),
('0001_01_01_000001_create_cache_table', 1),
('0001_01_01_000002_create_jobs_table', 1),
('2025_11_18_104749_create_program_kerjas_table', 1),
('2025_11_23_100759_create_pengajuan_kegiatans_table', 1),
('2025_12_04_create_dokumentasis_table', 1),
('2025_12_05_create_prestasis_table', 1)
ON DUPLICATE KEY UPDATE migration = VALUES(migration);
