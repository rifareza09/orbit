import React, { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { router, usePage } from "@inertiajs/react";
import { Plus } from "lucide-react";

interface ItemPengajuanDana {
  id?: number;
  nama_item: string;
  deskripsi_item: string;
  quantity: number;
  harga_satuan: number;
}

interface PengajuanKegiatan {
  id: number;
  nama_kegiatan: string;
  ketua_pelaksana: string;
  tempat_pelaksanaan: string;
  tanggal_pelaksanaan: string;
  deskripsi: string;
  item_pengajuan_dana: ItemPengajuanDana[];
}

export default function BuatProposal() {
    const { pengajuan } = usePage<{ pengajuan?: PengajuanKegiatan }>().props;
    const isEdit = Boolean(pengajuan);

    const [form, setForm] = useState({
        nama_kegiatan: "",
        ketua_pelaksana: "",
        tempat_pelaksanaan: "",
        tanggal_pelaksanaan: "",
        deskripsi: "",
    });

    const [items, setItems] = useState<ItemPengajuanDana[]>([
        { nama_item: "", deskripsi_item: "", quantity: 1, harga_satuan: 0 },
    ]);

    useEffect(() => {
        if (pengajuan) {
            setForm({
                nama_kegiatan: pengajuan.nama_kegiatan,
                ketua_pelaksana: pengajuan.ketua_pelaksana,
                tempat_pelaksanaan: pengajuan.tempat_pelaksanaan,
                tanggal_pelaksanaan: pengajuan.tanggal_pelaksanaan,
                deskripsi: pengajuan.deskripsi || "",
            });
            setItems(pengajuan.item_pengajuan_dana.length > 0
                ? pengajuan.item_pengajuan_dana
                : [{ nama_item: "", deskripsi_item: "", quantity: 1, harga_satuan: 0 }]
            );
        }
    }, [pengajuan]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
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
        setItems(items.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        ));
    };

    const calculateTotal = () => {
        return items.reduce((total, item) => total + (item.quantity * item.harga_satuan), 0);
    };

    const validateForm = () => {
        if (!form.nama_kegiatan || !form.ketua_pelaksana || !form.tempat_pelaksanaan || !form.tanggal_pelaksanaan) {
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

        const data = {
            ...form,
            items: items as any // Type assertion for complex nested objects
        };

        if (isEdit && pengajuan) {
            router.put(`/pengajuan-kegiatan/${pengajuan.id}`, data, {
                onSuccess: () => {
                    router.visit('/pengajuan-kegiatan');
                }
            });
        } else {
            router.post('/pengajuan-kegiatan', data, {
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
                        <h2 className="text-lg font-semibold">Buat Proposal Kegiatan</h2>
                    </div>

                    {/* INNER CONTENT */}
                    <div className="p-8">

                        <div className="grid grid-cols-2 gap-x-10 gap-y-6">

                            {/* Nama Kegiatan */}
                            <div>
                                <p className="font-semibold text-sm mb-1">Nama Kegiatan*</p>
                                <input
                                    type="text"
                                    name="nama_kegiatan"
                                    value={form.nama_kegiatan}
                                    onChange={handleFormChange}
                                    className="w-full p-2 rounded-md border border-gray-300 bg-white"
                                    required
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
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm mb-1">Total</p>
                                                <p className="p-2 bg-gray-200 rounded-md font-semibold">
                                                    Rp {(item.quantity * item.harga_satuan).toLocaleString('id-ID')}
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
                                    Total Keseluruhan: Rp {calculateTotal().toLocaleString('id-ID')}
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
