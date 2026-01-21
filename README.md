# Surplus Backend & Admin Dashboard

Solusi backend lengkap untuk **Surplus Driver App** dan **Admin Dashboard API**. Proyek ini menggunakan arsitektur _containerized_ dengan Docker untuk konsistensi lingkungan development dan production.

## 🛠️ Tech Stack

- **Backend**: Node.js (Express), PostgreSQL
- **Frontend**: React (Vite), Glassmorphism UI
- **Infrastructure**: Docker, Docker Compose, Nginx (Production)

---

## 🚀 Panduan Cepat (Quick Start)

Prasyarat: Pastikan **Docker** dan **Docker Compose** sudah terinstall.

### 1. Lingkungan Development

Gunakan mode ini untuk pengembangan. Fitur _hot-reload_ aktif untuk Backend dan Frontend.

```bash
# 1. Buat file .env dari contoh
cp .env.example .env

# 2. Jalankan Container (Backend + Frontend + DB)
docker compose up -d --build
```

**Akses Aplikasi:**

- **Frontend Dashboard**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3070](http://localhost:3070)
- **API Docs (Swagger)**: [http://localhost:3070/api-docs](http://localhost:3070/api-docs)
- **Database**: Port 5433

### 2. Lingkungan Production

Gunakan mode ini untuk deployment. Frontend akan di-build statis dan disajikan via Nginx.

```bash
# 1. Jalankan dengan konfigurasi production
docker compose -f docker-compose.prod.yml up -d --build
```

**Akses Aplikasi:**

- **Frontend Dashboard**: [http://localhost:8070](http://localhost:8070) (atau port 80 jika di server)
- **Backend API**: [http://localhost:3070](http://localhost:3070)

---

## 📦 Konfigurasi & Migrasi

### Setup Database Otomatis

Saat pertama kali dijalankan, sistem akan otomatis:

1. Membuat tabel `drivers`, `orders`, `admins`, dan `products`.
2. Melakukan _seeding_ data awal (akun admin, driver test, daftar produk jus).

Jika Anda perlu mereset atau mengisi ulang data secara manual:

```bash
# Masuk ke container backend
docker compose exec app sh

# Jalankan script seeding (opsional)
node src/utils/seedAdmin.js       # Reset Admin
node src/utils/createProductsTable.js # Reset Products
```

### Environment Variables (.env)

Pastikan file `.env` memiliki konfigurasi berikut (sesuaikan jika perlu):

```env
PORT=3070
DB_USER=surplus_user
DB_HOST=db
DB_NAME=surplus_db
DB_PASSWORD=surplus_password
DB_PORT=5433
JWT_SECRET=rahasia_negara_surplus_2024
```

---

## 🧪 Akun Demo

Gunakan kredensial ini untuk masuk ke dashboard atau aplikasi driver:

| Role       | Username / Email   | Password      |
| ---------- | ------------------ | ------------- |
| **Admin**  | `admin`            | `password123` |
| **Driver** | `budi@example.com` | `password123` |

---

## 🔮 Fitur Utama

### Dashboard Admin

- **Monitoring Order**: Filter order Aktif vs Selesai otomatis.
- **Product Management**: Tambah/Hapus jenis jus, atur ketersediaan stok (Available/Unavailable).
- **Order Processing**: Terima order -> Kirim -> Selesaikan.
- **Order History**: Arsip order yang sudah selesai.

### Driver API

- Autentikasi JWT Aman.
- Update status order realtime.
