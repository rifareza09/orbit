import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { usePage } from "@inertiajs/react";
import { motion } from "framer-motion";

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
        <motion.div
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0B132B] to-[#1C2541] bg-clip-text text-transparent">
            Halo, {userName || 'UKM'}! <span className="text-[#0B132B]">👋</span>
          </h1>
        </motion.div>

        {/* Status timeline */}
        <motion.div
          className="bg-gradient-to-br from-[#0B132B] to-[#1C2541] text-white rounded-3xl p-8 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          whileHover={{ scale: 1.01 }}
        >
          <div className="font-semibold text-lg mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
            Status Kegiatan
          </div>

          {/* Tabs untuk 3 proposal terbaru + dropdown untuk sisanya */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            {topProposals.map((p, idx) => (
              <motion.button
                key={p.id}
                onClick={() => setSelectedProposalId(p.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg ${
                  selectedProposalId === p.id
                    ? 'bg-yellow-400 text-[#0B132B] shadow-yellow-400/50'
                    : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                }`}
                title={p.nama_kegiatan}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {p.nama_kegiatan.length > 15 ? p.nama_kegiatan.substring(0, 15) + '...' : p.nama_kegiatan}
              </motion.button>
            ))}

            {/* Dropdown untuk kegiatan lainnya */}
            {hasMore && (
              <motion.select
                value={selectedProposalId ?? ''}
                onChange={(e) => setSelectedProposalId(Number(e.target.value))}
                className="bg-white/10 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-xl border border-white/30 focus:outline-none hover:bg-white/20 transition-all cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <option value="" className="bg-[#0B132B]">Lihat lebih banyak...</option>
                {moreProposals.map(p => (
                  <option key={p.id} value={p.id} className="bg-[#0B132B]">
                    {p.nama_kegiatan}
                  </option>
                ))}
              </motion.select>
            )}
          </div>

          {/* Info status proposal yang dipilih */}
          {selectedProposal && (
            <motion.div
              className="text-sm text-white/90 mb-6 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Status: <span className="font-bold text-yellow-400">{selectedProposal.status}</span> · Dibuat: {selectedProposal.created_at}
            </motion.div>
          )}

          {/* Progress timeline */}
          <div className="flex items-center justify-between">
            {progressSteps.map((step, idx, arr) => (
              <motion.div
                key={step.status}
                className="flex items-center w-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 + 0.5 }}
              >
                <motion.div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentProgressActive.includes(step.status) ? "border-yellow-400 shadow-lg shadow-yellow-400/50" : "border-white/40"
                  }`}
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`w-4 h-4 rounded-full ${currentProgressActive.includes(step.status) ? "bg-yellow-400 animate-pulse" : "bg-white/30"}`} />
                </motion.div>
                <div className="ml-2 text-sm font-medium">{step.label}</div>
                {idx < arr.length - 1 && (
                  <div className={`flex-1 h-1 rounded-full mx-4 ${currentProgressActive.includes(step.status) ? "bg-yellow-400" : "bg-white/30"}`} />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {[
            { title: "Total Kegiatan", value: kpis.total, color: "#0B132B", gradient: "from-blue-500 to-blue-700", icon: "📊" },
            { title: "Sedang Direview", value: kpis.review, color: "#1C2541", gradient: "from-yellow-500 to-orange-500", icon: "⏳" },
            { title: "Disetujui", value: kpis.approved, color: "#5BC0BE", gradient: "from-green-500 to-emerald-600", icon: "✅" },
            { title: "Selesai", value: kpis.done, color: "#3A506B", gradient: "from-purple-500 to-purple-700", icon: "🎉" },
          ].map((k, idx) => (
            <motion.div
              key={k.title}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all overflow-hidden relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 + 0.2, duration: 0.5 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${k.gradient} opacity-10 rounded-full blur-2xl`}></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600 text-sm font-medium">{k.title}</p>
                  <span className="text-2xl">{k.icon}</span>
                </div>
                <h2 className={`text-4xl font-bold bg-gradient-to-r ${k.gradient} bg-clip-text text-transparent`}>
                  {k.value}
                </h2>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.01 }}
          >
            <h3 className="text-[#0B132B] font-bold text-lg mb-6 flex items-center gap-2">
              📈 Statistik Kegiatan
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Belum Diajukan', value: statistikKegiatan?.belumDiajukan ?? 0, color: 'bg-gray-400', gradient: 'from-gray-400 to-gray-500' },
                { label: 'Diajukan / Review', value: (statistikKegiatan?.diajukan ?? 0) + (statistikKegiatan?.direview ?? 0), color: 'bg-yellow-400', gradient: 'from-yellow-400 to-orange-400' },
                { label: 'Disetujui', value: statistikKegiatan?.disetujui ?? 0, color: 'bg-green-500', gradient: 'from-green-500 to-emerald-600' },
                { label: 'Ditolak / Direvisi', value: (statistikKegiatan?.ditolak ?? 0) + (statistikKegiatan?.direvisi ?? 0), color: 'bg-red-500', gradient: 'from-red-500 to-rose-600' },
              ].map((item, idx) => (
                <motion.div
                  key={item.label}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 + 0.7 }}
                  whileHover={{ x: 5 }}
                >
                  <motion.div
                    className={`w-4 h-4 rounded-full bg-gradient-to-r ${item.gradient}`}
                    whileHover={{ scale: 1.3, rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  ></motion.div>
                  <span className="text-sm text-gray-700 font-medium flex-1">{item.label}</span>
                  <span className={`font-bold text-lg bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}>
                    {item.value}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.01 }}
          >
            <h3 className="text-[#0B132B] font-bold text-lg mb-6 flex items-center gap-2">
              🕒 Aktivitas Terakhir
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
              {aktivitasTerakhir && aktivitasTerakhir.length > 0 ? (
                aktivitasTerakhir.map((activity, idx) => (
                  <motion.div
                    key={`${activity.type}-${activity.id}`}
                    className="pb-3 border-b last:border-b-0 hover:bg-gray-50 p-3 rounded-xl transition-all"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 + 0.8 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <motion.span
                            className={`text-xs font-bold px-3 py-1 rounded-full ${
                              activity.type === 'pengajuan' 
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                                : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                            }`}
                            whileHover={{ scale: 1.1 }}
                          >
                            {activity.type === 'pengajuan' ? '📋 Pengajuan' : '📝 Laporan'}
                          </motion.span>
                          <motion.span
                            className={`text-xs font-semibold px-3 py-1 rounded-full ${
                              activity.status === 'Disetujui' ? 'bg-green-100 text-green-700' :
                              activity.status === 'Ditolak' ? 'bg-red-100 text-red-700' :
                              activity.status === 'Direvisi' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}
                            whileHover={{ scale: 1.1 }}
                          >
                            {activity.status}
                          </motion.span>
                        </div>
                        <p className="text-sm font-semibold text-[#0B132B]">{activity.nama}</p>
                        <p className="text-xs text-gray-500 mt-1">📅 {activity.tanggal_format}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="text-center text-gray-400 text-sm py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="text-5xl mb-3">📭</div>
                  <p>Belum ada aktivitas</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
