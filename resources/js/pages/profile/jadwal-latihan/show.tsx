import React from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Edit2 } from 'lucide-react';

interface JadwalLatihan {
  id: number;
  divisi: string;
  hari: string;
  pukul: string;
  tempat: string;
  created_at: string;
  updated_at: string;
}

interface Props {
  jadwal: JadwalLatihan;
}

export default function ShowJadwalLatihan({ jadwal }: Props) {
  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 bg-[#F5F6FA] min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/profil"
              className="p-2 rounded-lg hover:bg-gray-200 transition"
            >
              <ArrowLeft size={20} className="text-[#0B132B]" />
            </Link>
            <h1 className="text-2xl font-bold text-[#0B132B]">
              Detail Jadwal Latihan
            </h1>
          </div>

          <Link
            href={`/profile/jadwal-latihan/${jadwal.id}/edit`}
            className="bg-[#0B132B] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#152042] transition flex items-center gap-2 shadow-md"
          >
            <Edit2 size={16} />
            Edit Jadwal
          </Link>
        </div>

        {/* Detail Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 max-w-3xl">
          <div className="space-y-6">
            {/* Divisi */}
            <div className="border-b border-gray-100 pb-4">
              <label className="block text-sm font-semibold text-gray-500 mb-2">
                Divisi/Seksi
              </label>
              <p className="text-base font-medium text-[#0B132B]">
                {jadwal.divisi}
              </p>
            </div>

            {/* Hari */}
            <div className="border-b border-gray-100 pb-4">
              <label className="block text-sm font-semibold text-gray-500 mb-2">
                Hari
              </label>
              <p className="text-base font-medium text-[#0B132B]">
                {jadwal.hari}
              </p>
            </div>

            {/* Pukul */}
            <div className="border-b border-gray-100 pb-4">
              <label className="block text-sm font-semibold text-gray-500 mb-2">
                Waktu
              </label>
              <p className="text-base font-medium text-[#0B132B]">
                {jadwal.pukul}
              </p>
            </div>

            {/* Tempat */}
            <div className="border-b border-gray-100 pb-4">
              <label className="block text-sm font-semibold text-gray-500 mb-2">
                Tempat
              </label>
              <p className="text-base font-medium text-[#0B132B]">
                {jadwal.tempat}
              </p>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">
                  Dibuat Pada
                </label>
                <p className="text-sm text-gray-600">
                  {new Date(jadwal.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">
                  Terakhir Diperbarui
                </label>
                <p className="text-sm text-gray-600">
                  {new Date(jadwal.updated_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
            <Link
              href="/profil"
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition text-center"
            >
              Kembali
            </Link>
            <Link
              href={`/profile/jadwal-latihan/${jadwal.id}/edit`}
              className="flex-1 bg-[#0B132B] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#152042] transition text-center"
            >
              Edit Jadwal
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
