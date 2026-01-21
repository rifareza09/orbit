import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { X, ZoomIn, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

interface DokumentasiItem {
  id: number | string;
  nama_kegiatan: string;
  tanggal_kegiatan: string;
  foto_url: string | null;
  source?: string;
}

export default function DokumentasiKegiatan() {
  const { dokumentasi } = usePage<{
    dokumentasi: DokumentasiItem[];
  }>().props;

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter hanya dokumentasi yang punya foto
  const dokumentasiWithPhoto = dokumentasi.filter(item => item.foto_url);

  const openImageModal = (item: DokumentasiItem) => {
    const index = dokumentasiWithPhoto.findIndex(d => d.id === item.id);
    if (index !== -1) {
      setSelectedImageIndex(index);
    }
  };

  const closeImageModal = () => {
    setSelectedImageIndex(null);
  };

  const showPrevImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const showNextImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex < dokumentasiWithPhoto.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const handleDelete = (id: number | string) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (deleteConfirm && typeof deleteConfirm === 'number') {
      setIsDeleting(true);
      router.delete(`/dokumentasi/${deleteConfirm}`, {
        onFinish: () => {
          setIsDeleting(false);
          setDeleteConfirm(null);
        },
      });
    }
  };

  const selectedImage = selectedImageIndex !== null ? dokumentasiWithPhoto[selectedImageIndex] : null;

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[#0B132B]">
            Dokumentasi Kegiatan
          </h1>
          <button
            onClick={() => router.visit('/dokumentasi/buat')}
            className="bg-[#0B132B] text-white px-5 py-2 rounded-lg hover:bg-[#1C2541] transition"
          >
            Buat Dokumentasi
          </button>
        </div>

        {/* Grid Card Dokumentasi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dokumentasi.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden hover:shadow-md transition"
            >
              <div
                className="w-full h-40 bg-gray-200 relative overflow-hidden cursor-pointer group"
                onClick={() => item.foto_url && openImageModal(item)}
              >
                {item.foto_url ? (
                  <>
                    <img
                      src={item.foto_url}
                      alt={item.nama_kegiatan}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {/* Overlay saat hover */}
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300 flex items-center justify-center">
                      <ZoomIn className="text-white" size={32} />
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-3 text-center">
                <p className="font-medium text-[#0B132B]">{item.nama_kegiatan}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(item.tanggal_kegiatan).toLocaleDateString('id-ID')}
                </p>
                {/* Tombol hapus hanya untuk dokumentasi manual */}
                {item.source === 'manual' && typeof item.id === 'number' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                    className="mt-2 text-red-500 hover:text-red-700 transition text-xs flex items-center justify-center gap-1 mx-auto"
                  >
                    <Trash2 size={14} />
                    Hapus
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-6">
          ©ORBIT 2025 | Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI
        </div>
      </div>

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeImageModal}
        >
          {/* Close Button */}
          <button
            onClick={closeImageModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition z-10 bg-black/30 rounded-full p-2"
            aria-label="Close"
          >
            <X size={28} />
          </button>

          {/* Previous Button */}
          {selectedImageIndex !== null && selectedImageIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                showPrevImage();
              }}
              className="absolute left-4 text-white hover:text-gray-300 transition z-10 bg-black/30 rounded-full p-3"
              aria-label="Previous"
            >
              <ChevronLeft size={32} />
            </button>
          )}

          {/* Next Button */}
          {selectedImageIndex !== null && selectedImageIndex < dokumentasiWithPhoto.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                showNextImage();
              }}
              className="absolute right-4 text-white hover:text-gray-300 transition z-10 bg-black/30 rounded-full p-3"
              aria-label="Next"
            >
              <ChevronRight size={32} />
            </button>
          )}

          <div
            className="max-w-5xl max-h-[90vh] w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.foto_url || ''}
              alt={selectedImage.nama_kegiatan}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
            <div className="mt-4 text-center bg-black/40 backdrop-blur-md px-6 py-3 rounded-lg">
              <h3 className="text-white text-lg font-semibold">{selectedImage.nama_kegiatan}</h3>
              <p className="text-gray-300 text-sm mt-1">
                {new Date(selectedImage.tanggal_kegiatan).toLocaleDateString('id-ID')}
              </p>
              {dokumentasiWithPhoto.length > 1 && (
                <p className="text-gray-400 text-xs mt-2">
                  {selectedImageIndex !== null && `${selectedImageIndex + 1} / ${dokumentasiWithPhoto.length}`}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-[#0B132B] mb-3">Konfirmasi Hapus</h3>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus dokumentasi ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
