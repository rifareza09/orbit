import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { usePage } from "@inertiajs/react";

type DashboardProps = {
  stats?: {
    total: number;
    review: number;
    approved: number;
    done: number;
  };
  userName?: string;
  progressSteps?: Array<{ label: string; status: string }>;
  proposalsList?: Array<{ id: number; nama_kegiatan: string; status: string; progressActive: string[]; created_at: string }>;
  defaultProposalId?: number;
  defaultProgressActive?: string[];
  latestProposalStatus?: string;
  statistikKegiatan?: {
    belumDiajukan: number;
    diajukan: number;
    direview: number;
    disetujui: number;
    ditolak: number;
    direvisi: number;
  };
  aktivitasTerakhir?: Array<{
    type: string;
    id: number;
    nama: string;
    status: string;
    tanggal: string;
    tanggal_format: string;
  }>;
};

export default function DashboardPage() {
  const { stats, userName, progressSteps = [], proposalsList = [], defaultProposalId, defaultProgressActive = [], latestProposalStatus, statistikKegiatan, aktivitasTerakhir = [] } = usePage<DashboardProps>().props;
  const [selectedProposalId, setSelectedProposalId] = React.useState<number | null>(defaultProposalId ?? null);

  // Ambil 3 proposal terbaru untuk tabs
  const topProposals = proposalsList.slice(0, 3);
  const moreProposals = proposalsList.slice(3);
  const hasMore = moreProposals.length > 0;

  // Ambil proposal yang dipilih
  const selectedProposal = proposalsList.find(p => p.id === selectedProposalId) || proposalsList[0];
  const currentProgressActive = selectedProposal?.progressActive ?? defaultProgressActive;
  const kpis = {
    total: stats?.total ?? 0,
    review: stats?.review ?? 0,
    approved: stats?.approved ?? 0,
    done: stats?.done ?? 0,
  };
  return (
    <DashboardLayout>
      {/* Header banner */}
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[#0B132B]">Halo, {userName || 'UKM'}!</h1>
        </div>

        {/* Status timeline */}
        <div className="bg-[#0B132B] text-white rounded-2xl p-6">
          <div className="font-medium mb-4">Status Kegiatan</div>

          {/* Tabs untuk 3 proposal terbaru + dropdown untuk sisanya */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {topProposals.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedProposalId(p.id)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition whitespace-nowrap ${
                  selectedProposalId === p.id
                    ? 'bg-yellow-400 text-[#0B132B]'
                    : 'bg-[#1C2541] text-white hover:bg-[#2C3551]'
                }`}
                title={p.nama_kegiatan}
              >
                {p.nama_kegiatan.length > 15 ? p.nama_kegiatan.substring(0, 15) + '...' : p.nama_kegiatan}
              </button>
            ))}

            {/* Dropdown untuk kegiatan lainnya */}
            {hasMore && (
              <select
                value={selectedProposalId ?? ''}
                onChange={(e) => setSelectedProposalId(Number(e.target.value))}
                className="bg-[#1C2541] text-white text-sm px-3 py-1.5 rounded border border-white/30 focus:outline-none hover:bg-[#2C3551] transition"
              >
                <option value="">Lihat lebih banyak...</option>
                {moreProposals.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nama_kegiatan}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Info status proposal yang dipilih */}
          {selectedProposal && (
            <div className="text-xs text-white/80 mb-4">
              Status: <span className="font-semibold text-yellow-400">{selectedProposal.status}</span> · Dibuat: {selectedProposal.created_at}
            </div>
          )}

          {/* Progress timeline */}
          <div className="flex items-center justify-between">
            {progressSteps.map((step, idx, arr) => (
              <div key={step.status} className="flex items-center w-full">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    currentProgressActive.includes(step.status) ? "border-yellow-400" : "border-white/40"
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${currentProgressActive.includes(step.status) ? "bg-yellow-400" : "bg-white/30"}`} />
                </div>
                <div className="ml-2 text-xs">{step.label}</div>
                {idx < arr.length - 1 && (
                  <div className="flex-1 h-px bg-white/30 mx-3" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {[
            { title: "Total Kegiatan", value: kpis.total, color: "#0B132B" },
            { title: "Sedang Direview", value: kpis.review, color: "#1C2541" },
            { title: "Disetujui", value: kpis.approved, color: "#5BC0BE" },
            { title: "Selesai", value: kpis.done, color: "#3A506B" },
          ].map((k) => (
            <div key={k.title} className="bg-white rounded-2xl shadow p-6 border border-gray-200">
              <p className="text-gray-500">{k.title}</p>
              <h2 className="text-2xl font-semibold text-[#0B132B] mt-2">{k.value}</h2>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-[#0B132B] font-medium mb-4">Statistik Kegiatan</h3>
            <div className="space-y-3">
              {[
                { label: 'Belum Diajukan', value: statistikKegiatan?.belumDiajukan ?? 0, color: 'bg-gray-300' },
                { label: 'Diajukan / Review', value: (statistikKegiatan?.diajukan ?? 0) + (statistikKegiatan?.direview ?? 0), color: 'bg-yellow-400' },
                { label: 'Disetujui', value: statistikKegiatan?.disetujui ?? 0, color: 'bg-green-500' },
                { label: 'Ditolak / Direvisi', value: (statistikKegiatan?.ditolak ?? 0) + (statistikKegiatan?.direvisi ?? 0), color: 'bg-red-500' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <span className="ml-auto font-semibold text-[#0B132B]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-[#0B132B] font-medium mb-4">Aktivitas Terakhir</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {aktivitasTerakhir && aktivitasTerakhir.length > 0 ? (
                aktivitasTerakhir.map((activity, idx) => (
                  <div key={`${activity.type}-${activity.id}`} className="pb-3 border-b last:border-b-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-semibold px-2 py-1 rounded ${
                            activity.type === 'pengajuan' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {activity.type === 'pengajuan' ? 'Pengajuan' : 'Laporan'}
                          </span>
                          <span className={`text-xs font-medium px-2 py-1 rounded ${
                            activity.status === 'Disetujui' ? 'bg-green-100 text-green-700' :
                            activity.status === 'Ditolak' ? 'bg-red-100 text-red-700' :
                            activity.status === 'Direvisi' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {activity.status}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-[#0B132B] mt-1">{activity.nama}</p>
                        <p className="text-xs text-gray-500">{activity.tanggal_format}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 text-sm py-6">Belum ada aktivitas</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
