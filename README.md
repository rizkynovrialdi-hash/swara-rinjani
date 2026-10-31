# Rinjani — Swara Rinjani Media Platform

Platform radio & video streaming komunitas (Arise Media). Admin upload konten via CMS, visitor stream audio/video.

## Struktur Folder

```
rinjani/
├── apps/
│   ├── web/          → Frontend Next.js (yang dilihat visitor & admin)
│   └── api/           → Backend NestJS (auth, database, upload logic)
├── design/
│   └── figma-export-original/  → Arsip mentah export Figma Make, JANGAN diedit, hanya referensi
├── packages/
│   └── shared-types/  → (opsional) tipe TS yang dipakai bareng web & api
├── docker-compose.yml → Jalankan web + api + postgres sekaligus
└── .env.example
```

## Status saat ini

- [x] Frontend prototype (UI, komponen, styling) sudah dipindah dari Figma export ke `apps/web`
- [x] Data model (`RadioStation`, `VideoItem`, `JadwalItem`) diambil dari `types.ts` asli → jadi basis `schema.prisma`
- [ ] Setup Next.js project sesungguhnya di `apps/web` (folder ini baru berisi file yang akan dipindah masuk struktur `create-next-app`)
- [ ] Setup NestJS project di `apps/api`
- [ ] Ganti data statis (`lib/seed-data.ts`) jadi fetch dari API
- [ ] Tentukan sumber streaming radio asli (Icecast/Shoutcast?) — masih pakai placeholder SomaFM
- [ ] Tentukan cara video disajikan: embed YouTube atau upload native ke R2/S3

## Cara mulai (setelah `apps/web` di-init dengan create-next-app)

```bash
cd apps/web
npm install
npm run dev
```

Lihat `apps/web/README.md` dan `apps/api/README.md` untuk detail masing-masing.
