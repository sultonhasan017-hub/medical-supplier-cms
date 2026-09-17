export function generateWhatsAppLink(
  phoneNumber: string,
  params: {
    nama: string;
    instansi: string;
    kebutuhan: string;
    kuantitas: string;
    catatan: string;
  }
): string {
  const text = `Halo Tim Sales PT Samudera Inti Medisindo,
Saya bermaksud menanyakan pengadaan alat kesehatan dengan rincian berikut:

*Nama:* ${params.nama}
*Instansi/RS:* ${params.instansi}
*Kebutuhan Alat:* ${params.kebutuhan}
*Estimasi Kuantitas:* ${params.kuantitas || '-'}
*Catatan Tambahan:* ${params.catatan || '-'}

Mohon informasi harga dan ketersediaan. Terima kasih.`;

  const encodedText = encodeURIComponent(text);
  // Remove leading + or 0, ensure it starts with country code, assuming 62
  const cleanedPhone = phoneNumber.replace(/[^0-9]/g, '');
  
  return `https://wa.me/${cleanedPhone}?text=${encodedText}`;
}
