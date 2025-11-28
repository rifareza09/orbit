import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Link } from "@inertiajs/react";

export default function DetailKegiatan() {
  // -------------------------
  // DUMMY DATA
  // -------------------------
  const data = {
    nama: "Sesi 1: Dasar-dasar Vocal dan Breathing",
    jenis: "Akademik",
    tanggal: "22/11/2025 15:00 WIB",
    divisi: "Band",
    deskripsi:
      "Pelatihan dasar teknik vokal dan pernapasan untuk meningkatkan kualitas suara.",
    programKerja: "Workshop Teknik Vokal dan Instrument",
    tempat: "Lt.5 Ruang 504",
    peserta: 23,
    dokumen: [
      "File Pendukung Kegiatan.pdf",
      "Surat Izin meminjam Ruangan.pdf",
      "",
      "",
    ],
    status: "Menunggu Review",
  };

  const badgeColor =
    data.status === "Menunggu Review"
      ? "bg-yellow-500"
      : data.status === "Disetujui"
      ? "bg-green-600"
      : data.status === "Ditolak"
      ? "bg-red-600"
      : "bg-gray-400";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-[#0B132B]">
            Manajemen Kegiatan
          </h1>

          <Link
            href="/manajemen-kegiatan"
            className="bg-[#0B132B] text-white px-6 py-2 rounded-lg hover:bg-[#0A1025] transition"
          >
            Kembali
          </Link>
        </div>

        {/* Container */}
        <div className="bg-white shadow rounded-xl overflow-hidden">
          {/* Title Bar */}
          <div className="bg-[#0B132B] text-white px-6 py-3 flex justify-between items-center">
            <span className="text-lg font-semibold">Detail Kegiatan</span>
            <span
              className={`px-3 py-1 rounded-lg text-sm font-semibold ${badgeColor}`}
            >
              {data.status}
            </span>
          </div>

          {/* 2 Columns */}
          <div className="grid grid-cols-12">
            {/* LEFT */}
            <div className="col-span-7 border-r p-6 space-y-4">
              <div>
                <p className="font-semibold">Nama Kegiatan</p>
                <p>{data.nama}</p>
              </div>

              <div>
                <p className="font-semibold">Jenis Kegiatan</p>
                <p>{data.jenis}</p>
              </div>

              <div>
                <p className="font-semibold">Tanggal & Waktu</p>
                <p>{data.tanggal}</p>
              </div>

              <div>
                <p className="font-semibold">Program Kerja</p>
                <p>{data.programKerja}</p>
              </div>

              <div>
                <p className="font-semibold">Tempat</p>
                <p>{data.tempat}</p>
              </div>

              <div>
                <p className="font-semibold">Jumlah Peserta</p>
                <p>{data.peserta}</p>
              </div>

              <div>
                <p className="font-semibold">Divisi</p>
                <p>{data.divisi}</p>
              </div>

              <div>
                <p className="font-semibold">Deskripsi Kegiatan</p>
                <p>{data.deskripsi}</p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="col-span-5 p-6">
              <p className="font-semibold mb-3 text-lg">Dokumen Pendukung</p>

              <table className="w-full text-sm border rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-[#0B132B] text-white">
                    <th className="px-4 py-2 text-left">Nama File</th>
                  </tr>
                </thead>

                <tbody>
                  {data.dokumen.map((file, i) => (
                    <tr key={i} className="border-b">
                      <td className="px-4 py-2">{file}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Evaluasi */}
          <div className="border-t px-6 py-6">
            <h2 className="text-lg font-semibold mb-3">Evaluasi Pengajuan</h2>

            <div className="grid grid-cols-12 gap-6">
              {/* Catatan */}
              <div className="col-span-8">
                <label className="font-semibold">Catatan Pengajuan</label>
                <textarea
                  className="w-full mt-2 border rounded-lg p-3 h-32"
                  placeholder="Berikan catatan..."
                ></textarea>
              </div>

              {/* Status */}
              <div className="col-span-4">
                <label className="font-semibold">Status Pengajuan</label>
                <input
                  className="w-full mt-2 border rounded-lg p-3"
                  placeholder="Contoh: Disetujui / Ditolak"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button className="bg-[#0B132B] text-white px-6 py-2 rounded-lg hover:bg-[#0A1025] transition">
                Simpan Review
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
        </p>
      </div>
    </DashboardLayout>
  );
}
