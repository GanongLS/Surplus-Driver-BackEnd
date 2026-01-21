# Backend Task Plan — Surplus Driver App

Dokumen ini berisi **rencana langkah (task plan)** untuk membangun Backend (BE) aplikasi **Driver App Surplus**. Backend difokuskan untuk **internal driver**, bukan aplikasi customer.

---

## 1. Tujuan Backend

Backend bertugas untuk:
- Autentikasi driver
- Manajemen order
- Distribusi order ke driver
- Update status order secara real-time
- Menyediakan data riwayat order

Backend **tidak** menangani pembayaran dan aplikasi customer.

---

## 2. Asumsi & Batasan

- Driver **sudah terdaftar** di sistem
- Order dibuat dari sistem internal/admin (bukan dari app driver)
- Backend bersifat **internal service**
- Skala awal kecil (±40 driver)

---

## 3. Tech Stack (Usulan)

### Minimal
- Runtime: Node.js
- Framework: Express 
- Database: PostgreSQL 
- Auth: JWT

### Alternatif (Nilai Plus)
- Firebase Auth + Firestore
- Realtime: WebSocket / Firebase Realtime DB

---

## 4. Entity & Data Model

### 4.1 Driver
- id
- name
- phone
- email
- password_hash / pin_hash
- is_active
- created_at

### 4.2 Order
- id
- customer_name
- customer_address
- latitude (optional)
- longitude (optional)
- juice_type
- quantity
- status (MENUNGGU | DITERIMA | DALAM_PERJALANAN | SELESAI)
- assigned_driver_id (nullable)
- created_at
- updated_at

### 4.3 Order Status Log (opsional)
- id
- order_id
- status
- changed_by (driver_id)
- timestamp

---

## 5. API Endpoint Plan

### 5.1 Authentication

**POST /auth/login**
- Input: phone + pin / email + password
- Output: access_token (JWT), driver_profile

---

### 5.2 Driver Profile

**GET /drivers/me**
- Header: Authorization: Bearer token
- Output: driver info

---

### 5.3 Orders

**GET /orders**
- Description: Ambil daftar order tersedia untuk driver
- Filter:
  - status = MENUNGGU
  - atau assigned_driver_id = current driver

**GET /orders/:id**
- Description: Detail order

**POST /orders/:id/accept**
- Action: Driver menerima order
- Effect:
  - status → DITERIMA
  - assigned_driver_id → driver

**POST /orders/:id/status**
- Body: status
- Allowed flow:
  - DITERIMA → DALAM_PERJALANAN → SELESAI

---

### 5.4 Order History

**GET /orders/history**
- Filter:
  - assigned_driver_id = current driver
  - status = SELESAI

---

## 6. Business Rules

- Order hanya bisa diterima **satu driver**
- Driver hanya boleh update order yang:
  - assigned ke dirinya
- Status order **harus berurutan**
- Order selesai tidak bisa diubah kembali

---

## 7. Realtime Update (Opsional tapi Disarankan)

### Opsi A — WebSocket
- Broadcast perubahan status order
- Driver lain langsung update list

### Opsi B — Firebase
- Firestore listener di collection orders
- Realtime tanpa setup server socket

---

## 8. Security & Validation

- JWT validation di setiap endpoint
- Role check (driver only)
- Input validation (status enum, order ownership)
- Rate limiting login

---

## 9. Deployment Plan

### Tahap Awal
- Single backend service
- Dockerized
- Deploy ke VPS / Cloud Run

### Scaling (Future)
- Redis untuk session / cache
- Message queue untuk order assignment

---

## 10. Development Phases

### Phase 1 — MVP
- Auth login
- Get orders
- Update status

### Phase 2 — Stabilization
- Validation & error handling
- Logging
- History endpoint

### Phase 3 — Enhancement
- Realtime
- Monitoring
- Admin dashboard integration

---

## 11. Catatan untuk Reviewer

Backend dirancang **API-first** dan **scalable**, dengan asumsi integrasi ke aplikasi driver React Native dan potensi ekspansi ke sistem admin.

---

## 12. Semua dibangun menggunakan Docker Container

Seluruh aplikasi dibangun menggunakan Docker Container, termasuk database PostgreSQL. sehingga tidak lagi ada keperluan mengubah konfigurasi database secara manual, serta engine spec env di local.

---

## 13. Setelah selesai buatkan Swagger API Documentation

buatkan dokumentasi API menggunakan Swagger

---

## 14. Buatkan setting docker compose untuk produksi

buat docker-compose.prod.yaml untuk produksi dengan setting port dan environment variable sesuai dengan produksi sebagai berikut:

port aplikasi menjadi berjalan di localhost:3070
port posgrestsql menjadi berjalan di localhost:5433
---

## 14. Buatkan Front End dalam folder baru ./front-end

buatkan front end web service untuk admin menggunakan ReactJS. jalankan dalam docker compose yang sama. 
---

**End of task.md**