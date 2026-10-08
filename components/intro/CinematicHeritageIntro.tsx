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

// 4 Heritage Discovery Stations configuration
const STATIONS = [
  {
    id: 1,
    title: "Khám Phá Cổ Phục Việt",
    subtitle: "DÒNG CHẢY DI SẢN NGÀN NĂM",
    description:
      "Tìm hiểu những dòng trang phục truyền thống Việt Nam và khám phá cấu trúc, màu sắc, họa tiết cùng câu chuyện văn hóa phía sau mỗi bộ cổ phục.",
    badge: "01",
    align: "left" as const,
    garments: [
      {
        name: "Áo Nhật Bình",
        dynasty: "Hoàng triều Nhà Nguyễn",
        desc: "Lễ phục cao quý với cổ áo chữ nhật viền ngũ sắc và hoa văn phụng điểu tráng lệ.",
        accent: "#F59E0B",
        tag: "Cung đình Huế",
      },
      {
        name: "Áo Ngũ Thân",
        dynasty: "Thời Nguyễn (1744 - 1945)",
        desc: "Cấu trúc năm thân biểu trưng đạo lý Ngũ Thường, cúc cài bên phải đĩnh đạc.",
        accent: "#1E3A8A",
        tag: "Chuẩn mực quốc phục",
      },
      {
        name: "Áo Dài Truyền Thống",
        dynasty: "Cận đại & Đương đại",
        desc: "Hai tà thướt tha buông rủ thanh lịch, tôn vinh nét uyển chuyển của người Việt.",
        accent: "#DC2626",
        tag: "Biểu tượng Việt Nam",
      },
      {
        name: "Áo Tứ Thân",
        dynasty: "Dân gian Bắc Bộ",
        desc: "Bốn vạt tượng trưng Tứ thân phụ mẫu, kết hợp yếm đào duyên dáng trẩy hội.",
        accent: "#78350F",
        tag: "Hồn cốt Kinh Bắc",
      },
    ],
  },
  {
    id: 2,
    title: "Phối Đồ Cùng AI",
    subtitle: "CULTURAL AI STYLIST",
    description:
      "Để AI gợi ý cách phối cổ phục phù hợp với cá tính, hoàn cảnh và phong cách của bạn, dung hòa di sản và nhịp sống Gen Z.",
    badge: "02",
    align: "right" as const,
    tiers: [
      {
        name: "Cổ Điển (Classic)",
        tag: "Bảo tồn 100%",
        desc: "Giữ trọn vẹn phom dáng, họa tiết và quy thức lễ nghi nguyên bản.",
        colors: ["#1E3A8A", "#F59E0B", "#DC2626"],
      },
      {
        name: "Giao Thoa (Fusion)",
        tag: "Thanh lịch đương đại",
        desc: "Tiết chế chi tiết nặng nề, phối phụ kiện tối giản cho sinh hoạt hằng ngày.",
        colors: ["#047857", "#E07A5F", "#FAF8F5"],
      },
      {
        name: "Gen Z Streetwear",
        tag: "Phá cách cá tính",
        desc: "Kết hợp sneaker chunky, kính râm, túi mini và layer áo khoác hiện đại.",
        colors: ["#8B5CF6", "#EC4899", "#3B82F6"],
      },
    ],
  },
  {
    id: 3,
    title: "Thẩm Định Di Sản",
    subtitle: "HERITAGE PROVENANCE & X-RAY",
    description:
      "Khám phá ý nghĩa của từng chi tiết và kiểm tra mức độ phù hợp của bản phối với các giá trị di sản văn hóa truyền thống.",
    badge: "03",
    align: "left" as const,
    hotspots: [
      {
        title: "Cổ Áo Chữ Nhật",
        category: "Cấu trúc",
        desc: "Quy chuẩn lễ phục triều Nguyễn, bản to vắt ngang ngực uy nghiêm.",
        status: "Đạt chuẩn",
      },
      {
        title: "Họa Tiết Phụng Điểu",
        category: "Ý nghĩa",
        desc: "Thêu chỉ kim tuyến biểu trưng ước vọng thái bình, thịnh trị và đức hạnh.",
        status: "Xác thực",
      },
      {
        title: "Cửa Tay Ngũ Sắc",
        category: "Màu sắc",
        desc: "Biểu trưng Ngũ Hành Kim - Mộc - Thủy - Hỏa - Thổ theo điển chế.",
        status: "Chuẩn xác",
      },
      {
        title: "Bối Cảnh Lịch Sử",
        category: "Nguồn gốc",
        desc: "Tư liệu đối chiếu từ Bảo tàng Lịch sử & Hội đồng Thẩm định Di sản.",
        status: "Tư liệu uy tín",
      },
    ],
  },
  {
    id: 4,
    title: "Tạo Lookbook Của Riêng Bạn",
    subtitle: "EDITORIAL LOOKBOOK & COMMUNITY",
    description:
      "Lưu lại những bản phối yêu thích, xây dựng phong cách cá nhân và chia sẻ cách bạn kể lại di sản Việt Nam theo ngôn ngữ của thế hệ mình.",
    badge: "04",
    align: "right" as const,
    cards: [
      {
        title: "Dạo Phố Thu Hà Nội",
        subtitle: "Áo Nhật Bình & Denim Jeans",
        tags: ["#Streetwear", "#Remix", "#HaNoi"],
        likes: "1.2k",
      },
      {
        title: "Kỷ Yếu Di Sản",
        subtitle: "Áo Ngũ Thân & Chunky Boots",
        tags: ["#KyYeu", "#NguThan", "#GenZ"],
        likes: "2.8k",
      },
      {
        title: "Lễ Hội Trăng Rằm",
        subtitle: "Áo Tứ Thân & Yếm Đào Cách Tân",
        tags: ["#Festival", "#TuThan", "#Art"],
        likes: "3.5k",
      },
    ],
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
      {/* 6. GIAI ĐOẠN 3: HÀNH TRÌNH QUA 4 TRẠM DI SẢN (NGƯỜI DÙNG TỰ CHUYỂN) */}
      {/* ========================================================= */}
      {phase === "traveling" && (
        <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between p-4 sm:p-8">
          {/* Top spacer */}
          <div className="h-16" />

          {/* Central Section: Floating Interactive Exhibit Card */}
          <div className="flex-1 flex items-center justify-center">
            <div
              className={`w-full max-w-2xl pointer-events-auto transition-all duration-700 ease-out transform ${
                currentStation.align === "left"
                  ? "mr-auto md:ml-12 lg:ml-20"
                  : "ml-auto md:mr-12 lg:mr-20"
              }`}
            >
              {/* ========================================================= */}
              {/* PHIẾN BIA ĐÁ VÒM BÚP SEN BÊN HỒ SEN (LOTUS ARCH STELE) */}
              {/* ========================================================= */}
              <div className="relative flex flex-col items-center drop-shadow-[0_30px_90px_rgba(0,0,0,0.85)]">
                {/* 1. TRÁN BIA ĐÁ VÒM BÚP SEN (LOTUS-BUD ARCH PEDIMENT) */}
                <div className="relative w-full max-w-[580px] h-20 sm:h-24 -mb-3 z-20 flex items-center justify-center">
                  <svg
                    viewBox="0 0 600 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.9)]"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="steleStoneTop" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#292524" />
                        <stop offset="45%" stopColor="#1c1917" />
                        <stop offset="100%" stopColor="#0c0a09" />
                      </linearGradient>
                      <linearGradient id="goldCarvingLine" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#B45309" />
                        <stop offset="25%" stopColor="#F59E0B" />
                        <stop offset="50%" stopColor="#FDE68A" />
                        <stop offset="75%" stopColor="#F59E0B" />
                        <stop offset="100%" stopColor="#B45309" />
                      </linearGradient>
                      <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Vòm đỉnh búp sen chạm đá sa thạch */}
                    <path
                      d="M 25,120 C 35,50 150,15 300,5 C 450,15 565,50 575,120 Z"
                      fill="url(#steleStoneTop)"
                      stroke="#78350F"
                      strokeWidth="3.5"
                    />

                    {/* Viền chỉ vàng dát chạm chìm */}
                    <path
                      d="M 40,115 C 55,60 160,26 300,16 C 440,26 545,60 560,115"
                      fill="none"
                      stroke="url(#goldCarvingLine)"
                      strokeWidth="2"
                      opacity="0.9"
                    />

                    {/* Họa tiết Mây Cuộn / Mây Lửa Văn Miếu hai bên trán bia */}
                    <path
                      d="M 120,85 Q 160,50 200,65 T 250,55 M 480,85 Q 440,50 400,65 T 350,55"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      opacity="0.8"
                    />
                    <circle cx="210" cy="65" r="3.2" fill="#F59E0B" opacity="0.9" />
                    <circle cx="390" cy="65" r="3.2" fill="#F59E0B" opacity="0.9" />

                    {/* Búp sen đỉnh trán bia */}
                    <path
                      d="M 300,0 C 290,9 288,15 300,22 C 312,15 310,9 300,0 Z"
                      fill="#F59E0B"
                      filter="url(#goldGlow)"
                    />
                  </svg>

                  {/* Triện Ấn Hoa Sen Số Trạm ở Tâm Trán Bia */}
                  <div className="absolute top-4 sm:top-5 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-amber-800 via-amber-600 to-amber-300 p-0.5 shadow-[0_0_24px_rgba(245,158,11,0.6)]">
                      <div className="w-full h-full rounded-full bg-stone-950 flex items-center justify-center border border-amber-400/50">
                        <span className="text-amber-300 font-black text-sm sm:text-base font-mono tracking-wider drop-shadow-sm">
                          {currentStation.badge}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. THÂN BIA ĐÁ (STELE MAIN BODY - LÒNG BIA) */}
                <div
                  className="relative w-full rounded-2xl sm:rounded-3xl bg-gradient-to-b from-stone-900/95 via-stone-950/98 to-stone-900/95 border-2 border-amber-900/40 p-6 sm:p-8 pt-7 z-10 backdrop-blur-xl"
                  style={{
                    boxShadow:
                      "0 0 0 1px rgba(245, 158, 11, 0.2), 0 25px 70px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)",
                  }}
                >
                  {/* Đường chỉ đá viền đôi khắc chìm */}
                  <div className="absolute inset-2.5 rounded-xl border border-amber-500/20 pointer-events-none" />
                  <div className="absolute inset-3.5 rounded-lg border border-white/5 pointer-events-none" />

                  {/* Hoa văn góc hồi văn chạm mây cổ */}
                  <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-amber-500/60 pointer-events-none" />
                  <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-amber-500/60 pointer-events-none" />
                  <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-amber-500/60 pointer-events-none" />
                  <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-amber-500/60 pointer-events-none" />

                  {/* Header Trán Lòng Bia */}
                  <div className="flex items-center justify-between mb-4 border-b border-amber-500/20 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-[#E07A5F] via-amber-500 to-amber-700" />
                      <div>
                        <div className="text-[10px] uppercase font-bold text-amber-400 tracking-widest flex items-center gap-1.5">
                          <span>{currentStation.subtitle}</span>
                          <span className="text-amber-500/40">•</span>
                          <span className="text-stone-400">VĂN BIA DI SẢN</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-sm">
                          {currentStation.title}
                        </h2>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[9px] uppercase font-bold text-amber-500/80 tracking-wider">
                        KỲ DIỆU VIỆT NAM
                      </div>
                      <span className="text-[11px] text-amber-200 font-mono font-bold px-2 py-0.5 rounded bg-amber-950/60 border border-amber-700/50">
                        0{currentStation.id} / 04
                      </span>
                    </div>
                  </div>

                  {/* Lời đề khắc bia */}
                  <p className="text-xs sm:text-sm text-stone-200/90 leading-relaxed mb-6 font-light italic pl-2.5 border-l-2 border-amber-500/40">
                    “{currentStation.description}”
                  </p>

                  {/* ========================================================= */}
                  {/* STATION 1 SPECIFIC VISUAL: 4 CORE VIETNAMESE GARMENTS */}
                  {/* ========================================================= */}
                  {currentStation.id === 1 && (
                    <div className="space-y-4">
                      {/* Mộc Bản Cổ Phục Selector */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {currentStation.garments?.map((g, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedGarmentIdx(idx);
                            }}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                              selectedGarmentIdx === idx
                                ? "bg-gradient-to-b from-amber-950/50 to-stone-900 border-amber-500 text-white shadow-lg scale-102 ring-1 ring-amber-400/40"
                                : "bg-stone-900/60 border-amber-900/40 text-stone-300 hover:text-white hover:bg-stone-800/80 hover:border-amber-700/50"
                            }`}
                          >
                            <div className="text-xs font-bold truncate leading-tight">
                              {g.name}
                            </div>
                            <div className="text-[10px] text-amber-400/80 mt-0.5 truncate flex items-center gap-1">
                              <span className="w-1 h-1 rounded-full bg-amber-400" />
                              <span>{g.tag}</span>
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Active Garment Spotlight Box */}
                      {currentStation.garments && (
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-stone-900/90 to-stone-950/80 border border-amber-600/30 flex items-start gap-3.5 shadow-md">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                            style={{
                              backgroundColor: `${currentStation.garments[selectedGarmentIdx].accent}25`,
                              border: `1px solid ${currentStation.garments[selectedGarmentIdx].accent}70`,
                            }}
                          >
                            <Compass
                              className="w-5 h-5"
                              style={{
                                color:
                                  currentStation.garments[selectedGarmentIdx].accent,
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-white">
                                {currentStation.garments[selectedGarmentIdx].name}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-200 font-medium border border-amber-600/30">
                                {
                                  currentStation.garments[selectedGarmentIdx]
                                    .dynasty
                                }
                              </span>
                            </div>
                            <p className="text-xs text-stone-300 mt-1.5 leading-relaxed font-light">
                              {currentStation.garments[selectedGarmentIdx].desc}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ========================================================= */}
                  {/* STATION 2 SPECIFIC VISUAL: AI STYLIST REMIX TIERS */}
                  {/* ========================================================= */}
                  {currentStation.id === 2 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {currentStation.tiers?.map((tier, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTierIdx(idx);
                            }}
                            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                              selectedTierIdx === idx
                                ? "bg-gradient-to-b from-amber-950/50 via-stone-900/90 to-stone-950 border-amber-500 text-white shadow-lg scale-102 ring-1 ring-amber-400/40"
                                : "bg-stone-900/60 border-amber-900/40 text-stone-300 hover:text-white hover:bg-stone-800/80 hover:border-amber-700/50"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-white">
                                {tier.name}
                              </span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-200 border border-amber-700/40">
                                {tier.tag}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-300 mb-2.5 line-clamp-2 leading-relaxed">
                              {tier.desc}
                            </p>
                            {/* Color Swatch Dots */}
                            <div className="flex items-center gap-1.5">
                              {tier.colors.map((c, cIdx) => (
                                <div
                                  key={cIdx}
                                  className="w-3.5 h-3.5 rounded-full ring-1 ring-amber-400/40 shadow-xs"
                                  style={{ backgroundColor: c }}
                                />
                              ))}
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* AI Prompt Inscription Preview */}
                      <div className="p-3 rounded-xl bg-stone-900/70 border border-amber-600/30 flex items-center justify-between text-xs text-stone-300">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          <span className="font-mono text-[11px] text-amber-200">
                            “AI: Phối Áo Nhật Bình sắc lục hoàng gia cùng sneaker trắng & kính mát”
                          </span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-600/40">
                          98% Hài Hòa
                        </span>
                      </div>
                    </div>
                  )}

                  {/* ========================================================= */}
                  {/* STATION 3 SPECIFIC VISUAL: HERITAGE X-RAY HOTSPOTS */}
                  {/* ========================================================= */}
                  {currentStation.id === 3 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2.5">
                        {currentStation.hotspots?.map((hp, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedHotspotIdx(idx);
                            }}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              selectedHotspotIdx === idx
                                ? "bg-emerald-950/50 border-emerald-500/80 text-white shadow-md scale-102 ring-1 ring-emerald-400/40"
                                : "bg-stone-900/60 border-amber-900/30 text-stone-300 hover:text-white hover:bg-stone-800/80"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                {hp.title}
                              </span>
                              <span className="text-[9px] text-emerald-300 bg-emerald-500/20 px-1.5 py-0.2 rounded font-semibold border border-emerald-500/30">
                                {hp.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-300 leading-tight">
                              {hp.desc}
                            </p>
                          </button>
                        ))}
                      </div>

                      {/* Cultural Provenance Badge */}
                      <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/70 to-stone-900/80 border border-emerald-500/40 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <ShieldCheck className="w-5 h-5 text-emerald-400" />
                          <div>
                            <div className="text-xs font-bold text-white">
                              Chỉ Số Chuẩn Mực Văn Hóa
                            </div>
                            <div className="text-[10px] text-stone-400">
                              Căn cứ quy chế y phục Hội đồng Khoa học & Lịch sử
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-base font-black text-emerald-400 font-mono">
                            98 / 100
                          </div>
                          <div className="text-[9px] text-emerald-300">
                            Bảo Tồn Tuyệt Đối
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ========================================================= */}
                  {/* STATION 4 SPECIFIC VISUAL: EDITORIAL LOOKBOOK CARDS */}
                  {/* ========================================================= */}
                  {currentStation.id === 4 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {currentStation.cards?.map((card, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-2xl bg-stone-900/70 border border-amber-600/30 backdrop-blur-md hover:border-amber-400/60 transition-all shadow-md group relative overflow-hidden"
                          >
                            <div className="h-20 w-full rounded-xl bg-gradient-to-tr from-stone-950 to-stone-800 border border-amber-600/20 mb-2.5 flex items-center justify-center relative overflow-hidden">
                              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent" />
                              <BookOpen className="w-6 h-6 text-amber-400/70 group-hover:scale-110 transition-transform" />
                              <div className="absolute top-1.5 right-1.5 text-[9px] px-1.5 py-0.5 rounded-full bg-black/60 text-amber-200 font-mono border border-amber-500/30">
                                ♥ {card.likes}
                              </div>
                            </div>
                            <div className="text-xs font-bold text-white truncate">
                              {card.title}
                            </div>
                            <div className="text-[10px] text-amber-300/80 truncate mt-0.5">
                              {card.subtitle}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {card.tags.map((t, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="text-[8px] px-1 py-0.2 rounded bg-amber-950/60 text-amber-200 font-mono border border-amber-700/30"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-3 rounded-xl bg-stone-900/70 border border-amber-600/30 flex items-center justify-between text-xs text-stone-300">
                        <div className="flex items-center gap-2">
                          <Bookmark className="w-4 h-4 text-amber-400" />
                          <span>Lưu & Chia sẻ Lookbook lên TikTok, Instagram</span>
                        </div>
                        <span className="text-[10px] text-amber-300 font-semibold">
                          Sẵn sàng xuất ảnh 4K
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. CHÂN ĐÀI SEN & LÀN NƯỚC HỒ SEN (LOTUS PEDESTAL WITH WATER RIPPLES) */}
                <div className="relative w-full max-w-[580px] -mt-2 z-20 flex flex-col items-center pointer-events-auto">
                  {/* SVG Đài Sen Hai Tầng Chạm Khắc Nổi */}
                  <svg
                    viewBox="0 0 600 70"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-12 sm:h-16 drop-shadow-[0_10px_20px_rgba(0,0,0,0.95)]"
                    preserveAspectRatio="none"
                  >
                    {/* Đài sen tầng trên */}
                    <path
                      d="M 50,0 C 150,15 450,15 550,0 L 530,30 C 440,40 160,40 70,30 Z"
                      fill="#1c1917"
                      stroke="#78350F"
                      strokeWidth="2"
                    />
                    {/* Hàng cánh sen chạm nổi */}
                    {[100, 160, 220, 280, 340, 400, 460, 520].map((cx, i) => (
                      <path
                        key={i}
                        d={`M ${cx - 25},25 C ${cx - 15},6 ${cx + 15},6 ${cx + 25},25 C ${cx + 10},35 ${cx - 10},35 ${cx - 25},25 Z`}
                        fill="#292524"
                        stroke="#D97706"
                        strokeWidth="1.4"
                      />
                    ))}
                    {/* Tầng đáy bệ đá gợn sóng thủy ba */}
                    <path
                      d="M 20,30 C 120,55 480,55 580,30 L 560,65 C 450,75 150,75 40,65 Z"
                      fill="#0c0a09"
                      stroke="#451a03"
                      strokeWidth="2"
                    />
                  </svg>

                  {/* Làn nước hồ sen lăn tăn & nút điều hướng chạm ngọc */}
                  <div className="w-full flex items-center justify-between px-3 sm:px-6 -mt-3.5 z-30">
                    {/* Búp sen & gợn sóng nước bên trái */}
                    <div className="flex items-center gap-1.5 opacity-90 drop-shadow-md">
                      <span className="text-base sm:text-xl">🪷</span>
                      <span className="text-[10px] text-amber-300/80 font-mono tracking-wider hidden sm:inline">
                        HỒ SEN VĂN MIẾU
                      </span>
                    </div>

                    {/* Nút Điều Hướng Kiểu Ngọc Bội Chạm Khắc */}
                    <div className="flex items-center gap-2">
                      {activeStationIndex > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePrevStation();
                          }}
                          className="px-3.5 py-1.5 rounded-full bg-stone-900/90 border border-amber-600/40 hover:border-amber-400 text-stone-200 text-xs font-semibold transition-all flex items-center gap-1 shadow-md hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
                        >
                          <ChevronLeft className="w-3.5 h-3.5 text-amber-400" />
                          <span>Trạm trước</span>
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNextStation();
                        }}
                        className="px-5 py-2 rounded-full bg-gradient-to-r from-[#E07A5F] via-[#D97706] to-[#B45309] text-white text-xs font-black tracking-wide transition-all flex items-center gap-2 shadow-[0_4px_22px_rgba(245,158,11,0.5)] hover:shadow-[0_6px_28px_rgba(245,158,11,0.7)] hover:scale-105 active:scale-95 cursor-pointer border border-amber-200/40 backdrop-blur-md"
                      >
                        <span>
                          {activeStationIndex === STATIONS.length - 1
                            ? "Bước Đến Đích"
                            : `Sang Trạm 0${activeStationIndex + 2}`}
                        </span>
                        <ChevronRight className="w-4 h-4 text-amber-200" />
                      </button>
                    </div>

                    {/* Cánh hoa sen bên phải */}
                    <div className="flex items-center gap-1.5 opacity-90 drop-shadow-md">
                      <span className="text-[10px] text-amber-300/80 font-mono tracking-wider hidden sm:inline">
                        HOÀNG THÀNH THĂNG LONG
                      </span>
                      <span className="text-base sm:text-xl">🌸</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Minimalist Floating Hint At Screen Bottom */}
          <div className="flex items-center justify-center pb-2 pointer-events-none">
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-stone-950/60 backdrop-blur-md border border-white/10 shadow-lg text-xs text-stone-300">
              {/* Subtle story progress dots */}
              <div className="flex items-center gap-1.5">
                {STATIONS.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === activeStationIndex
                        ? "w-6 bg-[#E07A5F]"
                        : "w-1.5 bg-white/30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-stone-500 text-[10px]">•</span>
              <span className="text-[11px] text-stone-300">
                Chạm hoặc click bất kỳ đâu để tiếp tục
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-[#E07A5F] animate-pulse" />
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
            className="max-w-xl w-full p-8 sm:p-10 rounded-3xl bg-stone-950/80 backdrop-blur-xl border border-white/25 shadow-[0_30px_90px_rgba(0,0,0,0.85)] relative overflow-hidden"
          >
            {/* Golden Radiance Aura */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-36 bg-gradient-to-b from-[#E07A5F]/30 to-transparent blur-3xl pointer-events-none" />

            {/* Emblem with Gold Halo */}
            <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-tr from-[#E07A5F] via-[#D86343] to-[#F59E0B] p-1 shadow-[0_0_50px_rgba(224,122,95,0.6)]">
              <div className="w-full h-full rounded-[20px] bg-stone-950 flex items-center justify-center">
                <svg
                  viewBox="0 0 36 36"
                  fill="currentColor"
                  className="w-12 h-12 text-[#F59E0B]"
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

            <div className="text-xs uppercase font-extrabold tracking-widest text-amber-300 mb-2">
              HÀNH TRÌNH KHÉP LẠI • KHÔNG GIAN SÁNG TẠO MỞ RA
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 drop-shadow-md">
              VIỆT PHỤC REMIX
            </h1>

            {/* Central Manifesto */}
            <blockquote className="text-base sm:text-lg text-amber-100 font-light italic leading-relaxed mb-8 max-w-md mx-auto">
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
              className="w-full sm:w-auto px-10 py-4.5 rounded-full bg-gradient-to-r from-[#E07A5F] via-[#D86343] to-[#B84E32] text-white font-black text-base sm:text-lg tracking-wider shadow-[0_12px_45px_rgba(224,122,95,0.6)] hover:shadow-[0_16px_55px_rgba(224,122,95,0.8)] hover:scale-105 active:scale-95 transition-all cursor-pointer inline-flex items-center justify-center gap-3 group border border-white/30"
            >
              <span>BƯỚC VÀO GEN Z STUDIO</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </button>

            <div className="text-[11px] text-stone-400 mt-4 flex items-center justify-center gap-1.5">
              <span>Chạm bất kỳ đâu trên màn hình để bước vào Studio</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
