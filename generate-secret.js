const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Generate 64 byte random string (128 karakter hex)
const newSecret = crypto.randomBytes(64).toString('hex');

console.log('✨ JWT_SECRET baru berhasil di-generate:');
console.log('\n' + newSecret + '\n');

// Opsi: Otomatis perbarui file .env
const envPath = path.join(__dirname, '.env');

if (fs.existsSync(envPath)) {
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Cek apakah JWT_SECRET sudah ada di .env
  if (envContent.includes('JWT_SECRET=')) {
    // Replace JWT_SECRET yang sudah ada
    envContent = envContent.replace(
      /JWT_SECRET=.*/g, 
      `JWT_SECRET="${newSecret}"`
    );
    console.log('✅ File .env berhasil diperbarui secara otomatis!');
  } else {
    // Append jika belum ada
    envContent += `\n# Rahasia JWT untuk otentikasi Admin\nJWT_SECRET="${newSecret}"\n`;
    console.log('✅ JWT_SECRET ditambahkan ke file .env!');
  }
  
  fs.writeFileSync(envPath, envContent);
} else {
  console.log('⚠️ File .env tidak ditemukan, silakan copy-paste secret di atas secara manual.');
}
