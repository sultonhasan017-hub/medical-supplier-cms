const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Memulai proses seeding database...');

  // 1. Bersihkan tabel lama untuk mencegah duplikasi jika di-seed ulang
  await prisma.blog.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.brand.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('🗑️  Tabel lama berhasil dibersihkan.');

  // 2. Buat Akun Admin
  const hashedPassword = await bcrypt.hash('AdminPTSIM123!', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@ptsim.id',
      password: hashedPassword,
      name: 'Administrator',
    },
  });
  console.log('✅ Akun Admin berhasil dibuat (admin@ptsim.id).');

  // 3. Buat Brand
  const brandsData = [
    { name: 'Allchek', description: 'Rapid Test & Diagnostics' },
    { name: 'RealyTech', description: 'Clinical Lab Equipment' },
    { name: 'Yasee', description: 'Medical Monitoring Devices' },
    { name: 'Ultracare', description: 'Healthcare Disposables' },
  ];

  const createdBrands = [];
  for (const b of brandsData) {
    const brand = await prisma.brand.create({ data: b });
    createdBrands.push(brand);
  }
  console.log(`✅ ${createdBrands.length} Brand berhasil dibuat.`);

  // 4. Buat Produk Sampel — menggunakan gambar yang ada di /public/uploads/
  // File yang tersedia: Allchek.jpg, RealyTech.jpg, Ultracare.jpg, Yasee.png
  const productsData = [
    {
      slug: 'allchek-rapid-test',
      name: 'Allchek Rapid Test Kit',
      description_id: 'Kit uji cepat untuk berbagai penyakit infeksius. Hasil akurat dalam 15 menit. Digunakan oleh lebih dari 200 rumah sakit dan klinik di seluruh Indonesia.',
      description_en: 'Rapid test kit for various infectious diseases. Accurate results in 15 minutes. Used by over 200 hospitals and clinics throughout Indonesia.',
      specs_id: 'Sensitivitas 99%, Spesifisitas 98%. Tidak memerlukan alat bantu. Simpan pada suhu 2-30°C.',
      specs_en: 'Sensitivity 99%, Specificity 98%. No instruments required. Store at 2-30°C.',
      imageUrl: '/uploads/Allchek.jpg',
      imageAlt: 'Allchek Rapid Test Kit - Kit uji cepat diagnosis infeksius',
      brandId: createdBrands.find(b => b.name === 'Allchek').id,
    },
    {
      slug: 'realytech-blood-analyzer',
      name: 'RealyTech Blood Analyzer Pro',
      description_id: 'Alat penganalisis darah hematologi otomatis untuk laboratorium klinik. Memberikan hasil CBC lengkap dalam waktu singkat dengan akurasi tinggi.',
      description_en: 'Automated hematology blood analyzer for clinical laboratories. Delivers complete CBC results quickly with high accuracy.',
      specs_id: 'Kapasitas 60 sampel per jam. Layar sentuh 7 inci. Parameter: 22 parameter hematologi. Memori: 100.000 hasil.',
      specs_en: 'Capacity 60 samples per hour. 7-inch touchscreen. Parameters: 22 hematology parameters. Memory: 100,000 results.',
      imageUrl: '/uploads/RealyTech.jpg',
      imageAlt: 'RealyTech Blood Analyzer Pro - Penganalisis darah hematologi otomatis',
      brandId: createdBrands.find(b => b.name === 'RealyTech').id,
    },
    {
      slug: 'yasee-patient-monitor',
      name: 'Yasee Advanced Patient Monitor',
      description_id: 'Monitor pasien dengan layar 12 inci untuk pemantauan tanda vital waktu nyata. Ideal untuk ICU, IGD, dan ruang operasi.',
      description_en: '12-inch patient monitor for real-time vital signs monitoring. Ideal for ICU, ER, and operating rooms.',
      specs_id: 'ECG, SpO2, NIBP, TEMP, RR. Layar 12" TFT. Baterai tahan 4 jam. Alarm multi-parameter.',
      specs_en: 'ECG, SpO2, NIBP, TEMP, RR. 12" TFT display. 4-hour battery backup. Multi-parameter alarms.',
      imageUrl: '/uploads/Yasee.png',
      imageAlt: 'Yasee Advanced Patient Monitor - Monitor pasien tanda vital 12 inci',
      brandId: createdBrands.find(b => b.name === 'Yasee').id,
    },
    {
      slug: 'ultracare-surgical-mask',
      name: 'Ultracare 3-Ply Surgical Mask',
      description_id: 'Masker bedah 3 lapis standar medis berstandar SNI. Memberikan perlindungan maksimal terhadap partikel dan percikan cairan.',
      description_en: 'Medical grade 3-ply surgical mask with SNI standards. Provides maximum protection against particles and fluid splashes.',
      specs_id: 'BFE > 99%. PFE > 99%. Isi 50 pcs per box. Tali elastis telinga. Lulus uji ASTM F2100.',
      specs_en: 'BFE > 99%. PFE > 99%. 50 pcs per box. Elastic ear loops. ASTM F2100 tested.',
      imageUrl: '/uploads/Ultracare.jpg',
      imageAlt: 'Ultracare 3-Ply Surgical Mask - Masker bedah standar medis SNI',
      brandId: createdBrands.find(b => b.name === 'Ultracare').id,
    }
  ];

  for (const p of productsData) {
    await prisma.product.create({ data: p });
  }
  console.log(`✅ ${productsData.length} Produk berhasil dibuat dengan gambar dari /uploads/.`);

  // 5. Buat Artikel Blog Sampel dengan Gambar & Galeri
  await prisma.blog.create({
    data: {
      slug: 'pentingnya-kalibrasi-alat-medis',
      title_id: 'Pentingnya Kalibrasi Alat Medis Secara Berkala',
      title_en: 'The Importance of Regular Medical Equipment Calibration',
      content_id: 'Kalibrasi sangat penting untuk menjaga akurasi hasil diagnosis. Peralatan medis yang tidak dikalibrasi dapat memberikan hasil palsu yang membahayakan pasien. Di PT Samudera Inti Medisindo, setiap alat yang kami distribusikan telah melalui proses verifikasi kalibrasi yang ketat sesuai standar internasional.',
      content_en: 'Calibration is essential to maintain diagnostic accuracy. Uncalibrated medical equipment can yield false results that endanger patients. At PT Samudera Inti Medisindo, every instrument we distribute has undergone rigorous calibration verification in accordance with international standards.',
      metaDesc_id: 'Panduan mengapa kalibrasi alat laboratorium dan medis sangat krusial bagi keselamatan pasien dan akurasi diagnosis.',
      metaDesc_en: 'Guide on why medical and laboratory equipment calibration is crucial for patient safety and diagnostic accuracy.',
      thumbnailUrl: '/hero-image.jpg',
      thumbnailAlt: 'Kalibrasi dan pemeliharaan alat kesehatan medis',
      additionalImages: [
        '/uploads/RealyTech.jpg',
        '/uploads/Yasee.png'
      ],
      authorId: adminUser.id,
      isPublished: true,
    }
  });
  console.log('✅ 1 Artikel Blog berhasil dibuat dengan gambar cover dan galeri.');

  console.log('🎉 Proses seeding database SELESAI!');
  console.log('');
  console.log('📋 Ringkasan:');
  console.log('   🔐 Admin Login : admin@ptsim.id / AdminPTSIM123!');
  console.log('   🏷️  Brand       : Allchek, RealyTech, Yasee, Ultracare');
  console.log('   📦 Produk      : 4 produk dengan gambar dari /uploads/');
  console.log('   📝 Blog        : 1 artikel');
}

main()
  .catch((e) => {
    console.error('❌ Terjadi kesalahan saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
