import React, { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { router, usePage } from "@inertiajs/react";
import { Plus } from "lucide-react";
import { formatCurrency, formatCurrencyInput, parseCurrency } from "@/utils/currency";

interface ProgramKerja {
  id: number;
  program_kerja: string;
  kegiatan: string;
  estimasi_anggaran: number;
  status: string;
}

interface ItemPengajuanDana {
  id?: number;
  nama_item: string;
  deskripsi_item: string;
  quantity: number;
  harga_satuan: number;
}

interface PengajuanKegiatan {
  id?: number;
  program_kerja_id?: number;
  nama_kegiatan: string;
  ketua_pelaksana: string;
  tempat_pelaksanaan: string;
  jumlah_peserta: number;
  tanggal_pelaksanaan: string;
  deskripsi: string;
  proposal_path?: string;
  status?: string;
  program_kerja?: ProgramKerja;
  item_pengajuan_dana: ItemPengajuanDana[];
}

export default function BuatProposal() {
    const { pengajuan, programKerjasDiajukan } = usePage<{
        pengajuan?: PengajuanKegiatan;
        programKerjasDiajukan: ProgramKerja[];
    }>().props;

    const isEdit = Boolean(pengajuan);

    const [form, setForm] = useState({
        program_kerja_id: "",
        nama_kegiatan: "",
        ketua_pelaksana: "",
        tempat_pelaksanaan: "",
        jumlah_peserta: 1,
        tanggal_pelaksanaan: "",
        deskripsi: "",
    });

    const [proposalFile, setProposalFile] = useState<File | null>(null);

    const [items, setItems] = useState<ItemPengajuanDana[]>([
        { nama_item: "", deskripsi_item: "", quantity: 1, harga_satuan: 0 },
    ]);

    useEffect(() => {
        if (pengajuan) {
            setForm({
                program_kerja_id: pengajuan.program_kerja_id?.toString() || "",
                nama_kegiatan: pengajuan.nama_kegiatan,
                ketua_pelaksana: pengajuan.ketua_pelaksana,
                tempat_pelaksanaan: pengajuan.tempat_pelaksanaan,
                jumlah_peserta: pengajuan.jumlah_peserta || 1,
                tanggal_pelaksanaan: pengajuan.tanggal_pelaksanaan,
                deskripsi: pengajuan.deskripsi || "",
            });
            setItems(pengajuan.item_pengajuan_dana.length > 0
                ? pengajuan.item_pengajuan_dana
                : [{ nama_item: "", deskripsi_item: "", quantity: 1, harga_satuan: 0 }]
            );
        }
    }, [pengajuan]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Handle numeric fields
        if (name === 'jumlah_peserta') {
            setForm({ ...form, [name]: parseInt(value) || 1 });
        } else {
            setForm({ ...form, [name]: value });
        }

        // Auto-fill nama kegiatan when program kerja is selected
        if (name === 'program_kerja_id') {
            const selectedProgram = programKerjasDiajukan.find(p => p.id.toString() === value);
            if (selectedProgram) {
                setForm(prev => ({ ...prev, nama_kegiatan: selectedProgram.kegiatan }));
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProposalFile(file);
        }
    };

    const addItem = () => {
        setItems([
            ...items,
            { nama_item: "", deskripsi_item: "", quantity: 1, harga_satuan: 0 },
        ]);
    };

    const removeItem = (index: number) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const updateItem = (index: number, field: keyof ItemPengajuanDana, value: string | number) => {
        setItems(items.map((item, i) => {
            if (i === index) {
                return { ...item, [field]: value };
            }
            return item;
        }));
    };

    const calculateTotal = () => {
        return items.reduce((total, item) => total + (item.quantity * item.harga_satuan), 0);
    };

    const validateForm = () => {
        if (!form.program_kerja_id || !form.ketua_pelaksana || !form.tempat_pelaksanaan || form.jumlah_peserta < 1 || !form.tanggal_pelaksanaan) {
            alert('Mohon lengkapi semua field yang wajib diisi');
            return false;
        }

        if (items.some(item => !item.nama_item || item.quantity <= 0 || item.harga_satuan <= 0)) {
            alert('Mohon lengkapi semua item pengajuan dana dengan benar');
            return false;
        }

        return true;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        const formDataToSend = new FormData();

        // Add form fields
        Object.entries(form).forEach(([key, value]) => {
            formDataToSend.append(key, value.toString());
        });

        // Add proposal file
        if (proposalFile) {
            formDataToSend.append('proposal', proposalFile);
        }

        // Add items as JSON
        formDataToSend.append('items', JSON.stringify(items));

        if (isEdit && pengajuan) {
            formDataToSend.append('_method', 'PUT');
            router.post(`/pengajuan-kegiatan/${pengajuan.id}`, formDataToSend as any, {
                onSuccess: () => {
                    router.visit('/pengajuan-kegiatan');
                }
            });
        } else {
            router.post('/pengajuan-kegiatan', formDataToSend as any, {
                onSuccess: () => {
                    router.visit('/pengajuan-kegiatan');
                }
            });
        }
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen p-10 bg-[#F5F6FA]">

                {/* TITLE */}
                <h1 className="text-2xl font-bold text-[#0B132B] mb-6">
                    Pengajuan Kegiatan
                </h1>

                {/* CARD */}
                <div className="bg-white shadow-xl rounded-xl overflow-hidden border">

                    {/* HEADER DARK */}
                    <div className="bg-[#0B132B] text-white px-6 py-3">
                        <h2 className="text-lg font-semibold">
                            {isEdit ? 'Edit Proposal Kegiatan' : 'Buat Proposal Kegiatan'}
                        </h2>
                    </div>

                    {/* INNER CONTENT */}
                    <div className="p-8">

                        <div className="grid grid-cols-2 gap-x-10 gap-y-6">

                            {/* Program Kerja Selection */}
                            <div className="col-span-2">
                                <p className="font-semibold text-sm mb-1">Pilih Program Kerja yang Sudah Diajukan*</p>
                                <select
                                    name="program_kerja_id"
                                    value={form.program_kerja_id}
                                    onChange={handleFormChange}
                                    className="w-full p-2 rounded-md border border-gray-300 bg-white"
                                    required
                                >
                                    <option value="">Pilih Program Kerja</option>
                                    {programKerjasDiajukan.map((program) => (
                                        <option key={program.id} value={program.id}>
                                            {program.kegiatan} - {formatCurrency(program.estimasi_anggaran)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Nama Kegiatan (Read Only) */}
                            <div>
                                <p className="font-semibold text-sm mb-1">Nama Kegiatan*</p>
                                <input
                                    type="text"
                                    name="nama_kegiatan"
                                    value={form.nama_kegiatan}
                                    onChange={handleFormChange}
                                    className="w-full p-2 rounded-md border border-gray-300 bg-gray-50"
                                    placeholder="Akan terisi otomatis setelah memilih program kerja"
                                    readOnly
                                />
                            </div>

                            {/* Ketua Pelaksana */}
                            <div>
                                <p className="font-semibold text-sm mb-1">Ketua Pelaksana*</p>
                                <input
                                    type="text"
                                    name="ketua_pelaksana"
                                    value={form.ketua_pelaksana}
                                    onChange={handleFormChange}
                                    className="w-full p-2 rounded-md border border-gray-300 bg-white"
                                    required
                                />
                            </div>

                            {/* Tempat Pelaksanaan */}
                            <div>
                                <p className="font-semibold text-sm mb-1">Tempat Pelaksanaan*</p>
                                <input
                                    type="text"
                                    name="tempat_pelaksanaan"
                                    value={form.tempat_pelaksanaan}
                                    onChange={handleFormChange}
                                    className="w-full p-2 rounded-md border border-gray-300 bg-white"
                                    required
                                />
                            </div>

                            {/* Jumlah Peserta */}
                            <div>
                                <p className="font-semibold text-sm mb-1">Jumlah Peserta*</p>
                                <input
                                    type="number"
                                    name="jumlah_peserta"
                                    value={form.jumlah_peserta}
                                    onChange={handleFormChange}
                                    className="w-full p-2 rounded-md border border-gray-300 bg-white"
                                    min="1"
                                    required
                                />
                            </div>

                            {/* Tanggal Pelaksanaan */}
                            <div>
                                <p className="font-semibold text-sm mb-1">Tanggal Pelaksanaan*</p>
                                <input
                                    type="date"
                                    name="tanggal_pelaksanaan"
                                    value={form.tanggal_pelaksanaan}
                                    onChange={handleFormChange}
                                    className="w-full p-2 rounded-md border border-gray-300 bg-white"
                                    required
                                />
                            </div>

                            {/* Proposal PDF Upload */}
                            <div className="col-span-2">
                                <p className="font-semibold text-sm mb-1">Proposal (PDF)</p>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                    className="w-full p-2 rounded-md border border-gray-300 bg-white"
                                />
                                {pengajuan?.proposal_path && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        File saat ini: {pengajuan.proposal_path.split('/').pop()}
                                    </p>
                                )}
                                {proposalFile && (
                                    <p className="text-sm text-green-600 mt-1">
                                        File baru: {proposalFile.name}
                                    </p>
                                )}
                            </div>

                            {/* Deskripsi Kegiatan */}
                            <div className="col-span-2">
                                <p className="font-semibold text-sm mb-1">Deskripsi Kegiatan</p>
                                <textarea
                                    name="deskripsi"
                                    value={form.deskripsi}
                                    onChange={handleFormChange}
                                    className="w-full p-2 rounded-md border border-gray-300 bg-white h-24"
                                    placeholder="Deskripsi singkat mengenai kegiatan..."
                                />
                            </div>
                        </div>

                        {/* Item Pengajuan Dana */}
                        <div className="mt-8">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-[#0B132B]">Pengajuan Dana*</h3>
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="flex items-center gap-1 text-sm font-medium bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                >
                                    <Plus size={16} /> Tambah Item
                                </button>
                            </div>

                            <div className="space-y-4">
                                {items.map((item, index) => (
                                    <div key={index} className="p-4 border border-gray-200 rounded-md bg-gray-50">
                                        <div className="grid grid-cols-2 gap-4 mb-3">
                                            <div>
                                                <p className="font-medium text-sm mb-1">Nama Item*</p>
                                                <input
                                                    type="text"
                                                    placeholder="Contoh: Spanduk"
                                                    value={item.nama_item}
                                                    onChange={(e) => updateItem(index, 'nama_item', e.target.value)}
                                                    className="w-full p-2 border border-gray-300 rounded-md"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm mb-1">Deskripsi Item</p>
                                                <input
                                                    type="text"
                                                    placeholder="Contoh: Spanduk promosi kegiatan"
                                                    value={item.deskripsi_item}
                                                    onChange={(e) => updateItem(index, 'deskripsi_item', e.target.value)}
                                                    className="w-full p-2 border border-gray-300 rounded-md"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-4 gap-4 items-end">
                                            <div>
                                                <p className="font-medium text-sm mb-1">Quantity*</p>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => updateItem(index, 'quantity', Number.parseInt(e.target.value) || 1)}
                                                    className="w-full p-2 border border-gray-300 rounded-md"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm mb-1">Harga Satuan (Rp)*</p>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={item.harga_satuan}
                                                    onChange={(e) => updateItem(index, 'harga_satuan', Number.parseFloat(e.target.value) || 0)}
                                                    className="w-full p-2 border border-gray-300 rounded-md"
                                                    placeholder="0"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm mb-1">Total</p>
                                                <p className="p-2 bg-gray-200 rounded-md font-semibold">
                                                    {formatCurrency(item.quantity * item.harga_satuan)}
                                                </p>
                                            </div>
                                            <div>
                                                {items.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(index)}
                                                        className="w-full p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                                    >
                                                        Hapus
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                                <p className="text-lg font-bold text-blue-800">
                                    Total Keseluruhan: {formatCurrency(calculateTotal())}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BUTTONS */}
                <div className="flex justify-end gap-6 mt-10 mr-10">
                    <button
                        type="button"
                        onClick={() => router.visit('/pengajuan-kegiatan')}
                        className="px-10 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600"
                    >
                        Batal
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="px-10 py-2 rounded-md bg-[#0B132B] text-white hover:bg-[#1C2541]"
                    >
                        {isEdit ? 'Simpan Perubahan' : 'Simpan Proposal'}
                    </button>
                </div>

                <p className="text-center text-gray-500 text-sm mt-16">
                    ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
                </p>
            </div>
        </DashboardLayout>
    );
}
