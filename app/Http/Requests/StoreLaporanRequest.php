<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLaporanRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'pengajuan_kegiatan_id' => 'required|exists:pengajuan_kegiatans,id',
            'anggaran_disetujui'    => 'nullable|numeric|min:0',
            'anggaran_realisasi'    => 'nullable|numeric|min:0',
            'ringkasan'             => 'nullable|string',
            'status'                => 'nullable|in:Belum Diajukan,Diajukan,Direview,Disetujui,Direvisi,Ditolak',
            'lpj'                   => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:20480',
            'bukti_pengeluaran.*'   => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:20480',
            'dokumentasi.*'         => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:20480',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'pengajuan_kegiatan_id.required' => 'Pengajuan kegiatan harus dipilih.',
            'pengajuan_kegiatan_id.exists' => 'Pengajuan kegiatan tidak valid.',
            'anggaran_disetujui.numeric' => 'Anggaran disetujui harus berupa angka.',
            'anggaran_realisasi.numeric' => 'Anggaran realisasi harus berupa angka.',
            'lpj.mimes' => 'File LPJ harus berformat PDF, JPG, JPEG, atau PNG.',
            'lpj.max' => 'File LPJ maksimal 20MB.',
            'bukti_pengeluaran.*.mimes' => 'File bukti pengeluaran harus berformat PDF, JPG, JPEG, atau PNG.',
            'bukti_pengeluaran.*.max' => 'File bukti pengeluaran maksimal 20MB per file.',
            'dokumentasi.*.mimes' => 'File dokumentasi harus berformat PDF, JPG, JPEG, atau PNG.',
            'dokumentasi.*.max' => 'File dokumentasi maksimal 20MB per file.',
        ];
    }
}
