<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLaporanRequest extends FormRequest
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
            'anggaran_realisasi'    => 'nullable|numeric|min:0',
            'ringkasan'             => 'nullable|string',
            'catatan'               => 'nullable|string',
            'lpj'                   => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'bukti_pengeluaran.*'   => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'dokumentasi.*'         => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'remove_bukti.*'        => 'string',
            'remove_dokumentasi.*'  => 'string',
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
            'lpj.max' => 'File LPJ maksimal 5MB.',
            'bukti_pengeluaran.*.mimes' => 'File bukti pengeluaran harus berformat PDF, JPG, JPEG, atau PNG.',
            'bukti_pengeluaran.*.max' => 'File bukti pengeluaran maksimal 5MB.',
            'dokumentasi.*.mimes' => 'File dokumentasi harus berformat PDF, JPG, JPEG, atau PNG.',
            'dokumentasi.*.max' => 'File dokumentasi maksimal 5MB.',
        ];
    }
}
