# Cara pasang file ini ke apps/api

## 1. Init NestJS project dulu (kalau belum)

```powershell
npm i -g @nestjs/cli
cd E:\work\rinjani\apps\api
nest new . --skip-git --package-manager npm
```

## 2. Install dependency tambahan

```powershell
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt @nestjs/mapped-types class-validator class-transformer @prisma/client
npm install -D prisma @types/passport-jwt @types/bcrypt
```

## 3. Salin semua file dari folder `src/` ini ke `apps/api/src/` (timpa yang bawaan `nest new`, kecuali `app.controller.ts` dan `app.service.ts` bawaan — boleh dihapus, tidak dipakai)

Struktur akhir yang benar:
```
apps/api/src/
├── auth/
├── radio-stations/
├── videos/
├── schedule/
├── prisma/
├── app.module.ts
└── main.ts
```

## 4. Setup Prisma

```powershell
npx prisma init
```

Ganti isi `prisma/schema.prisma` yang ter-generate dengan `src/prisma/schema.prisma` dari sini
(atau pindahkan file `src/prisma/schema.prisma` ke root `prisma/schema.prisma` — Prisma defaultnya
cari di situ, bukan di dalam `src/`).

## 5. Setup `.env`

Copy `.env.example` (dari root project `rinjani/.env.example` yang sudah ada, atau dari file
`.env.example` di sini) jadi `.env`, isi `DATABASE_URL` dan `JWT_SECRET`.

Untuk `YOUTUBE_API_KEY`: buka Google Cloud Console → API & Services → aktifkan
"YouTube Data API v3" → buat API key. Gratis, ada kuota harian.

## 6. Jalankan migrasi database

Pastikan Postgres sudah jalan (lihat `docker-compose.yml` di root project), lalu:

```powershell
npx prisma migrate dev --name init
```

## 7. Buat akun admin pertama (manual, lewat Prisma Studio)

```powershell
npx prisma studio
```

Buka tabel `Admin`, tambah 1 baris manual — untuk `password`, hash dulu pakai bcrypt
(nanti bisa dibuatkan script seed kalau perlu, kabari saja).

## 8. Jalankan server

```powershell
npm run start:dev
```

Server jalan di `http://localhost:4000`. Test cepat: buka `http://localhost:4000/radio-stations`
di browser — harusnya balikin array kosong `[]` (karena database masih kosong).

## Catatan penting

- Endpoint `POST/PATCH/DELETE` untuk radio-stations, videos, dan schedule butuh
  header `Authorization: Bearer <token>` — token didapat dari `POST /auth/login`.
- Video: admin cukup kirim `youtubeUrlOrId` (link atau ID YouTube) + `pembicara`,
  `kategori`, `deskripsi` — judul/thumbnail/durasi/tanggal otomatis diambil dari YouTube.
- Radio: `streamUrl` masih placeholder sampai provider streaming ditentukan — tinggal
  di-update lewat `PATCH /radio-stations/:id` kapan saja tanpa perlu deploy ulang.
