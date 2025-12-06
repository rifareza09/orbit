import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Link } from "@inertiajs/react";

export default function DetailLaporan() {
  const data = {
    nama: "Seminar Kesehatan Nasional",
    jenis: "Akademik",
    tanggal: "22/11/2025 10:00 WIB",
    ormawa: "Sema FTI",
    tempat: "Aula Lt. 6",
    peserta: 150,
    deskripsi:
      "Seminar nasional mengenai kesehatan dan pola hidup sehat yang diadakan oleh Sema FTI.",
    status: "Direview",
    dokumen: [
      "Laporan Kegiatan.pdf",
      "Foto Dokumentasi.zip",
      "Lampiran Peserta.pdf",
    ],
  };

  const badgeColor =
    data.status === "Menunggu Review"
      ? "bg-yellow-500"
      : data.status === "Direview"
      ? "bg-blue-600"
      : data.status === "Selesai"
      ? "bg-green-600"
      : "bg-gray-400";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-[#0B132B]">
            Evaluasi & Laporan
          </h1>

          <Link
            href="/evaluasi-laporan"
            className="bg-[#0B132B] text-white px-6 py-2 rounded-lg hover:bg-[#0A1025] transition"
          >
            Kembali
          </Link>
        </div>

        {/* Container */}
        <div className="bg-white shadow rounded-xl overflow-hidden">
          {/* Title */}
          <div className="bg-[#0B132B] text-white px-6 py-3 flex justify-between items-center">
            <span className="text-lg font-semibold">Detail Laporan</span>
            <span
              className={`px-3 py-1 rounded-lg text-sm font-semibold ${badgeColor}`}
            >
              {data.status}
            </span>
          </div>

          {/* Content */}
          <div className="grid grid-cols-12">
            {/* LEFT */}
            <div className="col-span-7 border-r p-6 space-y-4">
              <div>
                <p className="font-semibold">Nama Kegiatan</p>
                <p>{data.nama}</p>
              </div>

              <div>
                <p className="font-semibold">Ormawa</p>
                <p>{data.ormawa}</p>
              </div>

              <div>
                <p className="font-semibold">Jenis Kegiatan</p>
                <p>{data.jenis}</p>
              </div>

              <div>
                <p className="font-semibold">Tanggal Pelaksanaan</p>
                <p>{data.tanggal}</p>
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
                <p className="font-semibold">Deskripsi Kegiatan</p>
                <p>{data.deskripsi}</p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="col-span-5 p-6">
              <p className="font-semibold mb-3 text-lg">Dokumen Laporan</p>

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
            <h2 className="text-lg font-semibold mb-3">Evaluasi Laporan</h2>

            <div className="grid grid-cols-12 gap-6">
              {/* Catatan */}
              <div className="col-span-8">
                <label className="font-semibold">Catatan Evaluasi</label>
                <textarea
                  className="w-full mt-2 border rounded-lg p-3 h-32"
                  placeholder="Tambahkan catatan evaluasi..."
                ></textarea>
              </div>

              {/* Status */}
              <div className="col-span-4">
                <label className="font-semibold">Status Laporan</label>
                <input
                  className="w-full mt-2 border rounded-lg p-3"
                  placeholder="Contoh: Selesai / Revisi"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
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
