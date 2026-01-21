# Surplus Backend Service

Backend service ini dibangun untuk memfasilitasi operasional **Surplus Driver App** (aplikasi internal untuk pengemudi) serta menyediakan layanan data untuk **Admin Dashboard** (Web Service). Aplikasi ini dibangun dengan prinsip *API-first* dan dijalankan sepenuhnya menggunakan containerisasi Docker.

## 🚀 Fitur Utama

Backend ini telah mengimplementasikan modul-modul berikut:

### 1. Driver Module (Mobile App Support)
- **Autentikasi**: Login aman menggunakan JWT untuk driver.
- **Manajemen Order**: 
  - Melihat daftar order yang tersedia (Status: MENUNGGU).
  - Melihat order aktif driver.
  - Menerima order (Accept Order).
  - Update status order (`DITERIMA` -> `DALAM_PERJALANAN` -> `SELESAI`).
- **History**: Melihat riwayat order yang telah diselesaikan.

### 2. Admin Module (Web Dashboard Support)
- **Autentikasi Admin**: Endpoint login khusus admin dengan proteksi middleware terpisah.
- **Manajemen Driver**: 
  - Admin dapat mendaftarkan driver baru.
  - Melihat daftar seluruh driver.
  - Menonaktifkan/Mengaktifkan status driver.
- **Manajemen Order**:
  - Admin dapat membuat order baru (simulasi incoming order).
  - Melihat seluruh daftar order yang masuk.

### 3. API Documentation
- Terintegrasi dengan **Swagger UI** untuk dokumentasi API yang interaktif dan mudah diuji.

---

## 🛠️ Cara Menjalankan Aplikasi

Prasyarat: Pastikan **Docker** dan **Docker Compose** sudah terinstall di komputer Anda.

1. **Jalankan Service**
   Gunakan perintah berikut untuk membangun dan menjalankan seluruh service (Node.js App + PostgreSQL Database):
   ```bash
   docker compose up --build
   ```
   *Tunggu hingga server berjalan di port 3000.*

2. **Setup Database Awal (Migrasi & Seeding)**
   Jalankan perintah berikut pada terminal terpisah (pastikan container sedang berjalan) untuk menyiapkan tabel admin dan user test:

   ```bash
   # Update password user test (Driver)
   docker compose exec app node update_password.js
   
   # Setup tabel Admin & akun Admin default
   docker compose exec app node migrate_admin.js
   ```

3. **Akses Dokumentasi API**
   Buka browser dan kunjungi:
   👉 **http://localhost:3000/api-docs**

   Anda bisa mencoba seluruh endpoint langsung dari halaman Swagger ini.

---

## 🧪 Akun Demo

Untuk pengujian, gunakan kredensial berikut:

- **Driver**:
  - Email/Phone: `budi@example.com` / `081234567890`
  - Password: `password123`

- **Admin**:
  - Username: `admin`
  - Password: `adminpassword123`

---

## 🔮 Langkah Berikutnya (Upgrades)

Untuk pengembangan selanjutnya agar sistem ini siap production (Production Ready), beberapa hal berikut perlu ditingkatkan:

1.  **Realtime Updates**: Mengimplementasikan **WebSocket (Socket.io)** atau **Firebase** agar Driver tidak perlu refresh manual untuk melihat order baru, dan Admin bisa memantau posisi driver secara live.
2.  **Validasi Lanjutan**: Menambahkan library validasi data yang lebih ketat (seperti Joi atau Zod) untuk setiap input request.
3.  **Unit & Integration Testing**: Menambahkan framework testing (Jest/Supertest) untuk menjamin stabilitas kode sebelum deploy.
4.  **Error Handling**: Memperbaiki format respons error agar lebih standar dan informatif dan sentralisasi logging.
5.  **Security Hardening**: Rate limiting, Helmet config adjustments, dan environment variable validation.
