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
docker compose -f compose.prod.yaml up -d --build
```

**Akses Aplikasi:**

- **Unified Access (Via Caddy Proxy)**: [http://localhost:3070](http://localhost:3070)
  - **Frontend/Dashboard**: `http://localhost:3070/`
  - **Backend API Base URL**: `http://localhost:3070/api/v1`
    - _Contoh_: `http://localhost:3070/api/v1/health`
    - _Contoh_: `http://localhost:3070/api/v1/auth/login`
  - **Swagger Docs**: `http://localhost:3070/api-docs`

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

---

## 🔧 Troubleshooting Production

### Swagger 404 (Not Found)

Jika akses `/api-docs` mengembalikan 404:

1.  **Cek Caddyfile**: Pastikan konfigurasi Caddyfile di server sudah memuat rule `/api-docs*`.
2.  **Restart Caddy**: Jalankan ulang container Caddy untuk memuat konfigurasi baru.
    ```bash
    docker compose -f compose.prod.yaml up -d --build --force-recreate caddy
    ```

### CSP / Network Error

Jika mengalami error "Refused to connect" atau masalah loading script di Swagger/Frontend:

1.  **Update App**: Pastikan kode terbaru (`src/app.js` dan `src/config/swagger.js`) sudah di-pull.
2.  **Restart App**: Rebuild container aplikasi.
    ```bash
    docker compose -f compose.prod.yaml up -d --build app
    ```
