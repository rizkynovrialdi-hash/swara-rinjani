-- CreateTable
CREATE TABLE "RadioStation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "streamUrl" TEXT NOT NULL,
    "cover" TEXT NOT NULL,
    "pendengar" INTEGER NOT NULL DEFAULT 0,
    "bitrate" INTEGER NOT NULL,
    "penyiar" TEXT NOT NULL,
    "warna" TEXT NOT NULL,
    "programSaatIni" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RadioStation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoItem" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "pembicara" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "durasi" TEXT NOT NULL,
    "penonton" INTEGER NOT NULL DEFAULT 0,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "sedangLive" BOOLEAN NOT NULL DEFAULT false,
    "deskripsi" TEXT NOT NULL,
    "youtubeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VideoItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JadwalItem" (
    "id" TEXT NOT NULL,
    "waktu" TEXT NOT NULL,
    "waktuSelesai" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "penyiar" TEXT NOT NULL,
    "tipe" TEXT NOT NULL,
    "hari" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JadwalItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VideoItem_youtubeId_key" ON "VideoItem"("youtubeId");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");
