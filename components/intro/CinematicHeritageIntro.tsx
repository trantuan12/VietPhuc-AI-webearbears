import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Volume2,
  VolumeX,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  Compass,
  ArrowRight,
  BookOpen,
  Bookmark,
} from "lucide-react";
import { PetalDustCanvas } from "./PetalDustCanvas";
import {
  playHeritageGong,
  playDoorOpenCreak,
  playStationChime,
} from "./audioSynth";

interface CinematicHeritageIntroProps {
  onComplete: () => void;
  onSkip?: () => void;
}

// Heritage Discovery Station definition
interface HeritageStation {
  id: number;
  badge: string;
  title: string;
  description: string;
  tags: string[];
  align: "left" | "right";
  heroImage: string;
}

// 4 Heritage Discovery Stations configuration
const STATIONS: HeritageStation[] = [
  {
    id: 1,
    badge: "01",
    title: "KHÁM PHÁ CỔ PHỤC VIỆT",
    description:
      "Chiêm ngưỡng những dòng trang phục hoàng triều và dân gian Việt Nam, giải mã cấu trúc cổ phục và triết lý thẩm mỹ ngàn năm.",
    tags: ["Nhật Bình", "Ngũ Thân", "Áo Dài", "Tứ Thân"],
    align: "left",
    heroImage: "/images/intro/hero_station_1.jpg",
  },
  {
    id: 2,
    badge: "02",
    title: "PHỐI ĐỒ CÙNG AI",
    description:
      "AI Stylist gợi ý phối cổ phục cùng phụ kiện đương đại, dung hòa di sản và nhịp sống trẻ.",
    tags: ["Cổ Điển", "Giao Thoa", "Gen Z Streetwear"],
    align: "right",
    heroImage: "/images/intro/hero_station_2.jpg",
  },
  {
    id: 3,
    badge: "03",
    title: "THẨM ĐỊNH DI SẢN",
    description:
      "Soi từng đường kim mũi chỉ, cấu trúc cổ áo và đối chiếu sử liệu để giữ gìn tính xác thực văn hóa.",
    tags: ["Cổ Chữ Nhật", "Chỉ Kim Tuyến", "Ngũ Sắc", "Sử Liệu"],
    align: "left",
    heroImage: "/images/intro/hero_station_3.jpg",
  },
  {
    id: 4,
    badge: "04",
    title: "TẠO LOOKBOOK CỦA BẠN",
    description:
      "Lưu giữ và chia sẻ bản phối yêu thích thành những bộ ảnh thời trang nghệ thuật độc bản.",
    tags: ["Dạo Phố", "Kỷ Yếu", "Lễ Hội", "Xuất Thẻ 4K"],
    align: "right",
    heroImage: "/images/intro/hero_station_4.jpg",
  },
];

export const CinematicHeritageIntro: React.FC<CinematicHeritageIntroProps> = ({
  onComplete,
  onSkip,
}) => {
  // Intro Phases:
  // 'gate_closed': Stage 1 - Gate closed, branding, waiting for user click
  // 'opening_doors': Stage 2 - Doors swing open in 3D, light bloom, camera dollies forward
  // 'traveling': Stage 3 - Camera glides along stone pathway, displaying the active station
  // 'destination': Stage 4 - Arrival at central pavilion, final manifesto, CTA into Studio
  // 'entering_studio': Final smooth transition into studio
  const [phase, setPhase] = useState<
    "gate_closed" | "opening_doors" | "traveling" | "destination" | "entering_studio"
  >("gate_closed");

  // Station index (0 to 3) during 'traveling'
  const [activeStationIndex, setActiveStationIndex] = useState(0);

  // Audio mute state
  const [isMuted, setIsMuted] = useState(false);

  // Selected Garment in Station 1 preview
  const [selectedGarmentIdx, setSelectedGarmentIdx] = useState(0);

  // Selected Tier in Station 2 preview
  const [selectedTierIdx, setSelectedTierIdx] = useState(1);

  // Selected Hotspot in Station 3 preview
  const [selectedHotspotIdx, setSelectedHotspotIdx] = useState(0);

  // Wheel scroll debounce tracker
  const lastScrollTime = useRef(0);

  // Handle CTA Click: "BẮT ĐẦU HÀNH TRÌNH" or click to start
  const handleStartJourney = () => {
    if (phase !== "gate_closed") return;
    playHeritageGong(isMuted);
    playDoorOpenCreak(isMuted);
    setPhase("opening_doors");

    // Door swings open for 2.2s, then camera dollies through gate into traveling phase
    setTimeout(() => {
      setPhase("traveling");
      setActiveStationIndex(0);
      playStationChime(isMuted, 0);
    }, 2200);
  };

  // Next Station
  const handleNextStation = useCallback(() => {
    if (activeStationIndex < STATIONS.length - 1) {
      const nextIdx = activeStationIndex + 1;
      setActiveStationIndex(nextIdx);
      playStationChime(isMuted, nextIdx);
    } else {
      // Reached end of stations -> Destination Pavilion
      setPhase("destination");
      playHeritageGong(isMuted);
    }
  }, [activeStationIndex, isMuted]);

  // Previous Station
  const handlePrevStation = useCallback(() => {
    if (activeStationIndex > 0) {
      const prevIdx = activeStationIndex - 1;
      setActiveStationIndex(prevIdx);
      playStationChime(isMuted, prevIdx);
    }
  }, [activeStationIndex, isMuted]);

  // Final Action: Enter Studio
  const handleEnterStudio = () => {
    playHeritageGong(isMuted);
    setPhase("entering_studio");
    setTimeout(() => {
      onComplete();
    }, 1100);
  };

  // Handle Skip
  const handleSkipIntro = () => {
    if (onSkip) {
      onSkip();
    } else {
      onComplete();
    }
  };

  // User taps/clicks anywhere on screen to advance!
  const handleScreenClick = () => {
    if (phase === "opening_doors" || phase === "entering_studio") return;

    if (phase === "gate_closed") {
      handleStartJourney();
    } else if (phase === "traveling") {
      handleNextStation();
    } else if (phase === "destination") {
      handleEnterStudio();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleSkipIntro();
      } else if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (phase === "gate_closed") handleStartJourney();
        else if (phase === "traveling") handleNextStation();
        else if (phase === "destination") handleEnterStudio();
      } else if (e.key === "ArrowLeft" && phase === "traveling") {
        e.preventDefault();
        handlePrevStation();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, activeStationIndex, handleNextStation, handlePrevStation]);

  // Mouse wheel scroll to scrub stations
  const handleWheel = (e: React.WheelEvent) => {
    if (phase !== "traveling") return;
    const now = Date.now();
    if (now - lastScrollTime.current < 600) return;

    if (e.deltaY > 30) {
      lastScrollTime.current = now;
      handleNextStation();
    } else if (e.deltaY < -30) {
      lastScrollTime.current = now;
      handlePrevStation();
    }
  };

  // Active Station Data
  const currentStation = STATIONS[activeStationIndex];

  // Dynamic Camera Transform calculations
  let cameraScale = 1.0;
  let cameraTranslateY = 0;
  let cameraTranslateX = 0;
  let cameraRotateY = 0;

  if (phase === "traveling") {
    cameraScale = 1.08 + activeStationIndex * 0.08;
    cameraTranslateY = activeStationIndex * 2.2;
    if (currentStation.align === "left") {
      cameraTranslateX = 32;
      cameraRotateY = -1.2;
    } else {
      cameraTranslateX = -32;
      cameraRotateY = 1.2;
    }
  } else if (phase === "destination") {
    cameraScale = 1.38;
    cameraTranslateY = 9;
    cameraTranslateX = 0;
    cameraRotateY = 0;
  } else if (phase === "entering_studio") {
    cameraScale = 1.8;
    cameraTranslateY = 15;
    cameraTranslateX = 0;
    cameraRotateY = 0;
  }

  return (
    <div
      onClick={handleScreenClick}
      onWheel={handleWheel}
      className={`fixed inset-0 z-50 w-screen h-screen overflow-hidden bg-stone-950 text-stone-100 select-none cursor-pointer transition-opacity duration-1000 font-sans ${
        phase === "entering_studio" ? "opacity-0 scale-105 pointer-events-none" : "opacity-100"
      }`}
      style={{ perspective: "1400px" }}
    >
      {/* ========================================================= */}
      {/* 1. CINEMATIC 3D CAMERA ENVIRONMENT RIG */}
      {/* ========================================================= */}
      <div
        className="absolute inset-0 w-full h-full transform-gpu transition-all duration-1000 ease-out origin-center pointer-events-none"
        style={{
          transform: `scale(${cameraScale}) translate3d(${cameraTranslateX}px, ${cameraTranslateY}%, 0) rotateY(${cameraRotateY}deg)`,
        }}
      >
        {/* Environment Layer A: Inner Courtyard Pathway (Always in depth behind gate) */}
        <div
          className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ${
            phase === "gate_closed" ? "opacity-30 scale-95" : "opacity-100 scale-100"
          }`}
          style={{
            backgroundImage: "url('/images/intro/inner_path.jpg')",
          }}
        />

        {/* Environment Layer B: Outer Grand Heritage Gate */}
        <div
          className={`absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-1200 ease-in-out ${
            phase === "gate_closed"
              ? "opacity-100 scale-100"
              : phase === "opening_doors"
              ? "opacity-85 scale-125"
              : "opacity-0 scale-220 pointer-events-none"
          }`}
          style={{
            backgroundImage: "url('/images/intro/gate_golden.jpg')",
          }}
        />

        {/* ========================================================= */}
        {/* 2. THE 3D OPENABLE VIETNAMESE WOODEN GATE DOORS */}
        {/* ========================================================= */}
        {(phase === "gate_closed" || phase === "opening_doors") && (
          <div
            className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[420px] md:w-[480px] h-[480px] sm:h-[580px] md:h-[640px] pointer-events-auto"
            style={{ perspective: "1200px" }}
          >
            {/* Gate Portal Arch Stone Border Frame */}
            <div className="absolute -inset-3.5 rounded-t-[140px] border-8 border-stone-800/80 shadow-[0_30px_90px_rgba(0,0,0,0.8)] pointer-events-none z-30" />

            {/* Behind-door Volumetric Golden Light Burst when opening */}
            <div
              className={`absolute inset-0 z-10 transition-all duration-1000 pointer-events-none ${
                phase === "opening_doors"
                  ? "opacity-100 scale-125"
                  : "opacity-0 scale-75"
              }`}
              style={{
                background:
                  "radial-gradient(circle, rgba(255,230,160,0.95) 0%, rgba(224,122,95,0.7) 35%, rgba(0,0,0,0) 70%)",
                mixBlendMode: "screen",
              }}
            />

            {/* Door Container */}
            <div className="relative w-full h-full flex overflow-hidden rounded-t-[130px] border-4 border-stone-900 bg-stone-950 shadow-2xl">
              {/* LEFT DOOR LEAF */}
              <div
                className="w-1/2 h-full relative overflow-hidden transform-gpu origin-left shadow-2xl"
                style={{
                  transition: "transform 1.9s cubic-bezier(0.25, 1, 0.5, 1)",
                  transform:
                    phase === "opening_doors"
                      ? "perspective(1200px) rotateY(-108deg)"
                      : "perspective(1200px) rotateY(0deg)",
                  backgroundImage: "url('/images/intro/gate_door.jpg')",
                  backgroundSize: "200% 100%",
                  backgroundPosition: "0% 50%",
                }}
              >
                {/* Wood Shadow & Edge Depth Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/60 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-gradient-to-l from-stone-950 to-transparent" />
              </div>

              {/* RIGHT DOOR LEAF */}
              <div
                className="w-1/2 h-full relative overflow-hidden transform-gpu origin-right shadow-2xl"
                style={{
                  transition: "transform 1.9s cubic-bezier(0.25, 1, 0.5, 1)",
                  transform:
                    phase === "opening_doors"
                      ? "perspective(1200px) rotateY(108deg)"
                      : "perspective(1200px) rotateY(0deg)",
                  backgroundImage: "url('/images/intro/gate_door.jpg')",
                  backgroundSize: "200% 100%",
                  backgroundPosition: "100% 50%",
                }}
              >
                {/* Wood Shadow & Edge Depth Overlay */}
                <div className="absolute inset-0 bg-gradient-to-l from-black/40 via-transparent to-black/60 pointer-events-none" />
                <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-r from-stone-950 to-transparent" />
              </div>
            </div>
          </div>
        )}

        {/* Volumetric Sunlight Rays Filter (Top-Right) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-45 mix-blend-screen"
          style={{
            background:
              "radial-gradient(ellipse 90% 60% at 85% 15%, rgba(255, 230, 160, 0.6) 0%, rgba(224, 122, 95, 0.25) 45%, transparent 75%)",
          }}
        />
      </div>

      {/* ========================================================= */}
      {/* 3. FLOATING PETALS & GOLDEN SUN DUST PARTICLE CANVAS */}
      {/* ========================================================= */}
      <PetalDustCanvas
        speedMultiplier={
          phase === "opening_doors"
            ? 2.8
            : phase === "traveling"
            ? 1.2
            : 0.9
        }
      />

      {/* ========================================================= */}
      {/* 4. TOP HUD BAR: BRANDING, AUDIO, SKIP */}
      {/* ========================================================= */}
      <header className="absolute top-4 sm:top-6 inset-x-4 sm:inset-x-8 z-40 flex items-center justify-between pointer-events-auto">
        {/* Brand Capsule */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-3 px-4 py-2 rounded-full bg-stone-900/60 backdrop-blur-md border border-white/15 shadow-xl text-stone-100"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E07A5F] to-[#B85338] flex items-center justify-center text-white shadow-sm">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 text-white"
            >
              <path d="M12 2C12 2 14 6 14 8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8C10 6 12 2 12 2ZM6.5 7.5C7.3 6.9 8.5 7.2 9.1 8C9.7 8.8 9.5 10 8.7 10.6C7.5 11.4 5.5 12 5.5 12C5.5 12 5.7 8.3 6.5 7.5ZM17.5 7.5C18.3 8.3 18.5 12 18.5 12C18.5 12 16.5 11.4 15.3 10.6C14.5 10 14.3 8.8 14.9 8C15.5 7.2 16.7 6.9 17.5 7.5ZM3 15C3 15 5.5 14 7 14C8.7 14 10 15.3 10 17C10 17 6 18 3 15ZM21 15C18 18 14 17 14 17C14 15.3 15.3 14 17 14C18.5 14 21 15 21 15ZM12 13C13.7 13 15 14.3 15 16C15 18 12 22 12 22C12 22 9 18 9 16C9 14.3 10.3 13 12 13Z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xs tracking-wider text-white">
                VIỆT PHỤC REMIX
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#E07A5F] text-white font-black uppercase tracking-widest">
                GEN Z STUDIO
              </span>
            </div>
            <p className="text-[10px] text-stone-300 font-light hidden sm:block">
              Hành Trình Bước Vào Không Gian Di Sản & Sáng Tạo
            </p>
          </div>
        </div>

        {/* Right Controls: Sound & Skip */}
        <div className="flex items-center gap-2.5">
          {/* Audio Mute/Unmute */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMuted(!isMuted);
            }}
            className="w-10 h-10 rounded-full bg-stone-900/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-stone-300 hover:text-white hover:bg-stone-800/80 transition-all cursor-pointer shadow-lg"
            title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-stone-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#E07A5F]" />
            )}
          </button>

          {/* Discreet Skip Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSkipIntro();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-stone-900/60 backdrop-blur-md border border-white/15 text-stone-300 hover:text-white hover:bg-stone-800/90 text-xs font-semibold transition-all cursor-pointer shadow-lg group"
          >
            <span>Bỏ qua giới thiệu</span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 5. GIAI ĐOẠN 1: CÁNH CỔNG ĐÓNG & HERO BRANDING */}
      {/* ========================================================= */}
      {phase === "gate_closed" && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none p-4 text-center">
          {/* Ambient Card Backdrop */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-xl w-full p-6 sm:p-8 rounded-3xl bg-stone-950/65 backdrop-blur-md border border-white/20 shadow-[0_20px_70px_rgba(0,0,0,0.7)] pointer-events-auto transform animate-in fade-in zoom-in-95 duration-700"
          >
            {/* Rosette Lotus Emblem */}
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-[#E07A5F] via-[#D86343] to-[#F59E0B] p-0.5 shadow-[0_0_30px_rgba(224,122,95,0.4)]">
              <div className="w-full h-full rounded-[14px] bg-stone-950/80 backdrop-blur-sm flex items-center justify-center">
                <svg
                  viewBox="0 0 36 36"
                  fill="currentColor"
                  className="w-9 h-9 text-[#F59E0B]"
                >
                  <g transform="translate(18,18)">
                    <circle cx="0" cy="0" r="3.2" fill="#E07A5F" />
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                      <g key={i} transform={`rotate(${angle})`}>
                        <path
                          d="M -3.2,-5 C -4,-10 0,-14.5 0,-14.5 C 0,-14.5 4,-10 3.2,-5 C 2.5,-1.5 -2.5,-1.5 -3.2,-5 Z"
                          fill="#E07A5F"
                          opacity="0.9"
                        />
                        <circle cx="0" cy="-9" r="1.1" fill="#FAF8F5" />
                      </g>
                    ))}
                  </g>
                </svg>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-semibold text-amber-200 uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Bước Vào Thế Giới Di Sản</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-2 drop-shadow-md">
              VIỆT PHỤC REMIX
            </h1>

            <div className="inline-block px-3 py-0.5 rounded-full bg-[#E07A5F] text-white text-xs font-black uppercase tracking-widest mb-4 shadow-sm">
              GEN Z STUDIO
            </div>

            <p className="text-sm sm:text-base text-stone-200/90 font-light max-w-md mx-auto leading-relaxed mb-8">
              “Nơi di sản Việt được kể lại bằng ngôn ngữ của thế hệ mới.”
            </p>

            {/* Main Action Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartJourney();
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#E07A5F] via-[#D86343] to-[#B84E32] text-white font-bold text-sm sm:text-base tracking-wide shadow-[0_10px_35px_rgba(224,122,95,0.45)] hover:shadow-[0_14px_45px_rgba(224,122,95,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2.5 group border border-white/20"
              >
                <span>BẮT ĐẦU HÀNH TRÌNH</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSkipIntro();
                }}
                className="text-xs text-stone-400 hover:text-stone-200 underline underline-offset-4 transition-colors cursor-pointer py-2"
              >
                Bỏ qua giới thiệu
              </button>
            </div>

            <div className="text-[11px] text-stone-400/80 mt-4 flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E07A5F] animate-pulse" />
              <span>Chạm hoặc click bất kỳ đâu trên màn hình để bắt đầu</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. GIAI ĐOẠN 3: HÀNH TRÌNH QUA 4 TRẠM DI SẢN (HERITAGE WALK) */}
      {/* ========================================================= */}
      {phase === "traveling" && (
        <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between p-4 sm:p-6 md:p-8">
          {/* Top spacer (đảm bảo thoáng phần header) */}
          <div className="h-16" />

          {/* KHÔNG GIAN TRIỂN LÃM: TRÁI / PHẢI LUÂN PHIÊN, GIỮA 45-50% HOÀN TOÀN TRỐNG */}
          <div className="flex-1 flex items-center justify-between w-full max-w-[1440px] mx-auto px-2 sm:px-6 md:px-10 lg:px-14 pointer-events-none">
            {/* SLOT BÊN TRÁI (Trạm 01 & Trạm 03) */}
            <div className="w-[360px] sm:w-[390px] max-w-[44vw] flex justify-start">
              {currentStation.align === "left" && (
                <div
                  key={`station-left-${currentStation.id}`}
                  className="pointer-events-auto transition-all duration-700 ease-out animate-in fade-in slide-in-from-left-7 duration-600"
                  style={{
                    filter:
                      "drop-shadow(0 14px 32px rgba(54,37,29,0.16)) drop-shadow(0 2px 6px rgba(54,37,29,0.06))",
                  }}
                >
                  {/* FLOATING HERITAGE PLAQUE (NHÃN TRIỂN LÃM GỖ & GẤM HIỆN ĐẠI) */}
                  <div className="relative w-full rounded-2xl bg-[#FFF9F0] border border-[#D9684B]/35 p-5 sm:p-5.5 overflow-hidden">
                    {/* Cạnh trên cong nhẹ như mái / biển hiệu truyền thống Việt Nam */}
                    <div className="absolute top-0 left-0 right-0 h-1 flex items-center justify-center">
                      <div className="w-24 h-0.5 rounded-full bg-[#D9684B]/40" />
                    </div>

                    {/* Motif mây cuộn Đại Việt rất mờ ở góc dưới phải */}
                    <div className="absolute -bottom-1 -right-1 w-16 h-16 pointer-events-none opacity-15 text-[#D9684B]">
                      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                        <path
                          d="M8 32 C8 23 15 16 24 16 C28 16 32 18 34 21 C37 19 41 20 42 24 C44 29 41 34 36 35 C31 36 26 33 26 29 C26 25 21 23 17 25 C13 27 13 32 17 35 C20 37 20 41 17 42 C13 45 8 38 8 32 Z"
                          stroke="currentColor"
                          strokeWidth="1.2"
                        />
                      </svg>
                    </div>

                    {/* Bố cục: Nội dung tinh giản bên trái, Thumbnail nhỏ ở cạnh phải */}
                    <div className="relative z-10 flex items-start justify-between gap-3.5">
                      <div className="flex-1 min-w-0">
                        {/* Header: Số trạm + Dấu gạch gold + Tiêu đề chữ hoa */}
                        <div className="flex items-baseline gap-2">
                          <span className="font-mono font-black text-xs sm:text-sm text-[#D9684B] tracking-wider">
                            {currentStation.badge}
                          </span>
                          <span className="text-[#C89B52] text-xs font-serif select-none">—</span>
                          <h3 className="font-black text-xs sm:text-[13px] text-[#36251D] tracking-wider uppercase truncate">
                            {currentStation.title}
                          </h3>
                        </div>

                        {/* Câu mô tả 2 dòng */}
                        <p className="text-[11px] sm:text-xs text-[#5A453A] leading-relaxed mt-2 font-normal">
                          {currentStation.description}
                        </p>

                        {/* Hàng nhãn nhỏ phân cách bởi dấu chấm gold */}
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-[#7A5848] mt-3.5 pt-2.5 border-t border-[#D9684B]/15">
                          {currentStation.tags.map((tag, tIdx) => (
                            <React.Fragment key={tIdx}>
                              {tIdx > 0 && (
                                <span className="text-[#C89B52] text-[9px] select-none">·</span>
                              )}
                              <span className="hover:text-[#D9684B] transition-colors">
                                {tag}
                              </span>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>

                      {/* Thumbnail nhỏ ở cạnh phải */}
                      <div className="w-[66px] h-[78px] sm:w-[72px] sm:h-[84px] rounded-xl overflow-hidden border border-[#D9684B]/25 shadow-xs shrink-0 bg-stone-100 self-center">
                        <img
                          src={currentStation.heroImage}
                          alt={currentStation.title}
                          className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* VÙNG GIỮA TRỐNG HOÀN TOÀN (45-50% KHÔNG GIAN CỔNG & ĐƯỜNG ĐI DI SẢN) */}
            <div className="flex-1 min-w-[200px] pointer-events-none" />

            {/* SLOT BÊN PHẢI (Trạm 02 & Trạm 04) */}
            <div className="w-[360px] sm:w-[390px] max-w-[44vw] flex justify-end">
              {currentStation.align === "right" && (
                <div
                  key={`station-right-${currentStation.id}`}
                  className="pointer-events-auto transition-all duration-700 ease-out animate-in fade-in slide-in-from-right-7 duration-600"
                  style={{
                    filter:
                      "drop-shadow(0 14px 32px rgba(54,37,29,0.16)) drop-shadow(0 2px 6px rgba(54,37,29,0.06))",
                  }}
                >
                  {/* FLOATING HERITAGE PLAQUE (NHÃN TRIỂN LÃM GỖ & GẤM HIỆN ĐẠI) */}
                  <div className="relative w-full rounded-2xl bg-[#FFF9F0] border border-[#D9684B]/35 p-5 sm:p-5.5 overflow-hidden">
                    {/* Cạnh trên cong nhẹ như mái / biển hiệu truyền thống Việt Nam */}
                    <div className="absolute top-0 left-0 right-0 h-1 flex items-center justify-center">
                      <div className="w-24 h-0.5 rounded-full bg-[#D9684B]/40" />
                    </div>

                    {/* Motif mây cuộn Đại Việt rất mờ ở góc dưới phải */}
                    <div className="absolute -bottom-1 -right-1 w-16 h-16 pointer-events-none opacity-15 text-[#D9684B]">
                      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                        <path
                          d="M8 32 C8 23 15 16 24 16 C28 16 32 18 34 21 C37 19 41 20 42 24 C44 29 41 34 36 35 C31 36 26 33 26 29 C26 25 21 23 17 25 C13 27 13 32 17 35 C20 37 20 41 17 42 C13 45 8 38 8 32 Z"
                          stroke="currentColor"
                          strokeWidth="1.2"
                        />
                      </svg>
                    </div>

                    {/* Bố cục: Nội dung tinh giản bên trái, Thumbnail nhỏ ở cạnh phải */}
                    <div className="relative z-10 flex items-start justify-between gap-3.5">
                      <div className="flex-1 min-w-0">
                        {/* Header: Số trạm + Dấu gạch gold + Tiêu đề chữ hoa */}
                        <div className="flex items-baseline gap-2">
                          <span className="font-mono font-black text-xs sm:text-sm text-[#D9684B] tracking-wider">
                            {currentStation.badge}
                          </span>
                          <span className="text-[#C89B52] text-xs font-serif select-none">—</span>
                          <h3 className="font-black text-xs sm:text-[13px] text-[#36251D] tracking-wider uppercase truncate">
                            {currentStation.title}
                          </h3>
                        </div>

                        {/* Câu mô tả 2 dòng */}
                        <p className="text-[11px] sm:text-xs text-[#5A453A] leading-relaxed mt-2 font-normal">
                          {currentStation.description}
                        </p>

                        {/* Hàng nhãn nhỏ phân cách bởi dấu chấm gold */}
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-[#7A5848] mt-3.5 pt-2.5 border-t border-[#D9684B]/15">
                          {currentStation.tags.map((tag, tIdx) => (
                            <React.Fragment key={tIdx}>
                              {tIdx > 0 && (
                                <span className="text-[#C89B52] text-[9px] select-none">·</span>
                              )}
                              <span className="hover:text-[#D9684B] transition-colors">
                                {tag}
                              </span>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>

                      {/* Thumbnail nhỏ ở cạnh phải */}
                      <div className="w-[66px] h-[78px] sm:w-[72px] sm:h-[84px] rounded-xl overflow-hidden border border-[#D9684B]/25 shadow-xs shrink-0 bg-stone-100 self-center">
                        <img
                          src={currentStation.heroImage}
                          alt={currentStation.title}
                          className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* BỘ ĐIỀU HƯỚNG TỐI GIẢN Ở ĐÁY: ● ○ ○ ○   Tiếp tục → */}
          <div className="flex flex-col items-center justify-center pb-4 sm:pb-6 pointer-events-auto gap-2">
            <div className="flex items-center gap-4 px-5 py-2.5 rounded-full bg-[#FFF9F0]/92 backdrop-blur-md border border-[#D9684B]/25 shadow-[0_8px_24px_rgba(54,37,29,0.14)]">
              {/* Dấu chấm tiến trình: ● ○ ○ ○ */}
              <div className="flex items-center gap-2">
                {STATIONS.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveStationIndex(i);
                      playStationChime(isMuted, i);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      i === activeStationIndex
                        ? "w-6 bg-[#D9684B]"
                        : "w-2 bg-[#D9684B]/30 hover:bg-[#D9684B]/55"
                    }`}
                    title={`Trạm 0${i + 1}`}
                  />
                ))}
              </div>

              <span className="text-[#C89B52] text-xs select-none">|</span>

              {/* Nút bấm hành động: Tiếp tục → */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextStation();
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-[#36251D] hover:text-[#D9684B] transition-colors cursor-pointer group"
              >
                <span>
                  {activeStationIndex === STATIONS.length - 1
                    ? "Bước Đến Đích"
                    : "Tiếp tục"}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#D9684B] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="text-[11px] text-white/80 drop-shadow-md font-light">
              Chạm bất kỳ đâu trên màn hình để tiếp tục hành trình
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. GIAI ĐOẠN 4: ĐIỂM KẾT THÚC HÀNH TRÌNH & MANIFESTO */}
      {/* ========================================================= */}
      {phase === "destination" && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-4 text-center pointer-events-auto animate-in fade-in zoom-in-95 duration-700">
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-lg w-full p-8 sm:p-10 rounded-3xl bg-[#FFF9F0]/95 backdrop-blur-xl border border-[#D9684B]/35 shadow-[0_30px_80px_rgba(54,37,29,0.25)] relative overflow-hidden text-[#36251D]"
          >
            {/* Subtle top decorative crest */}
            <div className="w-16 h-1 rounded-full bg-[#D9684B]/40 mx-auto mb-6" />

            {/* Emblem with Gold Halo */}
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-[#D9684B] to-[#C89B52] p-0.5 shadow-[0_0_30px_rgba(217,104,75,0.3)]">
              <div className="w-full h-full rounded-[14px] bg-[#FFF9F0] flex items-center justify-center">
                <svg
                  viewBox="0 0 36 36"
                  fill="currentColor"
                  className="w-8 h-8 text-[#D9684B]"
                >
                  <g transform="translate(18,18)">
                    <circle cx="0" cy="0" r="3.2" fill="#D9684B" />
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                      <g key={i} transform={`rotate(${angle})`}>
                        <path
                          d="M -3.2,-5 C -4,-10 0,-14.5 0,-14.5 C 0,-14.5 4,-10 3.2,-5 C 2.5,-1.5 -2.5,-1.5 -3.2,-5 Z"
                          fill="#D9684B"
                          opacity="0.9"
                        />
                        <circle cx="0" cy="-9" r="1.1" fill="#FFF9F0" />
                      </g>
                    ))}
                  </g>
                </svg>
              </div>
            </div>

            <div className="text-xs uppercase font-extrabold tracking-widest text-[#D9684B] mb-2">
              HÀNH TRÌNH KHÉP LẠI • KHÔNG GIAN SÁNG TẠO MỞ RA
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-[#36251D] tracking-tight mb-4">
              VIỆT PHỤC REMIX
            </h1>

            {/* Central Manifesto */}
            <blockquote className="text-sm sm:text-base text-[#5A453A] font-light italic leading-relaxed mb-8 max-w-md mx-auto">
              “Di sản không chỉ để ngắm nhìn.
              <br />
              Di sản có thể tiếp tục sống trong cách chúng ta mặc hôm nay.”
            </blockquote>

            {/* Big Prominent CTA */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEnterStudio();
              }}
              className="w-full sm:w-auto px-9 py-4 rounded-full bg-gradient-to-r from-[#D9684B] via-[#D86343] to-[#B84E32] text-white font-black text-sm sm:text-base tracking-wider shadow-[0_10px_30px_rgba(217,104,75,0.45)] hover:shadow-[0_14px_40px_rgba(217,104,75,0.65)] hover:scale-105 active:scale-95 transition-all cursor-pointer inline-flex items-center justify-center gap-2.5 group border border-white/20"
            >
              <span>BƯỚC VÀO GEN Z STUDIO</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>

            <div className="text-[11px] text-[#7A5848] mt-4 flex items-center justify-center gap-1.5">
              <span>Chạm bất kỳ đâu trên màn hình để bước vào Studio</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
