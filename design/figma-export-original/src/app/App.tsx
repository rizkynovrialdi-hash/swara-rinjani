import { useState, useRef, useCallback, useEffect } from "react";
import { Radio, ExternalLink, MapPin, Globe2, Menu, X, ChevronRight, Calendar, Video, Info, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Globe } from "./components/globe";
import { RadioCard } from "./components/radio-card";
import { VideoCard } from "./components/video-card";
import { MediaPlayer } from "./components/media-player";
import { STASIUN_RADIO, VIDEO_LIST, JADWAL, GENRE_RADIO, KATEGORI_VIDEO } from "./data";
import { RadioStation, VideoItem } from "./types";

type Tab = "radio" | "video" | "jadwal";
type Page = "home" | "tentang";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [tab, setTab] = useState<Tab>("radio");
  const [genreFilter, setGenreFilter] = useState("Semua");
  const [kategoriFilter, setKategoriFilter] = useState("Semua");
  const [activeStation, setActiveStation] = useState<RadioStation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [watchVideo, setWatchVideo] = useState<VideoItem | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const heroImages = [
    "https://images.unsplash.com/photo-1661318538348-a80960980a5a?q=80&w=2070&auto=format&fit=crop", // Islamic Center
    "https://images.unsplash.com/photo-1724063382622-67e2c59395b6?q=80&w=2070&auto=format&fit=crop", // Rinjani landscape
    "https://images.unsplash.com/photo-1542897643-8158da5b4607?q=80&w=2070&auto=format&fit=crop"  // Community
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const playStation = useCallback((station: RadioStation) => {
    if (activeStation?.id === station.id) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play().catch(() => {});
        setIsPlaying(true);
      }
      return;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    const audio = new Audio(station.streamUrl);
    audio.volume = isMuted ? 0 : volume;
    audioRef.current = audio;
    setActiveStation(station);
    setIsBuffering(true);
    setIsPlaying(true);
    audio.oncanplay = () => setIsBuffering(false);
    audio.onwaiting = () => setIsBuffering(true);
    audio.onplaying = () => { setIsBuffering(false); setIsPlaying(true); };
    audio.onerror = () => setIsBuffering(false);
    audio.play().catch(() => setIsBuffering(false));
  }, [activeStation, isPlaying, volume, isMuted]);

  const closePlayer = () => {
    audioRef.current?.pause();
    setActiveStation(null);
    setIsPlaying(false);
  };

  const filteredStasiun = genreFilter === "Semua"
    ? STASIUN_RADIO
    : STASIUN_RADIO.filter(s => s.genre === genreFilter);

  const filteredVideo = kategoriFilter === "Semua"
    ? VIDEO_LIST
    : VIDEO_LIST.filter(v => v.kategori === kategoriFilter);

  const tipeWarna: Record<string, string> = { radio: "#00c86e", video: "#b84a15", live: "#d4943a" };
  const praya = STASIUN_RADIO[0];

  return (
    <div className="min-h-screen bg-[#F0F0F0] text-[#1A1A1A] font-sans overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-40"
        style={{ background: "#FFFFFF", borderBottom: "1px solid #E5E5E5" }}>
        <div className="max-w-7xl mx-auto px-5 h-20 flex items-center justify-between">
          <button className="flex items-center gap-3" onClick={() => { setPage("home"); setTab("radio"); }}>
            <div className="text-[#E4572E]">
              <Radio size={28} strokeWidth={2.5} />
            </div>
            <span className="text-xl tracking-[0.2em] uppercase flex items-center">
              <span className="font-bold text-[#1A1A1A]">SWARA</span>
              <span className="font-light text-gray-400 ml-2">RINJANI</span>
            </span>
          </button>
          <div className="hidden md:flex items-center gap-10 text-sm font-medium tracking-widest uppercase">
            {(["radio", "video", "jadwal"] as Tab[]).map(t => (
              <button key={t} onClick={() => { setPage("home"); setTab(t); }}
                className="transition-colors relative py-2"
                style={{
                  color: page === "home" && tab === t ? "#E4572E" : "#1A1A1A",
                }}>
                {t === "radio" ? "RADIO" : t === "video" ? "VIDEO" : "JADWAL"}
                {page === "home" && tab === t && (
                  <motion.div layoutId="nav-indicator" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E4572E]" />
                )}
              </button>
            ))}
            <button onClick={() => setPage("tentang")}
              className="transition-colors relative py-2"
              style={{
                color: page === "tentang" ? "#E4572E" : "#1A1A1A",
              }}>
              TENTANG KAMI
              {page === "tentang" && (
                <motion.div layoutId="nav-indicator" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E4572E]" />
              )}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#1A1A1A]/70 uppercase tracking-widest font-semibold">
              <MapPin size={11} /><span>LOMBOK, NTB</span>
            </div>
            <button className="md:hidden text-[#1A1A1A]" onClick={() => setMobileMenuOpen(v => !v)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: "auto", opacity: 1 }} 
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden px-5 pb-5 flex flex-col gap-4 pt-4 bg-[#FFFFFF] border-t border-[#E5E5E5] overflow-hidden"
            >
              {(["radio", "video", "jadwal"] as Tab[]).map(t => (
                <button key={t} onClick={() => { setPage("home"); setTab(t); setMobileMenuOpen(false); }}
                  className="text-left text-sm font-bold uppercase tracking-widest transition-colors"
                  style={{ color: page === "home" && tab === t ? "#E4572E" : "#1A1A1A" }}>
                  {t === "radio" ? "RADIO" : t === "video" ? "VIDEO" : "JADWAL"}
                </button>
              ))}
              <button onClick={() => { setPage("tentang"); setMobileMenuOpen(false); }}
                className="text-left text-sm font-bold uppercase tracking-widest transition-colors"
                style={{ color: page === "tentang" ? "#E4572E" : "#1A1A1A" }}>
                TENTANG KAMI
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AnimatePresence mode="wait">
        {page === "home" ? (
          <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            
            {/* HERO */}
            <AnimatePresence>
              {tab === "radio" && (
                <motion.main 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: "auto", opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }} 
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="flex flex-col lg:flex-row bg-[#F0F0F0] min-h-[90vh] pt-20 overflow-hidden"
                >
              {/* Left Column (Text & CTA) */}
              <motion.div 
                initial={{ x: -30, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }} 
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16 lg:py-0 bg-[#1A1A1A] relative overflow-hidden"
              >
                {/* Watermark Logo */}
                <div className="absolute -left-20 -top-20 opacity-5 pointer-events-none">
                  <Radio size={500} strokeWidth={1} className="text-[#FFFFFF]" />
                </div>

                <div className="relative z-10">
                  <p className="text-xs mb-4 font-bold tracking-widest text-[#FFFFFF]/50 uppercase">
                    KOMUNITAS MASYARAKAT · NUSA TENGGARA BARAT
                  </p>
                  <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight">
                    <span className="text-[#FFFFFF]">Suara</span><br />
                    <span className="text-[#E4572E]">Rinjani</span>
                  </h1>
                  <p className="text-xl text-[#FFFFFF]/70 mb-12 max-w-lg font-normal leading-relaxed">
                    Radio online komunitas masyarakat dari Lombok. Musik, kajian bermakna, suara lokal, dan pemberdayaan — kini hadir langsung lewat jaringan Radio Garden untuk pendengar di seluruh dunia.
                  </p>

                  {/* CTAs */}
                  <div className="flex items-center gap-4 flex-wrap">
                    <button onClick={() => playStation(praya)}
                      className="bg-[#FFFFFF] text-[#1A1A1A] px-8 py-4 font-bold uppercase tracking-widest hover:bg-[#E4572E] hover:text-[#FFFFFF] transition-colors flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-[#E4572E]" style={{
                        animation: activeStation?.id === praya.id && isPlaying ? "liveDot 1.5s ease-in-out infinite" : "none",
                      }} />
                      {activeStation?.id === praya.id && isPlaying ? "SEDANG SIARAN" : "PUTAR PRAYA LIVE"}
                    </button>
                    <button onClick={() => { setTab("radio"); document.getElementById("content-section")?.scrollIntoView({ behavior: "smooth" }); }}
                      className="px-6 py-4 font-bold uppercase tracking-widest text-[#FFFFFF] border border-[#FFFFFF]/20 hover:border-[#FFFFFF] transition-colors flex items-center gap-2">
                      SEMUA STASIUN
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Right Column (Hero Carousel Image) */}
              <motion.div 
                initial={{ scale: 1.05, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                transition={{ duration: 0.7 }}
                className="flex-1 relative min-h-[50vh] lg:min-h-full overflow-hidden bg-[#F0F0F0]"
              >
                <div className="absolute inset-0">
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={heroImageIndex}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.2, ease: "easeInOut" }}
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url('${heroImages[heroImageIndex]}')` }}
                    />
                  </AnimatePresence>
                </div>
              </motion.div>
                </motion.main>
              )}
            </AnimatePresence>

            {/* CONTENT */}
            <section id="content-section" className={`max-w-7xl mx-auto px-5 transition-all duration-500 ${tab === "radio" ? "py-20" : "pt-28 pb-20"}`} style={{ paddingBottom: activeStation ? "7rem" : "5rem", scrollMarginTop: "5rem" }}>
              
              {/* Tabs */}
              <div className="flex items-center gap-6 mb-12 border-b border-[#E5E5E5] pb-2">
                {([
                  { key: "radio" as Tab, label: "Radio" },
                  { key: "video" as Tab, label: "Video" },
                  { key: "jadwal" as Tab, label: "Jadwal" },
                ]).map(({ key, label }) => (
                  <button key={key} onClick={() => setTab(key)}
                    className="pb-2 text-sm font-bold tracking-widest uppercase transition-colors relative"
                    style={{ color: tab === key ? "#E4572E" : "#1A1A1A" }}>
                    {label}
                    {tab === key && <motion.span layoutId="active-tab" className="absolute -bottom-[9px] left-0 right-0 h-[3px] bg-[#E4572E]" />}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {/* RADIO */}
                {tab === "radio" && (
                  <motion.div key="radio" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                    <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                      <h2 className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">STASIUN RADIO</h2>
                      <div className="flex flex-wrap gap-2">
                        {GENRE_RADIO.map(g => (
                          <button key={g} onClick={() => setGenreFilter(g)}
                            className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
                            style={{ background: genreFilter === g ? "#E4572E" : "#FFFFFF", color: genreFilter === g ? "#FFFFFF" : "#1A1A1A", border: "1px solid", borderColor: genreFilter === g ? "#E4572E" : "#E5E5E5" }}>
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {filteredStasiun.map((station, i) => (
                        <motion.div key={station.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                          <RadioCard station={station} isCurrentStation={activeStation?.id === station.id} isPlaying={isPlaying} onPlay={playStation} />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* VIDEO */}
                {tab === "video" && (
                  <motion.div key="video" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                    <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                      <h2 className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">VIDEO & PROGRAM</h2>
                      <div className="flex flex-wrap gap-2">
                        {KATEGORI_VIDEO.map(k => (
                          <button key={k} onClick={() => setKategoriFilter(k)}
                            className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
                            style={{ background: kategoriFilter === k ? "#E4572E" : "#FFFFFF", color: kategoriFilter === k ? "#FFFFFF" : "#1A1A1A", border: "1px solid", borderColor: kategoriFilter === k ? "#E4572E" : "#E5E5E5" }}>
                            {k}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredVideo.map((video, i) => (
                        <motion.div key={video.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                          <VideoCard video={video} onWatch={setWatchVideo} />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* JADWAL */}
                {tab === "jadwal" && (
                  <motion.div key="jadwal" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                    <h2 className="mb-8 text-3xl font-extrabold text-[#1A1A1A] tracking-tight">JADWAL PROGRAM</h2>
                    <div className="space-y-3">
                      {JADWAL.map((item, i) => (
                        <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                          className="flex items-center gap-6 px-6 py-5 bg-[#FFFFFF] border border-[#E5E5E5] hover:border-[#1A1A1A] transition-colors">
                          <span className="text-lg font-bold w-16 flex-shrink-0 tabular-nums text-[#E4572E]">{item.waktu}</span>
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: tipeWarna[item.tipe] || "#E4572E" }} />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-[#1A1A1A] truncate">{item.judul}</p>
                            <p className="text-sm truncate mt-1 text-[#1A1A1A]/70">{item.penyiar}</p>
                          </div>
                          <div className="hidden sm:flex flex-col items-end gap-1">
                            <span className="text-[10px] uppercase tracking-widest font-bold text-[#E4572E]">
                              {item.tipe}
                            </span>
                            <span className="text-xs font-medium text-[#1A1A1A]/50 uppercase">{item.hari}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </motion.div>
        ) : (
          /* PAGE TENTANG KAMI */
          <motion.div key="tentang" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
            className="pt-20 min-h-[90vh] bg-[#F0F0F0]">
            <section className="relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-5 py-24 relative">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
                  <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.5 }} className="flex-1 lg:max-w-xl">
                    <p className="text-xs font-bold tracking-widest mb-4 uppercase text-[#E4572E]">
                      TENTANG KAMI
                    </p>
                    <h2 className="mb-8 text-5xl md:text-6xl font-extrabold leading-[1.1] text-[#1A1A1A] tracking-tight">
                      Radio yang<br />Menghubungkan<br />Masyarakat
                    </h2>
                    <p className="mb-6 text-lg leading-relaxed text-[#1A1A1A]/70">
                      Swara Rinjani hadir sebagai media informasi bagi masyarakat di daerah terpencil dan tertinggal yang selama ini kurang memiliki akses terhadap berita dan perkembangan terkini — mendorong terciptanya masyarakat yang terbuka, adil, dan mandiri.
                    </p>
                    <p className="text-lg leading-relaxed text-[#1A1A1A]/70">
                      Berbasis di Lombok, Nusa Tenggara Barat, kami mengutamakan nilai kearifan lokal untuk kemajuan dan kesejahteraan masyarakat bersama.
                    </p>
                  </motion.div>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                  {[
                    {
                      image: "https://images.unsplash.com/photo-1542897643-8158da5b4607?q=80&w=800&auto=format&fit=crop",
                      title: "Peran Aktif Masyarakat",
                      text: "Mendorong inovasi, kreativitas, dan partisipasi warga dalam mewujudkan daerah yang maju dan mandiri.",
                    },
                    {
                      image: "https://images.unsplash.com/photo-1671080749889-19f8a69deb2b?q=80&w=800&auto=format&fit=crop",
                      title: "Akses Informasi",
                      text: "Menjadi jembatan informasi dan berita aktual bagi daerah yang minim akses teknologi.",
                    },
                    {
                      image: "https://images.unsplash.com/photo-1625111380820-9a371d413cc4?q=80&w=800&auto=format&fit=crop",
                      title: "Pemberdayaan Pemuda",
                      text: "Menciptakan peluang kerja di wilayah yang tertinggal dan terisolasi untuk membangun SDM lokal.",
                    },
                    {
                      image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=800&auto=format&fit=crop",
                      title: "Edukasi & Pelatihan",
                      text: "Menyelenggarakan seminar dan keterampilan gratis agar generasi penerus siap di era digital.",
                    },
                  ].map((card, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + (i * 0.1) }}
                      className="flex flex-col bg-[#FFFFFF] border border-[#E5E5E5] hover:border-[#1A1A1A] transition-all overflow-hidden group">
                      <div className="h-48 w-full overflow-hidden bg-[#F0F0F0] relative">
                        <img src={card.image} alt={card.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="mb-3 font-bold text-lg text-[#1A1A1A]">
                          {card.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-[#1A1A1A]/70">
                          {card.text}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="h-24 bg-[#FFFFFF] flex items-center justify-center border-t border-[#E5E5E5] px-6 mt-auto relative z-10">
        <div className="flex items-center gap-2 text-[#1A1A1A]">
          <Radio size={20} strokeWidth={2.5} className="text-[#E4572E]" />
          <span className="text-sm font-medium tracking-wide">Designed by Arise Media IT Consultancy Ltd</span>
        </div>
      </footer>

      {/* MEDIA PLAYER */}
      <AnimatePresence>
        {activeStation && (
          <motion.div initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "100%", opacity: 0 }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50">
            <MediaPlayer
              station={activeStation}
              isPlaying={isPlaying}
              isBuffering={isBuffering}
              volume={volume}
              isMuted={isMuted}
              onTogglePlay={() => {
                if (isPlaying) { audioRef.current?.pause(); setIsPlaying(false); }
                else { audioRef.current?.play().catch(() => {}); setIsPlaying(true); }
              }}
              onVolumeChange={v => {
                setVolume(v);
                if (audioRef.current) audioRef.current.volume = isMuted ? 0 : v;
              }}
              onToggleMute={() => {
                const next = !isMuted;
                setIsMuted(next);
                if (audioRef.current) audioRef.current.volume = next ? 0 : volume;
              }}
              onClose={closePlayer}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* VIDEO MODAL */}
      <AnimatePresence>
        {watchVideo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#1A1A1A]/90 backdrop-blur-sm"
            onClick={() => setWatchVideo(null)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-3xl bg-[#FFFFFF] overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}>

              {/* YouTube embed or thumbnail fallback */}
              <div style={{ position: "relative", aspectRatio: "16/9", background: "#F0F0F0" }}>
                {watchVideo.youtubeId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${watchVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                    title={watchVideo.judul}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-none"
                  />
                ) : (
                  <>
                    <img src={watchVideo.thumbnail} alt={watchVideo.judul} className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 flex items-center justify-center px-8 text-center">
                      <p className="text-sm leading-relaxed text-[#1A1A1A] font-bold max-w-md drop-shadow-md">{watchVideo.deskripsi}</p>
                    </div>
                  </>
                )}
              </div>

              <div className="p-6 flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <h3 className="mb-2 text-xl font-bold text-[#1A1A1A] leading-tight">
                    {watchVideo.judul}
                  </h3>
                  <p className="text-sm mb-2 font-medium text-[#1A1A1A]/70">{watchVideo.pembicara} · {watchVideo.tanggal}</p>
                  <p className="text-sm leading-relaxed text-[#1A1A1A]/60">{watchVideo.deskripsi}</p>
                </div>
                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                  {watchVideo.youtubeId && (
                    <a href={`https://www.youtube.com/watch?v=${watchVideo.youtubeId}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#FF0000] text-[#FFFFFF] hover:opacity-90 transition-opacity">
                      <ExternalLink size={14} /> YOUTUBE
                    </a>
                  )}
                  <button onClick={() => setWatchVideo(null)}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#F0F0F0] text-[#1A1A1A] hover:bg-[#E5E5E5] transition-colors">
                    TUTUP
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes liveDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.3;transform:scale(1.5)}}`}</style>
    </div>
  );
}