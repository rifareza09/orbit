<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;

class NotificationService
{
    /**
     * Send notification to a user.
     */
    public static function send(
        int $userId,
        string $type,
        string $title,
        string $message,
        ?string $actionUrl = null,
        ?int $relatedId = null,
        ?string $relatedType = null
    ): Notification {
        return Notification::create([
            'user_id' => $userId,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'action_url' => $actionUrl,
            'related_id' => $relatedId,
            'related_type' => $relatedType,
        ]);
    }

    /**
     * Notify about Program Kerja status change.
     */
    public static function notifyProgramKerjaStatus(
        int $ormawaUserId,
        string $status,
        string $programKerjaName,
        int $programKerjaId,
        ?string $catatan = null
    ): void {
        $messages = [
            'Disetujui' => "Program Kerja '{$programKerjaName}' telah disetujui oleh Puskaka.",
            'Ditolak' => "Program Kerja '{$programKerjaName}' ditolak oleh Puskaka." . ($catatan ? " Catatan: {$catatan}" : ''),
            'Direvisi' => "Program Kerja '{$programKerjaName}' perlu direvisi." . ($catatan ? " Catatan: {$catatan}" : ''),
        ];

        $types = [
            'Disetujui' => 'program_kerja_approved',
            'Ditolak' => 'program_kerja_rejected',
            'Direvisi' => 'program_kerja_revision',
        ];

        if (isset($messages[$status])) {
            self::send(
                $ormawaUserId,
                $types[$status],
                "Status Program Kerja: {$status}",
                $messages[$status],
                "/program-kerja/{$programKerjaId}/detail",
                $programKerjaId,
                'App\Models\ProgramKerja'
            );
        }
    }

    /**
     * Notify Puskaka about new Program Kerja submission.
     */
    public static function notifyPuskakaNewProgramKerja(
        string $ormawaName,
        string $programKerjaName,
        int $programKerjaId
    ): void {
        $puskakaUsers = User::where('role', 'puskaka')->get();

        foreach ($puskakaUsers as $puskaka) {
            self::send(
                $puskaka->id,
                'program_kerja_submitted',
                'Program Kerja Baru',
                "{$ormawaName} telah mengajukan Program Kerja '{$programKerjaName}'",
                "/program-kerja/{$programKerjaId}/detail-puskaka",
                $programKerjaId,
                'App\Models\ProgramKerja'
            );
        }
    }

    /**
     * Notify about Pengajuan Kegiatan status change.
     */
    public static function notifyPengajuanKegiatanStatus(
        int $ormawaUserId,
        string $status,
        string $kegiatanName,
        int $pengajuanId,
        ?string $catatan = null
    ): void {
        $messages = [
            'Disetujui' => "Pengajuan Kegiatan '{$kegiatanName}' telah disetujui oleh Puskaka.",
            'Ditolak' => "Pengajuan Kegiatan '{$kegiatanName}' ditolak oleh Puskaka." . ($catatan ? " Catatan: {$catatan}" : ''),
            'Direvisi' => "Pengajuan Kegiatan '{$kegiatanName}' perlu direvisi." . ($catatan ? " Catatan: {$catatan}" : ''),
        ];

        $types = [
            'Disetujui' => 'pengajuan_approved',
            'Ditolak' => 'pengajuan_rejected',
            'Direvisi' => 'pengajuan_revision',
        ];

        if (isset($messages[$status])) {
            self::send(
                $ormawaUserId,
                $types[$status],
                "Status Pengajuan Kegiatan: {$status}",
                $messages[$status],
                "/pengajuan-kegiatan/{$pengajuanId}/detail",
                $pengajuanId,
                'App\Models\PengajuanKegiatan'
            );
        }
    }

    /**
     * Notify Puskaka about new Pengajuan Kegiatan submission.
     */
    public static function notifyPuskakaNewPengajuan(
        string $ormawaName,
        string $kegiatanName,
        int $pengajuanId
    ): void {
        $puskakaUsers = User::where('role', 'puskaka')->get();

        foreach ($puskakaUsers as $puskaka) {
            self::send(
                $puskaka->id,
                'pengajuan_submitted',
                'Pengajuan Kegiatan Baru',
                "{$ormawaName} telah mengajukan kegiatan '{$kegiatanName}'",
                "/manajemen-kegiatan/{$pengajuanId}/detail",
                $pengajuanId,
                'App\Models\PengajuanKegiatan'
            );
        }
    }

    /**
     * Notify about Laporan Kegiatan status change.
     */
    public static function notifyLaporanKegiatanStatus(
        int $ormawaUserId,
        string $status,
        string $kegiatanName,
        int $laporanId,
        ?string $catatan = null
    ): void {
        $messages = [
            'Selesai' => "Laporan Kegiatan '{$kegiatanName}' telah disetujui oleh Puskaka.",
            'Ditolak' => "Laporan Kegiatan '{$kegiatanName}' ditolak oleh Puskaka." . ($catatan ? " Catatan: {$catatan}" : ''),
            'Direvisi' => "Laporan Kegiatan '{$kegiatanName}' perlu direvisi." . ($catatan ? " Catatan: {$catatan}" : ''),
        ];

        $types = [
            'Selesai' => 'laporan_approved',
            'Ditolak' => 'laporan_rejected',
            'Direvisi' => 'laporan_revision',
        ];

        if (isset($messages[$status])) {
            self::send(
                $ormawaUserId,
                $types[$status],
                "Status Laporan Kegiatan: {$status}",
                $messages[$status],
                "/laporan-kegiatan/{$laporanId}/detail",
                $laporanId,
                'App\Models\LaporanKegiatan'
            );
        }
    }

    /**
     * Notify Puskaka about new Laporan Kegiatan submission.
     */
    public static function notifyPuskakaNewLaporan(
        string $ormawaName,
        string $kegiatanName,
        int $laporanId
    ): void {
        $puskakaUsers = User::where('role', 'puskaka')->get();

        foreach ($puskakaUsers as $puskaka) {
            self::send(
                $puskaka->id,
                'laporan_submitted',
                'Laporan Kegiatan Baru',
                "{$ormawaName} telah mengajukan laporan kegiatan '{$kegiatanName}'",
                "/evaluasi-laporan/detail/{$laporanId}",
                $laporanId,
                'App\Models\LaporanKegiatan'
            );
        }
    }
}
