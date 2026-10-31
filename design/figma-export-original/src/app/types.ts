export interface RadioStation {
  id: string;
  name: string;
  deskripsi: string;
  genre: string;
  streamUrl: string;
  cover: string;
  pendengar: number;
  bitrate: number;
  penyiar: string;
  warna: string;
  programSaatIni: string;
}

export interface VideoItem {
  id: string;
  judul: string;
  pembicara: string;
  kategori: string;
  thumbnail: string;
  durasi: string;
  penonton: number;
  tanggal: string;
  sedangLive: boolean;
  deskripsi: string;
  youtubeId: string;
}

export interface JadwalItem {
  id: string;
  waktu: string;
  waktuSelesai: string;
  judul: string;
  penyiar: string;
  tipe: string;
  hari: string;
}
