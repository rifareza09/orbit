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
            'lpj'                   => 'nullable|file|mimes:pdf|max:102400', // max 100MB
            'bukti_pengeluaran'     => 'nullable|array',
            'bukti_pengeluaran.*'   => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:102400', // max 100MB per file
            'dokumentasi'           => 'nullable|array',
            'dokumentasi.*'         => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:102400', // max 100MB per file
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
            'lpj.mimes' => 'File LPJ harus berformat PDF.',
            'lpj.max' => 'File LPJ maksimal 100MB.',
            'bukti_pengeluaran.*.mimes' => 'File bukti pengeluaran harus berformat PDF, JPG, JPEG, atau PNG.',
            'bukti_pengeluaran.*.max' => 'File bukti pengeluaran maksimal 100MB per file.',
            'dokumentasi.*.mimes' => 'File dokumentasi harus berformat PDF, JPG, JPEG, atau PNG.',
            'dokumentasi.*.max' => 'File dokumentasi maksimal 100MB per file.',
        ];
    }
}
