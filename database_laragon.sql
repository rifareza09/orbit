-- Database Schema untuk Laragon MySQL
-- Generated from Files.io migration

USE orbit;

-- Drop tables in reverse dependency order if exists
DROP TABLE IF EXISTS `dokumentasis`;
DROP TABLE IF EXISTS `item_pengajuan_danas`;
DROP TABLE IF EXISTS `jadwal_latihans`;
DROP TABLE IF EXISTS `kepengurusans`;
DROP TABLE IF EXISTS `laporan_kegiatans`;
DROP TABLE IF EXISTS `pengajuan_kegiatans`;
DROP TABLE IF EXISTS `prestasis`;
DROP TABLE IF EXISTS `program_kerjas`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `cache`;
DROP TABLE IF EXISTS `cache_locks`;
DROP TABLE IF EXISTS `failed_jobs`;
DROP TABLE IF EXISTS `job_batches`;
DROP TABLE IF EXISTS `jobs`;
DROP TABLE IF EXISTS `migrations`;
DROP TABLE IF EXISTS `sessions`;

-- Create tables
CREATE TABLE `cache` (
  `key` VARCHAR(255) NOT NULL,
  `value` MEDIUMTEXT NOT NULL,
  `expiration` INT NOT NULL,
  CONSTRAINT `PRIMARY` PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cache_locks` (
  `key` VARCHAR(255) NOT NULL,
  `owner` VARCHAR(255) NOT NULL,
  `expiration` INT NOT NULL,
  CONSTRAINT `PRIMARY` PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `failed_jobs` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
  `uuid` VARCHAR(255) NOT NULL,
  `connection` TEXT NOT NULL,
  `queue` TEXT NOT NULL,
  `payload` LONGTEXT NOT NULL,
  `exception` LONGTEXT NOT NULL,
  `failed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `PRIMARY` PRIMARY KEY (`id`),
  CONSTRAINT `failed_jobs_uuid_unique` UNIQUE (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `job_batches` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `total_jobs` INT NOT NULL,
  `pending_jobs` INT NOT NULL,
  `failed_jobs` INT NOT NULL,
  `failed_job_ids` LONGTEXT NOT NULL,
  `options` MEDIUMTEXT NULL,
  `cancelled_at` INT NULL,
  `created_at` INT NOT NULL,
  `finished_at` INT NULL,
  CONSTRAINT `PRIMARY` PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `jobs` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
  `queue` VARCHAR(255) NOT NULL,
  `payload` LONGTEXT NOT NULL,
  `attempts` TINYINT UNSIGNED NOT NULL,
  `reserved_at` INT UNSIGNED NULL,
  `available_at` INT UNSIGNED NOT NULL,
  `created_at` INT UNSIGNED NOT NULL,
  CONSTRAINT `PRIMARY` PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `migrations` (
  `id` INT UNSIGNED AUTO_INCREMENT NOT NULL,
  `migration` VARCHAR(255) NOT NULL,
  `batch` INT NOT NULL,
  CONSTRAINT `PRIMARY` PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `sessions` (
  `id` VARCHAR(255) NOT NULL,
  `user_id` BIGINT UNSIGNED NULL,
  `ip_address` VARCHAR(45) NULL,
  `user_agent` TEXT NULL,
  `payload` LONGTEXT NOT NULL,
  `last_activity` INT NOT NULL,
  CONSTRAINT `PRIMARY` PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `users` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `username` VARCHAR(255) NOT NULL,
  `logo_path` VARCHAR(255) NULL,
  `periode` VARCHAR(255) NULL,
  `deskripsi` TEXT NULL,
  `password` VARCHAR(255) NOT NULL,
  `two_factor_secret` TEXT NULL,
  `two_factor_recovery_codes` TEXT NULL,
  `two_factor_confirmed_at` TIMESTAMP NULL,
  `role` ENUM('puskaka','ukm','bem','kongres','guest') NOT NULL DEFAULT 'guest',
  `ormawa_id` BIGINT UNSIGNED NULL,
  `remember_token` VARCHAR(100) NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  CONSTRAINT `PRIMARY` PRIMARY KEY (`id`),
  CONSTRAINT `users_username_unique` UNIQUE (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `dokumentasis` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `nama_kegiatan` VARCHAR(255) NOT NULL,
  `tanggal_kegiatan` DATE NOT NULL,
  `foto_path` TEXT NOT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  CONSTRAINT `PRIMARY` PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `program_kerjas` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `program_kerja` VARCHAR(255) NOT NULL,
  `kegiatan` VARCHAR(255) NOT NULL,
  `deskripsi_kegiatan` TEXT NOT NULL,
  `jenis_kegiatan` VARCHAR(255) NOT NULL,
  `estimasi_anggaran` VARCHAR(255) NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'Belum Diajukan',
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  CONSTRAINT `PRIMARY` PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `pengajuan_kegiatans` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `nama_kegiatan` VARCHAR(255) NOT NULL,
  `ketua_pelaksana` VARCHAR(255) NOT NULL,
  `tempat_pelaksanaan` VARCHAR(255) NOT NULL,
  `jumlah_peserta` INT NOT NULL DEFAULT 0,
  `tanggal_pelaksanaan` DATE NOT NULL,
  `total_anggaran` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  `status` VARCHAR(255) NOT NULL DEFAULT 'Belum Diajukan',
  `deskripsi` TEXT NULL,
  `proposal_path` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  `program_kerja_id` BIGINT UNSIGNED NULL,
  CONSTRAINT `PRIMARY` PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `item_pengajuan_danas` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
  `pengajuan_kegiatan_id` BIGINT UNSIGNED NOT NULL,
  `nama_item` VARCHAR(255) NOT NULL,
  `deskripsi_item` TEXT NULL,
  `quantity` INT NOT NULL,
  `harga_satuan` DECIMAL(15,2) NOT NULL,
  `total_harga` DECIMAL(15,2) NOT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  CONSTRAINT `PRIMARY` PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `jadwal_latihans` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `divisi` VARCHAR(255) NOT NULL,
  `hari` VARCHAR(255) NOT NULL,
  `pukul` VARCHAR(255) NOT NULL,
  `tempat` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  CONSTRAINT `PRIMARY` PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `kepengurusans` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `jabatan` VARCHAR(255) NOT NULL,
  `nama` VARCHAR(255) NOT NULL,
  `prodi` VARCHAR(255) NOT NULL,
  `npm` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  CONSTRAINT `PRIMARY` PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `laporan_kegiatans` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `pengajuan_kegiatan_id` BIGINT UNSIGNED NOT NULL,
  `anggaran_disetujui` DECIMAL(15,0) NULL,
  `anggaran_realisasi` DECIMAL(15,0) NULL,
  `ringkasan` TEXT NULL,
  `status` ENUM('Belum Diajukan','Diajukan','Direview','Disetujui','Direvisi','Ditolak') NULL DEFAULT 'Belum Diajukan',
  `lpj_file` VARCHAR(255) NULL,
  `bukti_pengeluaran` JSON NULL,
  `dokumentasi` JSON NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  CONSTRAINT `PRIMARY` PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `prestasis` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `nama_prestasi` VARCHAR(255) NOT NULL,
  `jenis_prestasi` VARCHAR(255) NOT NULL,
  `tingkat_kejuaraan` VARCHAR(255) NOT NULL,
  `nama_peraih` VARCHAR(255) NOT NULL,
  `tanggal_perolehan` DATE NOT NULL,
  `bukti_file` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  CONSTRAINT `PRIMARY` PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add foreign key constraints
ALTER TABLE `dokumentasis`
  ADD CONSTRAINT `dokumentasis_user_id_foreign`
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
  ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `item_pengajuan_danas`
  ADD CONSTRAINT `item_pengajuan_danas_pengajuan_kegiatan_id_foreign`
  FOREIGN KEY (`pengajuan_kegiatan_id`) REFERENCES `pengajuan_kegiatans` (`id`)
  ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `jadwal_latihans`
  ADD CONSTRAINT `jadwal_latihans_user_id_foreign`
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
  ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `kepengurusans`
  ADD CONSTRAINT `kepengurusans_user_id_foreign`
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
  ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `laporan_kegiatans`
  ADD CONSTRAINT `laporan_kegiatans_pengajuan_kegiatan_id_foreign`
  FOREIGN KEY (`pengajuan_kegiatan_id`) REFERENCES `pengajuan_kegiatans` (`id`)
  ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `laporan_kegiatans`
  ADD CONSTRAINT `laporan_kegiatans_user_id_foreign`
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
  ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `pengajuan_kegiatans`
  ADD CONSTRAINT `pengajuan_kegiatans_program_kerja_id_foreign`
  FOREIGN KEY (`program_kerja_id`) REFERENCES `program_kerjas` (`id`)
  ON DELETE SET NULL ON UPDATE NO ACTION;

ALTER TABLE `pengajuan_kegiatans`
  ADD CONSTRAINT `pengajuan_kegiatans_user_id_foreign`
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
  ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `prestasis`
  ADD CONSTRAINT `prestasis_user_id_foreign`
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
  ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `program_kerjas`
  ADD CONSTRAINT `program_kerjas_user_id_foreign`
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
  ON DELETE CASCADE ON UPDATE NO ACTION;

-- Add indexes for better performance
CREATE INDEX `jobs_queue_index` ON `jobs`(`queue`);
CREATE INDEX `sessions_user_id_index` ON `sessions`(`user_id`);
CREATE INDEX `sessions_last_activity_index` ON `sessions`(`last_activity`);
