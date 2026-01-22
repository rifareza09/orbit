<?php

namespace App\Exports;

use App\Models\User;
use App\Models\Kepengurusan;
use App\Models\JadwalLatihan;
use App\Models\PengajuanKegiatan;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Font;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;

class OrmawaDetailExport implements FromCollection, WithHeadings, WithStyles, ShouldAutoSize
{
    private $userId;
    private $sheets = [];

    public function __construct($userId)
    {
        $this->userId = $userId;
    }

    public function collection()
    {
        // Sheet 1: Data Struktur Kepengurusan
        $kepengurusan = Kepengurusan::where('user_id', $this->userId)
            ->orderBy('jabatan')
            ->get()
            ->map(function ($item, $index) {
                return [
                    'No' => $index + 1,
                    'Jabatan' => $item->jabatan,
                    'Nama' => $item->nama,
                    'Prodi' => $item->prodi,
                    'NPM' => $item->npm,
                ];
            });

        $this->sheets['Kepengurusan'] = $kepengurusan->toArray();

        // Sheet 2: Jadwal Latihan
        $jadwal = JadwalLatihan::where('user_id', $this->userId)
            ->orderBy('hari')
            ->get()
            ->map(function ($item, $index) {
                return [
                    'No' => $index + 1,
                    'Divisi' => $item->divisi,
                    'Hari' => $item->hari,
                    'Jam' => $item->pukul,
                    'Tempat' => $item->tempat,
                ];
            });

        $this->sheets['Jadwal'] = $jadwal->toArray();

        // Sheet 3: Kegiatan yang Diajukan
        $kegiatan = PengajuanKegiatan::where('user_id', $this->userId)
            ->with('programKerja')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item, $index) {
                return [
                    'No' => $index + 1,
                    'Nama Kegiatan' => $item->nama_kegiatan,
                    'Program Kerja' => $item->programKerja?->program_kerja ?? '-',
                    'Tanggal Pelaksanaan' => $item->tanggal_pelaksanaan,
                    'Status' => $item->status,
                    'Anggaran Diajukan' => 'Rp ' . number_format($item->total_dana_diajukan ?? 0, 0, ',', '.'),
                ];
            });

        $this->sheets['Kegiatan'] = $kegiatan->toArray();

        // Return koleksi untuk sheet pertama
        return collect($this->sheets['Kepengurusan']);
    }

    public function headings(): array
    {
        return ['No', 'Jabatan', 'Nama', 'Prodi', 'NPM'];
    }

    public function styles(Worksheet $sheet)
    {
        $sheet->getStyle('A1:E1')->applyFromArray([
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '0B132B']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
        ]);

        $sheet->getStyle('A:E')->applyFromArray([
            'border' => [
                'allBorders' => ['borderStyle' => Border::BORDER_THIN],
            ],
        ]);

        return [];
    }
}
