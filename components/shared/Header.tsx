import React, { useState, useRef, useEffect } from "react";
import {
  Home,
  BookOpen,
  Layers,
  Sparkles,
  ChevronDown,
  Shirt,
  Info,
  Check,
  Compass,
} from "lucide-react";
import garmentsData from "@/data/garments.json" with { type: "json" };

interface HeaderProps {
  garmentId?: string;
  onSelectGarment?: (id: string) => void;
  onOpenLookbook?: () => void;
  onOpenLibrary?: () => void;
  onOpenAbout?: () => void;
  onOpenIntro?: () => void;
  activeNav?: string;
  onNavClick?: (nav: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  garmentId = "garment_nhatbinh_01",
  onSelectGarment,
  onOpenLookbook,
  onOpenLibrary,
  onOpenAbout,
  onOpenIntro,
  activeNav = "home",
  onNavClick,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const garments = garmentsData as any[];
  const currentGarment = garments.find((g) => g.id === garmentId) || garments[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 w-full bg-white/95 backdrop-blur-md border-b border-stone-200/80 sticky top-0 z-40 select-none shadow-[0_2px_12px_rgba(0,0,0,0.03)] shrink-0">
      <div className="max-w-[1780px] h-full mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* LEFT: TRADITIONAL LOGO & BRANDING */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Traditional Rosette Lotus Emblem */}
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[#E07A5F] bg-[#E07A5F]/10 border border-[#E07A5F]/20 shadow-xs">
            <svg
              viewBox="0 0 36 36"
              fill="currentColor"
              className="w-7 h-7 text-[#E07A5F]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g transform="translate(18,18)">
                {/* 8-Petal Vietnamese Rosette Mandala Motif */}
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

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-tight text-stone-900 leading-tight">
                VIỆT PHỤC REMIX
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-[#E07A5F] text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                GEN Z STUDIO
              </span>
            </div>
            <p className="text-[11px] text-stone-500 leading-tight font-normal">
              AI Cultural Stylist • Phối Trang Phục Truyền Thống Đương Đại
            </p>
          </div>
        </div>

        {/* CENTER: LIGHTWEIGHT NAVIGATION */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-xs font-semibold text-stone-600">
          <button
            onClick={() => onNavClick?.("home")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer relative ${
              activeNav === "home"
                ? "text-[#E07A5F] font-bold"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/70"
            }`}
          >
            <Home className="w-4 h-4 text-[#E07A5F]" />
            <span>Trang chủ</span>
            {activeNav === "home" && (
              <span className="absolute bottom-0 inset-x-3 h-0.5 bg-[#E07A5F] rounded-full" />
            )}
          </button>

          <button
            onClick={() => {
              onNavClick?.("lookbook");
              onOpenLookbook?.();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-100/70 transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-stone-500" />
            <span>Lookbook</span>
          </button>

          <button
            onClick={() => {
              onNavClick?.("library");
              onOpenLibrary?.();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-100/70 transition-all cursor-pointer"
          >
            <Layers className="w-4 h-4 text-stone-500" />
            <span>Thư viện</span>
          </button>

          <button
            onClick={() => {
              onNavClick?.("about");
              onOpenAbout?.();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-100/70 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-stone-500" />
            <span>Về dự án</span>
          </button>

          <button
            onClick={() => onOpenIntro?.()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-stone-700 hover:text-[#E07A5F] hover:bg-[#E07A5F]/10 transition-all cursor-pointer group font-medium"
            title="Trải nghiệm lại Cổng Di Sản Cinematic"
          >
            <Compass className="w-4 h-4 text-[#E07A5F] group-hover:rotate-45 transition-transform" />
            <span>Cổng Di Sản</span>
          </button>
        </nav>

        {/* RIGHT: GARMENT DROPDOWN & USER AVATAR */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Active Garment Interactive Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200/70 border border-stone-200 text-stone-800 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            >
              <Shirt className="w-3.5 h-3.5 text-[#E07A5F]" />
              <span className="max-w-[150px] sm:max-w-[190px] truncate">
                {currentGarment.name.split(" (")[0]}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-stone-500 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white border border-stone-200 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100">
                  Chọn Cổ Phục
                </div>
                {garments.map((g) => {
                  const isSelected = g.id === garmentId;
                  return (
                    <button
                      key={g.id}
                      onClick={() => {
                        onSelectGarment?.(g.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 flex items-center justify-between text-left transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-[#E07A5F]/10 text-[#E07A5F] font-bold"
                          : "text-stone-700 hover:bg-stone-50"
                      }`}
                    >
                      <div>
                        <div className="text-xs font-semibold leading-tight">
                          {g.name.split(" (")[0]}
                        </div>
                        <div className="text-[10px] text-stone-400 mt-0.5">
                          {g.dynasty.split(" (")[0]}
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#E07A5F]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="w-9 h-9 rounded-full ring-2 ring-[#E07A5F]/30 p-0.5 overflow-hidden shadow-xs cursor-pointer hover:ring-[#E07A5F] transition-all">
            <img
              src="/images/avatar_profile.jpg"
              alt="Gen Z Stylist Profile"
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                // Fallback to stylized SVG avatar if image fails
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
