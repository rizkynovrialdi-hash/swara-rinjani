# apps/web — Frontend (Next.js)

## ⚠️ Penting sebelum mulai

Folder ini BELUM di-init sebagai project Next.js asli — isinya baru file hasil pindahan dari
Figma export (komponen, styles, types, seed data) yang sudah dirapikan per folder.

Cara pakai:

1. Jalankan `npx create-next-app@latest .` di folder ini (jawab prompt: TypeScript=Yes,
   Tailwind=Yes, App Router=Yes, src/ directory=Yes, import alias `@/*`=default).
2. Setelah project ke-generate, **timpa/gabungkan** folder `components/`, `lib/`, `styles/`
   yang sudah ada di sini ke dalam struktur baru dari create-next-app (jangan hapus yang
   sudah dirapikan ini, tapi merge).
3. Import `styles/globals.css`, `theme.css`, `tailwind.css`, `fonts.css` ke `app/layout.tsx`.

## Isi folder ini

- `components/radio/` — `RadioCard.tsx`, `MediaPlayer.tsx` (kartu stasiun & pemutar audio)
- `components/video/` — `VideoCard.tsx` (kartu video)
- `components/layout/` — `Globe.tsx` (dekorasi hero), nanti tambah `Navbar.tsx`, `Footer.tsx`
- `components/ui/` — kosong, untuk komponen kecil reusable (button, badge, dll — bisa isi shadcn/ui)
- `lib/types.ts` — bentuk data `RadioStation`, `VideoItem`, `JadwalItem` (dipakai juga sebagai
  acuan bikin `schema.prisma` di backend)
- `lib/seed-data.ts` — data dummy dari prototype awal (5 stasiun radio, video, jadwal).
  Nanti dipakai sebagai **seed database**, bukan sumber data permanen.
- `styles/` — CSS asli dari export Figma (Tailwind v4 + theme + font)
- `app/(public)/` — halaman untuk visitor: home, video, jadwal, tentang
- `app/(admin)/` — halaman untuk admin: dashboard, upload konten, kelola stasiun/video

## Yang masih perlu dikerjakan

- Pecah `App.tsx` asli (lihat `/design/figma-export-original`) jadi route terpisah di `app/(public)/`
- Ganti pemanggilan `seed-data.ts` dengan fetch ke API NestJS (`lib/api-client.ts`, belum dibuat)
- Tambah halaman admin (form upload, list konten, edit)
