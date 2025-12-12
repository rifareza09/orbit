-- Insert migration records untuk Laravel
USE orbit;

TRUNCATE TABLE migrations;

INSERT INTO migrations (migration, batch) VALUES
('0001_01_01_000000_create_users_table', 1),
('0001_01_01_000001_create_cache_table', 1),
('0001_01_01_000002_create_jobs_table', 1),
('2025_08_26_100418_add_two_factor_columns_to_users_table', 1),
('2025_11_18_104749_create_program_kerjas_table', 1),
('2025_11_23_070817_update_program_kerjas_status_default', 1),
('2025_11_23_070825_update_program_kerjas_status_default', 1),
('2025_11_23_100759_create_pengajuan_kegiatans_table', 1),
('2025_11_23_100829_create_item_pengajuan_danas_table', 1),
('2025_11_23_110234_add_proposal_path_and_program_kerja_id_to_pengajuan_kegiatans_table', 1),
('2025_11_25_081226_add_jumlah_peserta_to_pengajuan_kegiatans_table', 1),
('2025_11_25_081254_add_jumlah_peserta_to_pengajuan_kegiatans_table', 1),
('2025_11_25_095656_create_laporan_kegiatans_table', 1),
('2025_11_25_144527_update_laporan_kegiatans_status_enum', 1),
('2025_11_25_192826_create_dokumentasis_table', 1),
('2025_12_10_000000_create_kepengurusans_table', 1),
('2025_12_10_160027_create_jadwal_latihans_table', 1),
('2025_12_10_161215_add_profile_fields_to_users_table', 1);
