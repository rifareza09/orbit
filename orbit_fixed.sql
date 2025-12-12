-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: localhost    Database: orbit
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dokumentasis`
--

DROP TABLE IF EXISTS `dokumentasis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dokumentasis` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `nama_kegiatan` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggal_kegiatan` date NOT NULL,
  `foto_path` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `dokumentasis_user_id_foreign` (`user_id`),
  CONSTRAINT `dokumentasis_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dokumentasis`
--

LOCK TABLES `dokumentasis` WRITE;
/*!40000 ALTER TABLE `dokumentasis` DISABLE KEYS */;
INSERT INTO `dokumentasis` VALUES (1,1,'Necessitatibus et sa','2018-11-14','dokumentasi/nOfejqfYr1yemmz9dTUIaRZrNIN2zghJttBSWv1p.png','2025-11-26 01:32:40','2025-11-26 01:32:40'),(2,1,'Do est rem enim offi','1999-05-21','dokumentasi/RyqfxTWI3QbVde8BaIyN5OoWhDx1wVtVUIkkEW4s.png','2025-11-26 04:13:14','2025-11-26 04:13:14');
/*!40000 ALTER TABLE `dokumentasis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_pengajuan_danas`
--

DROP TABLE IF EXISTS `item_pengajuan_danas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_pengajuan_danas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `pengajuan_kegiatan_id` bigint unsigned NOT NULL,
  `nama_item` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deskripsi_item` text COLLATE utf8mb4_unicode_ci,
  `quantity` int NOT NULL,
  `harga_satuan` decimal(15,2) NOT NULL,
  `total_harga` decimal(15,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `item_pengajuan_danas_pengajuan_kegiatan_id_foreign` (`pengajuan_kegiatan_id`),
  CONSTRAINT `item_pengajuan_danas_pengajuan_kegiatan_id_foreign` FOREIGN KEY (`pengajuan_kegiatan_id`) REFERENCES `pengajuan_kegiatans` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_pengajuan_danas`
--

LOCK TABLES `item_pengajuan_danas` WRITE;
/*!40000 ALTER TABLE `item_pengajuan_danas` DISABLE KEYS */;
INSERT INTO `item_pengajuan_danas` VALUES (1,1,'Fugiat quidem qui se','In quis iure atque d',73,99.00,7227.00,'2025-11-26 01:22:07','2025-11-26 01:22:07'),(2,2,'Cupidatat quia ullam','Itaque blanditiis an',56,57.00,3192.00,'2025-11-26 04:08:41','2025-11-26 04:08:41');
/*!40000 ALTER TABLE `item_pengajuan_danas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jadwal_latihans`
--

DROP TABLE IF EXISTS `jadwal_latihans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jadwal_latihans` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `divisi` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hari` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pukul` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tempat` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `jadwal_latihans_user_id_foreign` (`user_id`),
  CONSTRAINT `jadwal_latihans_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jadwal_latihans`
--

LOCK TABLES `jadwal_latihans` WRITE;
/*!40000 ALTER TABLE `jadwal_latihans` DISABLE KEYS */;
INSERT INTO `jadwal_latihans` VALUES (1,5,'Tari','Selasa','19:00-20:00','Sekre Samaka','2025-12-10 09:05:58','2025-12-10 09:05:58');
/*!40000 ALTER TABLE `jadwal_latihans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kepengurusans`
--

DROP TABLE IF EXISTS `kepengurusans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kepengurusans` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `jabatan` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prodi` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `npm` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `kepengurusans_user_id_foreign` (`user_id`),
  CONSTRAINT `kepengurusans_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kepengurusans`
--

LOCK TABLES `kepengurusans` WRITE;
/*!40000 ALTER TABLE `kepengurusans` DISABLE KEYS */;
INSERT INTO `kepengurusans` VALUES (1,5,'Ketua','Divia Alya','Psikologi','1602023000','2025-12-10 08:46:43','2025-12-10 08:46:43');
/*!40000 ALTER TABLE `kepengurusans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `laporan_kegiatans`
--

DROP TABLE IF EXISTS `laporan_kegiatans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `laporan_kegiatans` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `pengajuan_kegiatan_id` bigint unsigned NOT NULL,
  `anggaran_disetujui` decimal(15,0) DEFAULT NULL,
  `anggaran_realisasi` decimal(15,0) DEFAULT NULL,
  `ringkasan` text COLLATE utf8mb4_unicode_ci,
  `status` enum('Belum Diajukan','Diajukan','Direview','Disetujui','Direvisi','Ditolak') COLLATE utf8mb4_unicode_ci DEFAULT 'Belum Diajukan',
  `lpj_file` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bukti_pengeluaran` json DEFAULT NULL,
  `dokumentasi` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `laporan_kegiatans_pengajuan_kegiatan_id_foreign` (`pengajuan_kegiatan_id`),
  KEY `laporan_kegiatans_user_id_foreign` (`user_id`),
  CONSTRAINT `laporan_kegiatans_pengajuan_kegiatan_id_foreign` FOREIGN KEY (`pengajuan_kegiatan_id`) REFERENCES `pengajuan_kegiatans` (`id`) ON DELETE CASCADE,
  CONSTRAINT `laporan_kegiatans_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `laporan_kegiatans`
--

LOCK TABLES `laporan_kegiatans` WRITE;
/*!40000 ALTER TABLE `laporan_kegiatans` DISABLE KEYS */;
INSERT INTO `laporan_kegiatans` VALUES (1,1,1,7227,42,'Voluptatum qui esse','Diajukan','laporan/lpj/O7pcNLs1wTfbb15V6p7Vrmlfb5fcKvjFyszvoOHZ.pdf','[\"laporan/bukti/6anS4u6dVcr6ez3tHZedKntSspvemQNrLD2VVmoY.png\"]','[\"laporan/dok/CE2Aak9WPm8odzzi4qgS5GfpMg3nxo7NhsjSsMdn.png\"]','2025-11-26 01:24:23','2025-11-26 01:31:35'),(2,1,2,3192,6999,'mekdel','Diajukan','laporan/lpj/quXdmUbXIf0oYqogzVZ2ebVJLlLEuRDJln7ujErX.pdf','[\"laporan/bukti/Fbj1SerjcW0VBmBfkkoWAwGkCdTl3IN3BA3Wdab9.png\", \"laporan/bukti/lIRKjkzEsTSuHzED2vepclFzXFioGvn4lAb1OcRJ.png\", \"laporan/bukti/oouOIP42AtdQbRxf7JMWo4ziwbYXX0Kfcb8eubhN.png\"]','[\"laporan/dok/dN2vww5zX2ArKphvPi0uPlFudVI8DQ0RQtsGmakq.png\", \"laporan/dok/DhAmDdzf6uA6IttDNKZZOm5x6RGj04KhgW55zvmg.png\", \"laporan/dok/WbWvbS2b9IwH3j7uesFhDCrNJnmfx7kwKWCxJZot.png\"]','2025-11-26 04:12:10','2025-11-26 04:12:35');
/*!40000 ALTER TABLE `laporan_kegiatans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2025_08_26_100418_add_two_factor_columns_to_users_table',1),(5,'2025_11_18_104749_create_program_kerjas_table',1),(6,'2025_11_23_070817_update_program_kerjas_status_default',1),(7,'2025_11_23_070825_update_program_kerjas_status_default',1),(8,'2025_11_23_100759_create_pengajuan_kegiatans_table',1),(9,'2025_11_23_100829_create_item_pengajuan_danas_table',1),(10,'2025_11_23_110234_add_proposal_path_and_program_kerja_id_to_pengajuan_kegiatans_table',1),(11,'2025_11_25_081226_add_jumlah_peserta_to_pengajuan_kegiatans_table',1),(12,'2025_11_25_081254_add_jumlah_peserta_to_pengajuan_kegiatans_table',1),(13,'2025_11_25_095656_create_laporan_kegiatans_table',1),(14,'2025_11_25_144527_update_laporan_kegiatans_status_enum',1),(15,'2025_11_25_192826_create_dokumentasis_table',1),(16,'2025_12_10_000000_create_kepengurusans_table',1),(17,'2025_12_10_160027_create_jadwal_latihans_table',1),(18,'2025_12_10_161215_add_profile_fields_to_users_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pengajuan_kegiatans`
--

DROP TABLE IF EXISTS `pengajuan_kegiatans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pengajuan_kegiatans` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `nama_kegiatan` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ketua_pelaksana` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tempat_pelaksanaan` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jumlah_peserta` int NOT NULL DEFAULT '0',
  `tanggal_pelaksanaan` date NOT NULL,
  `total_anggaran` decimal(15,2) NOT NULL DEFAULT '0.00',
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Belum Diajukan',
  `deskripsi` text COLLATE utf8mb4_unicode_ci,
  `proposal_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `program_kerja_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pengajuan_kegiatans_program_kerja_id_foreign` (`program_kerja_id`),
  KEY `pengajuan_kegiatans_user_id_foreign` (`user_id`),
  CONSTRAINT `pengajuan_kegiatans_program_kerja_id_foreign` FOREIGN KEY (`program_kerja_id`) REFERENCES `program_kerjas` (`id`) ON DELETE SET NULL,
  CONSTRAINT `pengajuan_kegiatans_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pengajuan_kegiatans`
--

LOCK TABLES `pengajuan_kegiatans` WRITE;
/*!40000 ALTER TABLE `pengajuan_kegiatans` DISABLE KEYS */;
INSERT INTO `pengajuan_kegiatans` VALUES (1,1,'Reprehenderit sequi','Adipisci eaque saepe','Et aliquip quis volu',7,'2015-12-15',7227.00,'Diajukan','Dolore amet quisqua','proposals/AN3wpQmJWlsm7dpruIaOW7v1TlpHG9pWeMnOV7Af.pdf','2025-11-26 01:22:05','2025-11-26 01:23:05',1),(2,1,'Sint saepe voluptat','Inventore explicabo','Ut rem et explicabo',71,'1994-09-10',3192.00,'Diajukan','Reprehenderit sit i','proposals/iw4S8GSTRQmdF2ig65rrBXwPfcFKp6xR5dT5bfCF.pdf','2025-11-26 04:08:40','2025-11-26 04:09:17',2);
/*!40000 ALTER TABLE `pengajuan_kegiatans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prestasis`
--

DROP TABLE IF EXISTS `prestasis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prestasis` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `nama_prestasi` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jenis_prestasi` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tingkat_kejuaraan` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama_peraih` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggal_perolehan` date NOT NULL,
  `bukti_file` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `prestasis_user_id_foreign` (`user_id`),
  CONSTRAINT `prestasis_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prestasis`
--

LOCK TABLES `prestasis` WRITE;
/*!40000 ALTER TABLE `prestasis` DISABLE KEYS */;
INSERT INTO `prestasis` VALUES (2,1,'Masak Telor','Seni','Univesitas','Sofyan','2025-11-26','prestasi/bukti/dkWlaRdfrPkH13w8Lm1zxOBO6lXlKS411sxfGsF2.pdf','2025-11-26 08:45:00','2025-11-26 08:45:00');
/*!40000 ALTER TABLE `prestasis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `program_kerjas`
--

DROP TABLE IF EXISTS `program_kerjas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `program_kerjas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `program_kerja` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kegiatan` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deskripsi_kegiatan` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `jenis_kegiatan` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `estimasi_anggaran` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Belum Diajukan',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `program_kerjas_user_id_foreign` (`user_id`),
  CONSTRAINT `program_kerjas_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `program_kerjas`
--

LOCK TABLES `program_kerjas` WRITE;
/*!40000 ALTER TABLE `program_kerjas` DISABLE KEYS */;
INSERT INTO `program_kerjas` VALUES (1,1,'Dolores enim quos en','Reprehenderit sequi','Non officiis veritat','Akademik dan Prestasi','1000000','Diajukan','2025-11-26 01:20:51','2025-11-26 01:21:18'),(2,1,'Laborum fugiat volup','Sint saepe voluptat','Dolorem adipisci ea','Pengembangan Sumber Daya Mahasiswa','1000000','Diajukan','2025-11-26 03:18:18','2025-11-26 04:07:51'),(3,1,'Cupiditate consequat','Non obcaecati dolor','Ipsam reiciendis fug','Teknologi dan Inovasi','9000000','Belum Diajukan','2025-11-26 04:03:25','2025-11-26 04:03:25');
/*!40000 ALTER TABLE `program_kerjas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logo_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `periode` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deskripsi` text COLLATE utf8mb4_unicode_ci,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `two_factor_secret` text COLLATE utf8mb4_unicode_ci,
  `two_factor_recovery_codes` text COLLATE utf8mb4_unicode_ci,
  `two_factor_confirmed_at` timestamp NULL DEFAULT NULL,
  `role` enum('puskaka','ukm','bem','kongres','guest') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'guest',
  `ormawa_id` bigint unsigned DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_username_unique` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'LDK KAHFI','ldk',NULL,NULL,NULL,'$2y$12$lsuhoxp2JCkKwK9UtacRQOKmnvmq61I9eDxdlmyzheiSgU2.P3uXC',NULL,NULL,NULL,'ukm',NULL,NULL,'2025-11-26 01:00:57','2025-11-26 01:00:57'),(2,'VOYAGE','voyage',NULL,NULL,NULL,'$2y$12$DPWo0o9GocGuAntW6zuP/u5.HQrmtbyMXLnURib.B4Awky2iSJvnG',NULL,NULL,NULL,'ukm',NULL,NULL,'2025-11-26 01:00:59','2025-11-26 01:00:59'),(3,'HIMASI','himasi',NULL,NULL,NULL,'$2y$12$9cfynihJR/V4eHgCRbU9pOrWPcu7wqj9vbRhs56gJyfeU.c2YpgLq',NULL,NULL,NULL,'ukm',NULL,NULL,'2025-11-26 01:01:01','2025-11-26 01:01:01'),(4,'YBBC','ybbc',NULL,NULL,NULL,'$2y$12$JYmU/4iEooQoIM7x5HbLyeeO1EDVDPq2FivTaHhXbWyflqvd7zD4O',NULL,NULL,NULL,'ukm',NULL,NULL,'2025-11-26 01:01:04','2025-11-26 01:01:04'),(5,'SMAKA','smaka','logos/wps53UHio8EmT6qcxWiAdYy0bmmbaLL5yKzCsjL8.jpg','2025/2026','Smaka adalah gw gatau mau nulis apa jujur, gw anak LDK soalnyaa itu juga udah ga aktif-aktif amat','$2y$12$OLVXiOBVHKRGaOUXl11NS.wzKYvqdkydYCVf6cebpxR8nXTkTNUMu',NULL,NULL,NULL,'ukm',NULL,NULL,'2025-11-26 01:01:06','2025-12-10 09:18:51'),(6,'BEM','bem',NULL,NULL,NULL,'$2y$12$GIics3hfpZ2KK9efiaKI6uGBxQyP06yG2rzWquZwwPLHdqrKOV9Jy',NULL,NULL,NULL,'bem',NULL,NULL,'2025-11-26 01:01:07','2025-11-26 01:01:07'),(7,'KONGRES','kongres',NULL,NULL,NULL,'$2y$12$a5KLuO9WKk..i9XYEdo0/eokOl.7N.wldsOYgp9FU3ZltgCJKgU5a',NULL,NULL,NULL,'kongres',NULL,NULL,'2025-11-26 01:01:08','2025-11-26 01:01:08'),(8,'PUSKAKA','puskaka',NULL,NULL,NULL,'$2y$12$ECQWWtIXHwgk5QKgBitMauz/3LRSDswojA1I5uuTSxw9TJj//I3Pm',NULL,NULL,NULL,'puskaka',NULL,NULL,'2025-11-26 01:01:10','2025-11-26 01:01:10');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-11 14:22:07
