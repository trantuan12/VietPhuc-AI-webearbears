import React from "react";
import { OutfitConfig, ViewAngle } from "@/types/studio";
import { TargetVisual } from "@/types/culture";

export type ModelGender = "female" | "male";

interface AnimeFashionAvatarProps {
  gender: ModelGender;
  garmentId: string;
  outfitConfig: OutfitConfig;
  showXRay: boolean;
  selectedTargetVisual: TargetVisual | null;
  onSelectHotspot: (targetVisual: TargetVisual, anchorIds: string[]) => void;
  visualState: Record<TargetVisual, string>;
  viewAngle?: ViewAngle;
  idPrefix?: string;
}

export const AnimeFashionAvatar: React.FC<AnimeFashionAvatarProps> = ({
  gender,
  garmentId,
  outfitConfig,
  showXRay,
  selectedTargetVisual,
  onSelectHotspot,
  visualState,
  viewAngle = "front",
  idPrefix,
}) => {
  const generatedId = React.useId().replace(/:/g, "_");
  const p = idPrefix ? `${idPrefix}_` : `${generatedId}_`;

  // FIX: Chromium resolves url(#id) relative to the document base URL.
  // On sub-routes like /dashbroad, url(#id) silently fails because the browser
  // looks for the fragment at "/dashbroad#id" instead of the current page.
  // Using absolute URLs (e.g., url(https://host/dashbroad#id)) fixes this.
  // Must be synchronous (useMemo, not useEffect) to work on the first render.
  const svgBaseUrl = React.useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.href.split("#")[0].split("?")[0];
  }, []);
  const u = (id: string) => svgBaseUrl ? `url(${svgBaseUrl}#${id})` : `url(#${id})`;
  // Garment Identity
  const isNhatBinh = garmentId === "garment_nhatbinh_01";
  const isTuThan = garmentId === "garment_tuthan_01";
  const isAoDai = garmentId === "garment_aodai_01";
  const isNguThan = garmentId === "garment_nguthan_01" || (!isNhatBinh && !isTuThan && !isAoDai);

  // Colors
  const bodyColor = outfitConfig?.colors?.body || (isNhatBinh ? "#047857" : isTuThan ? "#78350F" : isAoDai ? "#DC2626" : "#1E3A8A");
  const collarColor = outfitConfig?.colors?.collar || (isNhatBinh ? "#F59E0B" : "#FFFFFF");
  const pantsColor = outfitConfig?.colors?.pants || (isTuThan ? "#0F172A" : "#FFFFFF");
  const innerColor = outfitConfig?.colors?.inner || (isTuThan ? "#E11D48" : "#FFFFFF");
  const beltColor = outfitConfig?.colors?.belt || (isTuThan ? "#0284C7" : "#F59E0B");

  const accessories = outfitConfig?.accessories || [];

  // Footwear
  const hasCombatBoot = accessories.includes("shoe_boot_combat_01");
  const hasSneaker = accessories.includes("shoe_sneaker_white_01");
  const hasGuocMoc = accessories.includes("shoe_guoc_moc_01");
  const hasLoafer = accessories.includes("shoe_loafer_chunky_01");
  const hasHaiTheu = accessories.includes("shoe_hai_theu_01");

  // Headwear
  const hasKhanDong = accessories.includes("head_khan_dong_01");
  const hasCap = accessories.includes("head_cap_01");
  const hasKinhRam = accessories.includes("head_kinh_ram_01");
  const hasKhanMoQua = accessories.includes("head_khan_mo_qua_01") || (isTuThan && !accessories.some((a) => a.startsWith("head_")));
  const hasNonQuaiThao = accessories.includes("head_non_quai_thao_01");
  const hasTramCai = accessories.includes("head_tram_cai_01");

  // Jewelry & Waist
  const hasKiengBac = accessories.includes("acc_kieng_bac_01");
  const hasNgocBoi = accessories.includes("acc_ngoc_boi_01") || (isNhatBinh && !accessories.includes("acc_tote_canvas_01"));

  // Handheld & Bags
  const hasQuatLua = accessories.includes("acc_quat_lua_01");
  const hasTote = accessories.includes("acc_tote_canvas_01");

  const isFemale = gender === "female";

  // Motifs
  const motifs = outfitConfig?.motifs || [];
  const hasExplicitMotifs = motifs.length > 0;

  const hasBlackClouds = motifs.includes("cloud_black") || (motifs.includes("cloud_swirl") && (outfitConfig?.pattern === "anime" || outfitConfig?.pattern === "van_may_den"));
  const hasGoldenLeaves = motifs.includes("golden_leaves") || motifs.includes("falling_leaves");
  const hasDragon = motifs.includes("dragon") || (!hasExplicitMotifs && (isNguThan || (!isFemale && isNhatBinh)));
  const hasPeachBlossom = motifs.includes("peach_blossom");
  const hasPhoenix = motifs.includes("phoenix") || (!hasExplicitMotifs && isNhatBinh && isFemale);
  const hasCrane = motifs.includes("crane");
  const hasLotus = motifs.includes("lotus");
  const hasTuQuy = motifs.includes("tu_quy");
  const hasSword = motifs.includes("sword_legend");
  const hasTree = motifs.includes("pine_bamboo");
  const hasFittedWaist = motifs.includes("fitted_waist");
  const hasCloudSwirl = motifs.includes("cloud_swirl") || (!hasExplicitMotifs && !isNhatBinh && !isNguThan);

  // Stickers
  const stickers = outfitConfig?.stickers || [];
  const hasCyberBadge = stickers.includes("cyber_badge");
  const hasGenzStar = stickers.includes("genz_star");
  const hasVietTag = stickers.includes("viet_tag");
  const hasLightningPin = stickers.includes("lightning_pin");
  const hasRetroSmile = stickers.includes("retro_smile");
  const hasBarcode = stickers.includes("barcode_tag");

  return (
    <svg
      viewBox="0 -50 460 790"
      preserveAspectRatio="xMidYMid meet"
      style={{ maxHeight: "100%", height: "100%", width: "auto", display: "block" }}
      className="h-full w-auto max-h-full max-w-full drop-shadow-[0_20px_45px_rgba(224,122,95,0.18)] filter select-none transition-all duration-300 mx-auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* ===================================================================
            2.5D SHADOW & LIGHTING FILTERS
        ==================================================================== */}
        <filter id={`${p}shadow25d`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3.5" stdDeviation="3.5" floodColor="#0F172A" floodOpacity="0.22" />
        </filter>
        <filter id={`${p}softShadow25d`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0F172A" floodOpacity="0.14" />
        </filter>
        <filter id={`${p}glow25d`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Dynamic fabric gradients with 2.5D silk luster */}
        <linearGradient id={`${p}animeBodyGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={bodyColor} stopOpacity="1" />
          <stop offset="50%" stopColor={bodyColor} stopOpacity="0.94" />
          <stop offset="100%" stopColor={bodyColor} stopOpacity="0.82" />
        </linearGradient>

        <linearGradient id={`${p}animeBodyHighlight`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.22" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.15" />
        </linearGradient>

        <linearGradient id={`${p}animeCollarGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={collarColor} stopOpacity="1" />
          <stop offset="100%" stopColor={collarColor} stopOpacity="0.88" />
        </linearGradient>

        <linearGradient id={`${p}innerYemGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={innerColor} stopOpacity="1" />
          <stop offset="70%" stopColor={innerColor} stopOpacity="0.95" />
          <stop offset="100%" stopColor={innerColor} stopOpacity="0.8" />
        </linearGradient>

        <linearGradient id={`${p}beltGrad`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={beltColor} stopOpacity="0.9" />
          <stop offset="50%" stopColor={beltColor} stopOpacity="1" />
          <stop offset="100%" stopColor={beltColor} stopOpacity="0.75" />
        </linearGradient>

        <linearGradient id={`${p}animePantsGrad`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={pantsColor} stopOpacity="0.95" />
          <stop offset="50%" stopColor={pantsColor} stopOpacity="1" />
          <stop offset="100%" stopColor={pantsColor} stopOpacity="0.85" />
        </linearGradient>

        {/* Anime Skin Tones */}
        <radialGradient id={`${p}femaleSkinGrad`} cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFF9F5" />
          <stop offset="70%" stopColor="#FFEEDD" />
          <stop offset="100%" stopColor="#FCD5CE" />
        </radialGradient>

        <radialGradient id={`${p}maleSkinGrad`} cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFF5EB" />
          <stop offset="75%" stopColor="#FDE2CD" />
          <stop offset="100%" stopColor="#F4C2A5" />
        </radialGradient>

        {/* Hair Gradients */}
        <linearGradient id={`${p}femaleHairGrad`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2A1B35" />
          <stop offset="45%" stopColor="#3F2B56" />
          <stop offset="100%" stopColor="#1B0F24" />
        </linearGradient>

        <linearGradient id={`${p}maleHairGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="50%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>

        {/* Eye Gradients */}
        <linearGradient id={`${p}femaleEyeGrad`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1E1B4B" />
          <stop offset="50%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#F472B6" />
        </linearGradient>

        <linearGradient id={`${p}maleEyeGrad`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="45%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>

        {/* Metallic & Shimmer Gradients */}
        <linearGradient id={`${p}goldShimmer`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        <linearGradient id={`${p}silverShimmer`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#CBD5E1" />
          <stop offset="75%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>

        <linearGradient id={`${p}jadeShimmer`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A7F3D0" />
          <stop offset="50%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#065F46" />
        </linearGradient>

        {/* Holographic Chrome Gradient for Y2K badges */}
        <linearGradient id={`${p}holoChrome`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="35%" stopColor="#F472B6" />
          <stop offset="70%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#34D399" />
        </linearGradient>

        {/* Five-color Imperial Ribbon for Nhat Binh */}
        <linearGradient id={`${p}nhatBinhColors`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#DC2626" />
          <stop offset="25%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#FFFFFF" />
          <stop offset="75%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>

        {/* -------------------------------------------------------------
            SILHOUETTE CLIP PATHS FOR SEAMLESS 2.5D GARMENT DRAPING
        -------------------------------------------------------------- */}
        <clipPath id={`${p}robeFrontClipFemale`}>
          <path d="M 185 145 Q 195 240 190 310 Q 170 425 156 575 Q 230 585 304 575 Q 290 425 270 310 Q 265 240 275 145 Z" />
        </clipPath>
        <clipPath id={`${p}robeFrontClipMale`}>
          <path d="M 148 145 L 168 325 L 140 580 Q 230 592 320 580 L 292 325 L 312 145 Z" />
        </clipPath>
        <clipPath id={`${p}robeSideClipFemale`}>
          <path d="M 205 145 Q 240 230 235 310 Q 220 425 210 575 Q 260 582 295 572 Q 285 425 270 310 Q 265 230 260 145 Z" />
        </clipPath>
        <clipPath id={`${p}robeSideClipMale`}>
          <path d="M 185 145 L 235 325 L 210 580 Q 275 588 315 578 L 292 325 L 290 145 Z" />
        </clipPath>
        <clipPath id={`${p}robeBackClipFemale`}>
          <path d="M 185 145 Q 195 240 190 310 Q 170 425 156 575 Q 230 585 304 575 Q 290 425 270 310 Q 265 240 275 145 Z" />
        </clipPath>
        <clipPath id={`${p}robeBackClipMale`}>
          <path d="M 148 145 L 168 325 L 140 580 Q 230 592 320 580 L 292 325 L 312 145 Z" />
        </clipPath>

        {/* Thủy Ba Wave & Embroidery Gradients */}
        <linearGradient id={`${p}thuyBaWavesGrad1`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0F766E" />
          <stop offset="30%" stopColor="#0D9488" />
          <stop offset="70%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id={`${p}thuyBaWavesGrad2`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="45%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id={`${p}lotusPetalGrad`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF1F2" />
          <stop offset="40%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#BE185D" />
        </linearGradient>
        <linearGradient id={`${p}blackCloudGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#27272A" />
          <stop offset="45%" stopColor="#18181B" />
          <stop offset="100%" stopColor="#09090B" />
        </linearGradient>
        <linearGradient id={`${p}crimsonGlow`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="50%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#991B1B" />
        </linearGradient>
        <linearGradient id={`${p}goldenLeafGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="40%" stopColor="#FBBF24" />
          <stop offset="80%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id={`${p}autumnAmberGrad`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>

        {/* Đoàn Long Bổ Phục (Round Royal Dragon Medallion on chest for Male Court Robe) */}
        <g id={`${p}maleDragonChestRoundMedallion`}>
          <circle cx="230" cy="225" r="32" fill="none" stroke="#F59E0B" strokeWidth="3" opacity="0.95" />
          <circle cx="230" cy="225" r="28" fill="none" stroke="#FEF08A" strokeWidth="1" strokeDasharray="3,3" />
          <circle cx="230" cy="225" r="26" fill="rgba(180, 83, 9, 0.25)" />
          {/* Swirling dragon emblem */}
          <path
            d="M 230 205 C 245 205 252 216 248 228 C 244 240 228 244 220 236 C 214 230 215 220 224 218 C 230 216 235 222 232 226"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <circle cx="230" cy="207" r="4" fill="#F59E0B" />
          <circle cx="232" cy="206" r="1.2" fill="#DC2626" />
          <path d="M 210 225 Q 204 220 208 214" stroke="#EF4444" strokeWidth="1.8" fill="none" />
          <path d="M 250 225 Q 256 220 252 214" stroke="#EF4444" strokeWidth="1.8" fill="none" />
          <path d="M 230 245 Q 230 252 224 250" stroke="#EF4444" strokeWidth="1.8" fill="none" />
        </g>

        {/* Đai Ngọc Triều Nguyễn (Imperial Jade Belt for Male Court Robe) */}
        <g id={`${p}maleJadeBeltUnit`}>
          <rect x="175" y="322" width="110" height="15" rx="3" fill="#B45309" stroke="#F59E0B" strokeWidth="2" />
          <rect x="182" y="324" width="14" height="11" rx="1.5" fill="#047857" stroke="#FDE047" strokeWidth="0.8" />
          <rect x="202" y="324" width="14" height="11" rx="1.5" fill="#047857" stroke="#FDE047" strokeWidth="0.8" />
          <rect x="222" y="323" width="16" height="13" rx="2" fill="#047857" stroke="#FDE047" strokeWidth="1.2" />
          <rect x="244" y="324" width="14" height="11" rx="1.5" fill="#047857" stroke="#FDE047" strokeWidth="0.8" />
          <rect x="264" y="324" width="14" height="11" rx="1.5" fill="#047857" stroke="#FDE047" strokeWidth="0.8" />
        </g>

        {/* -------------------------------------------------------------
            AUTHENTIC HIGH-DETAIL CULTURAL MOTIFS (FULL-LENGTH DRAPE)
        -------------------------------------------------------------- */}
        {/* 1. THỦY BA SÓNG NƯỚC & TAM SƠN HOÀNG GIA (ROYAL HEM WAVE UNIT) */}
        <g id={`${p}thuyBaHemUnit`}>
          {/* Subtle water aura */}
          <ellipse cx="0" cy="35" rx="88" ry="24" fill="rgba(6, 182, 212, 0.12)" />
          {/* Base wave arches */}
          <g fill="none" stroke={u(`${p}thuyBaWavesGrad1`)} strokeWidth="3" opacity="0.9">
            <path d="M -85 50 Q -65 32 -45 50 Q -25 32 0 50 Q 25 32 45 50 Q 65 32 85 50" />
            <path d="M -85 44 Q -65 26 -45 44 Q -25 26 0 44 Q 25 26 45 44 Q 65 26 85 44" stroke="#F59E0B" strokeWidth="1.8" />
            <path d="M -75 36 Q -55 20 -35 36 Q -15 20 5 36 Q 25 20 45 36 Q 65 20 85 36" stroke={u(`${p}thuyBaWavesGrad2`)} strokeWidth="2.2" />
            <path d="M -65 28 Q -45 14 -25 28 Q -5 14 15 28 Q 35 14 55 28 Q 75 14 95 28" stroke="#F59E0B" strokeWidth="1.4" />
          </g>
          {/* Wave rolling crests (sóng cuộn tròn) */}
          <g fill="#F59E0B" opacity="0.85">
            <circle cx="-65" cy="32" r="3" />
            <circle cx="-25" cy="32" r="3" />
            <circle cx="15" cy="32" r="3" />
            <circle cx="55" cy="32" r="3" />
            <circle cx="-45" cy="22" r="2.2" />
            <circle cx="-5" cy="22" r="2.2" />
            <circle cx="35" cy="22" r="2.2" />
            <circle cx="75" cy="22" r="2.2" />
          </g>
          {/* Tam Sơn (Three Sacred Mountain Peaks) at center */}
          <g transform="translate(0, 18)">
            {/* Center Highest Peak */}
            <path d="M 0 -18 L 10 24 L -10 24 Z" fill="#047857" stroke="#F59E0B" strokeWidth="1.5" />
            <line x1="0" y1="-18" x2="0" y2="24" stroke="#F59E0B" strokeWidth="1" />
            {/* Left Peak */}
            <path d="M -12 -6 L -4 24 L -20 24 Z" fill="#065F46" stroke="#F59E0B" strokeWidth="1.2" />
            {/* Right Peak */}
            <path d="M 12 -6 L 20 24 L 4 24 Z" fill="#065F46" stroke="#F59E0B" strokeWidth="1.2" />
            <circle cx="0" cy="-21" r="2" fill="#FEF08A" />
          </g>
          {/* Sea spray pearls */}
          <circle cx="-38" cy="12" r="1.5" fill="#FFFFFF" opacity="0.9" />
          <circle cx="-18" cy="6" r="1.5" fill="#FFFFFF" opacity="0.9" />
          <circle cx="18" cy="6" r="1.5" fill="#FFFFFF" opacity="0.9" />
          <circle cx="38" cy="12" r="1.5" fill="#FFFFFF" opacity="0.9" />
        </g>

        {/* 2. RỒNG BAY THỦY BA HOÀNG GIA (FULL-LENGTH DRAGON & WAVES) */}
        <g id={`${p}dragonImperialFull`}>
          {/* Thủy Ba Hem Waves at lower skirt */}
          <g transform="translate(230, 528)">
            <use href={`#${p}thuyBaHemUnit`} />
          </g>
          {/* Serpentine Dragon Body (Curves dynamically from chest to waist to skirt) */}
          <path
            d="M 245 168 C 265 190 262 230 236 250 C 205 272 195 315 212 355 C 230 395 264 425 252 475 C 242 510 226 525 232 540"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="11"
            strokeLinecap="round"
          />
          {/* Golden scales shimmer center stripe */}
          <path
            d="M 245 168 C 265 190 262 230 236 250 C 205 272 195 315 212 355 C 230 395 264 425 252 475 C 242 510 226 525 232 540"
            fill="none"
            stroke="#FEF08A"
            strokeWidth="3.5"
            strokeDasharray="4,4"
          />
          {/* Dorsal Fire Fins (Vi Lưng bốc lửa) */}
          <path
            d="M 252 185 Q 268 180 260 200 Q 274 212 255 228 M 222 265 Q 198 275 210 292 Q 192 312 208 335 M 230 375 Q 252 385 242 410 Q 270 430 256 455"
            fill="none"
            stroke="#EF4444"
            strokeWidth="2.4"
            strokeLinecap="round"
          />

          {/* DRAGON HEAD AT CHEST (x=245, y=165) */}
          <g transform="translate(245, 165)">
            {/* Dragon skull & jaw */}
            <ellipse cx="0" cy="0" rx="15" ry="11" fill="#F59E0B" />
            {/* Horns / Antlers (Sừng gạc vàng) */}
            <path d="M 2 -8 L -6 -24 L -1 -26 L 6 -11" fill="#FEF08A" stroke="#78350F" strokeWidth="0.8" />
            <path d="M 8 -8 L 14 -25 L 19 -23 L 13 -10" fill="#FEF08A" stroke="#78350F" strokeWidth="0.8" />
            {/* Fierce Eye */}
            <circle cx="3" cy="-2" r="3.2" fill="#10B981" stroke="#064E3B" strokeWidth="0.8" />
            <circle cx="4" cy="-3" r="1.2" fill="#FFFFFF" />
            {/* Whiskers (Râu rồng uốn lượn) */}
            <path d="M 9 2 Q 26 0 38 -8" fill="none" stroke="#FEF08A" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M 8 6 Q 28 8 40 18" fill="none" stroke="#FEF08A" strokeWidth="1.8" strokeLinecap="round" />
            {/* Open Jaws & Flaming Sun Pearl (Hỏa Châu) */}
            <g transform="translate(22, 0)">
              <circle cx="0" cy="0" r="7" fill="#EF4444" stroke="#FEF08A" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="3" fill="#FEF08A" />
              {/* Pearl flames */}
              <path d="M 0 -9 Q 8 0 0 9 Q -8 0 0 -9" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
              <path d="M -9 0 Q 0 -8 9 0 Q 0 8 -9 0" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
            </g>
          </g>

          {/* FRONT TALONS / CLAWS 1 (At waist x=200, y=280) */}
          <g transform="translate(202, 280)">
            <path d="M 0 0 L -12 -6 M 0 2 L -14 2 M 0 4 L -11 9 M 0 -2 L -9 -11" stroke="#F59E0B" strokeWidth="2.8" strokeLinecap="round" />
            <circle cx="-13" cy="2" r="2" fill="#EF4444" />
          </g>

          {/* LOWER TALONS / CLAWS 2 (At lower skirt x=256, y=430) */}
          <g transform="translate(256, 430)">
            <path d="M 0 0 L 12 -6 M 0 2 L 14 2 M 0 4 L 11 9 M 0 -2 L 9 -11" stroke="#F59E0B" strokeWidth="2.8" strokeLinecap="round" />
            <circle cx="13" cy="2" r="2" fill="#EF4444" />
          </g>

          {/* DRAGON TAIL PLUMES (Above water x=232, y=525) */}
          <g transform="translate(232, 525)">
            <path d="M 0 0 Q -15 -15 -8 -30 Q 0 -15 0 0" fill="#F59E0B" stroke="#EF4444" strokeWidth="1" />
            <path d="M 0 0 Q 15 -15 8 -30 Q 0 -15 0 0" fill="#F59E0B" stroke="#EF4444" strokeWidth="1" />
          </g>

          {/* Floating Auspicious Clouds along body */}
          <use href={`#${p}cloudSwirl`} x="180" y="210" transform="scale(0.85)" />
          <use href={`#${p}cloudSwirl`} x="235" y="330" transform="scale(0.9)" />
          <use href={`#${p}cloudSwirl`} x="175" y="440" transform="scale(0.8)" />
        </g>

        {/* 3. PHỤNG VŨ NGHÊ THƯỜNG (FULL-LENGTH PHOENIX & 5 CASCADING PLUMES) */}
        <g id={`${p}phoenixImperialFull`}>
          {/* Subtle Hem Waves & Lotus Base */}
          <g transform="translate(230, 532)">
            <use href={`#${p}thuyBaHemUnit`} />
          </g>

          {/* PHOENIX HEAD & WINGS (Chest region y=160..250) */}
          <g transform="translate(230, 185)">
            {/* Phoenix Head */}
            <ellipse cx="0" cy="-22" rx="9" ry="7" fill="#F59E0B" />
            <path d="M 6 -24 L 16 -23 L 9 -18 Z" fill="#EF4444" />
            <circle cx="2" cy="-24" r="2" fill="#047857" />
            {/* Crown Feathers (Tam Quan Mao) */}
            <path d="M -3 -27 Q -10 -42 -4 -46" stroke="#F59E0B" strokeWidth="1.8" fill="none" />
            <circle cx="-4" cy="-46" r="2.5" fill="#EF4444" stroke="#F59E0B" strokeWidth="0.8" />
            <path d="M 0 -28 Q 0 -45 6 -48" stroke="#F59E0B" strokeWidth="1.8" fill="none" />
            <circle cx="6" cy="-48" r="2.5" fill="#10B981" stroke="#F59E0B" strokeWidth="0.8" />
            <path d="M 3 -27 Q 8 -42 14 -44" stroke="#F59E0B" strokeWidth="1.8" fill="none" />
            <circle cx="14" cy="-44" r="2.5" fill="#EF4444" stroke="#F59E0B" strokeWidth="0.8" />
            {/* Outspread Imperial Wings */}
            <path d="M -6 -16 C -28 -30 -55 -10 -38 15 C -25 32 -10 22 -4 14" fill="#F59E0B" stroke="#DC2626" strokeWidth="1.2" opacity="0.9" />
            <path d="M 6 -16 C 28 -30 55 -10 38 15 C 25 32 10 22 4 14" fill="#F59E0B" stroke="#DC2626" strokeWidth="1.2" opacity="0.9" />
            {/* Center Imperial Peony Medallion on breast */}
            <circle cx="0" cy="5" r="9" fill="#DC2626" stroke="#F59E0B" strokeWidth="1.5" />
            <circle cx="0" cy="5" r="4" fill="#FEF08A" />
          </g>

          {/* FIVE MAGNIFICENT CASCADING TAIL PLUMES (NGŨ SẮC PHỤNG VĨ) */}
          {/* Plume 1: Far Left (Crimson & Gold) sweeping to y=520 */}
          <path
            d="M 222 225 C 200 280 180 370 178 460 C 176 500 182 530 180 545"
            fill="none"
            stroke="#DC2626"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <circle cx="178" cy="460" r="4.5" fill="#FEF08A" stroke="#DC2626" strokeWidth="1.2" />
          <circle cx="180" cy="545" r="4" fill="#10B981" stroke="#F59E0B" strokeWidth="1.2" />

          {/* Plume 2: Left Center (Emerald Jade & Gold) cascading to y=560 */}
          <path
            d="M 226 228 C 214 290 200 380 204 465 C 206 515 204 545 205 565"
            fill="none"
            stroke="#059669"
            strokeWidth="3.8"
            strokeLinecap="round"
          />
          <circle cx="204" cy="465" r="5" fill="#EF4444" stroke="#F59E0B" strokeWidth="1.2" />
          <circle cx="205" cy="565" r="4.2" fill="#FEF08A" stroke="#065F46" strokeWidth="1.2" />

          {/* Plume 3: Imperial Center Main Plume (Pure Imperial Gold) down the spine to y=575 */}
          <path
            d="M 230 230 C 230 295 228 385 232 460 C 234 505 228 545 230 575"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="4.8"
            strokeLinecap="round"
          />
          <circle cx="230" cy="350" r="5" fill="#DC2626" stroke="#F59E0B" strokeWidth="1.4" />
          <circle cx="232" cy="460" r="6" fill="#10B981" stroke="#F59E0B" strokeWidth="1.5" />
          <circle cx="230" cy="572" r="5" fill="#EF4444" stroke="#F59E0B" strokeWidth="1.4" />

          {/* Plume 4: Right Center (Royal Sapphire & Gold) cascading to y=560 */}
          <path
            d="M 234 228 C 246 290 260 380 256 465 C 254 515 256 545 255 565"
            fill="none"
            stroke="#2563EB"
            strokeWidth="3.8"
            strokeLinecap="round"
          />
          <circle cx="256" cy="465" r="5" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1.2" />
          <circle cx="255" cy="565" r="4.2" fill="#FEF08A" stroke="#1E40AF" strokeWidth="1.2" />

          {/* Plume 5: Far Right (Amethyst Magenta & Gold) sweeping to y=545 */}
          <path
            d="M 238 225 C 260 280 280 370 282 460 C 284 500 278 530 280 545"
            fill="none"
            stroke="#DB2777"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <circle cx="282" cy="460" r="4.5" fill="#10B981" stroke="#F59E0B" strokeWidth="1.2" />
          <circle cx="280" cy="545" r="4" fill="#FEF08A" stroke="#BE185D" strokeWidth="1.2" />

          {/* Golden stardust and floating auspicious flower petals */}
          <circle cx="218" cy="305" r="2.2" fill="#FEF08A" />
          <circle cx="242" cy="315" r="2.2" fill="#FEF08A" />
          <circle cx="214" cy="410" r="2" fill="#FEF08A" />
          <circle cx="246" cy="415" r="2" fill="#FEF08A" />
        </g>

        {/* 3. CÀNH ĐÀO / HOA MAI DỌC SUỐT TÀ ÁO (FULL-LENGTH BLOSSOM CASCADE) */}
        <g id={`${p}peachBlossomFull`}>
          {/* Main Gnarled Ancient Branch (Lão Mai sweeping from shoulder to hem) */}
          <path
            d="M 265 145 C 245 175 220 215 214 245 C 205 285 190 320 200 370 C 212 420 248 450 240 500 C 232 540 195 550 185 570"
            fill="none"
            stroke="#78350F"
            strokeWidth="3.8"
            strokeLinecap="round"
          />
          {/* Bark texture & gold highlight */}
          <path
            d="M 263 147 C 243 177 218 217 212 247 C 203 287 188 322 198 372 C 210 422 246 452 238 502"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="1.2"
            strokeDasharray="8,6"
          />

          {/* Secondary shoots and branchlets */}
          {/* Upper chest branchlet */}
          <path d="M 238 185 Q 212 178 198 190" fill="none" stroke="#78350F" strokeWidth="2.4" strokeLinecap="round" />
          {/* Waist branchlet */}
          <path d="M 206 295 Q 235 305 255 315" fill="none" stroke="#78350F" strokeWidth="2.2" strokeLinecap="round" />
          {/* Mid-tà branchlet */}
          <path d="M 220 405 Q 185 425 175 450" fill="none" stroke="#78350F" strokeWidth="2.2" strokeLinecap="round" />
          {/* Lower-tà branchlet */}
          <path d="M 242 470 Q 268 490 272 525" fill="none" stroke="#78350F" strokeWidth="2.4" strokeLinecap="round" />

          {/* DENSE BLOSSOM CLUSTERS FROM TOP TO HEM */}
          {/* Shoulder & Upper Chest (y=145..220) */}
          <g transform="translate(265, 145)"><use href={`#${p}singleBlossom`} transform="scale(1.2)" /></g>
          <g transform="translate(248, 165)"><use href={`#${p}singleBlossom`} transform="scale(1.1)" /></g>
          <g transform="translate(225, 180)"><use href={`#${p}singleBlossom`} transform="scale(1.3)" /></g>
          <g transform="translate(196, 190)"><use href={`#${p}singleBlossom`} transform="scale(1)" /></g>
          <g transform="translate(235, 195)"><use href={`#${p}singleBlossom`} transform="scale(0.85)" /></g>

          {/* Chest & Waist (y=220..330) */}
          <g transform="translate(214, 245)"><use href={`#${p}singleBlossom`} transform="scale(1.35)" /></g>
          <g transform="translate(202, 275)"><use href={`#${p}singleBlossom`} transform="scale(1.1)" /></g>
          <g transform="translate(225, 305)"><use href={`#${p}singleBlossom`} transform="scale(1.15)" /></g>
          <g transform="translate(255, 315)"><use href={`#${p}singleBlossom`} transform="scale(1.25)" /></g>
          <g transform="translate(194, 335)"><use href={`#${p}singleBlossom`} transform="scale(0.95)" /></g>

          {/* Mid Tà & Hip (y=340..450) */}
          <g transform="translate(202, 375)"><use href={`#${p}singleBlossom`} transform="scale(1.3)" /></g>
          <g transform="translate(222, 410)"><use href={`#${p}singleBlossom`} transform="scale(1.2)" /></g>
          <g transform="translate(178, 445)"><use href={`#${p}singleBlossom`} transform="scale(1.15)" /></g>
          <g transform="translate(238, 440)"><use href={`#${p}singleBlossom`} transform="scale(1.25)" /></g>

          {/* Lower Tà & Skirt Hem (y=460..575) */}
          <g transform="translate(242, 480)"><use href={`#${p}singleBlossom`} transform="scale(1.35)" /></g>
          <g transform="translate(270, 520)"><use href={`#${p}singleBlossom`} transform="scale(1.1)" /></g>
          <g transform="translate(230, 525)"><use href={`#${p}singleBlossom`} transform="scale(1.2)" /></g>
          <g transform="translate(205, 545)"><use href={`#${p}singleBlossom`} transform="scale(1.1)" /></g>
          <g transform="translate(185, 568)"><use href={`#${p}singleBlossom`} transform="scale(1.25)" /></g>

          {/* RHYTHMIC FALLING PETALS DRIFTING DOWN THE ENTIRE TÀ ÁO */}
          <g fill="#F472B6" stroke="#BE185D" strokeWidth="0.5" opacity="0.9">
            <ellipse cx="250" cy="220" rx="3.5" ry="2" transform="rotate(25 250 220)" />
            <ellipse cx="185" cy="240" rx="3" ry="1.8" transform="rotate(-30 185 240)" />
            <ellipse cx="240" cy="270" rx="4" ry="2.2" transform="rotate(45 240 270)" />
            <ellipse cx="180" cy="360" rx="3.5" ry="2" transform="rotate(-15 180 360)" />
            <ellipse cx="265" cy="370" rx="4" ry="2.2" transform="rotate(60 265 370)" />
            <ellipse cx="215" cy="460" rx="3.8" ry="2" transform="rotate(-40 215 460)" />
            <ellipse cx="260" cy="450" rx="3.5" ry="1.8" transform="rotate(35 260 450)" />
            <ellipse cx="250" cy="550" rx="4" ry="2.2" transform="rotate(50 250 550)" />
            <ellipse cx="215" cy="570" rx="3.5" ry="2" transform="rotate(-20 215 570)" />
            <ellipse cx="275" cy="565" rx="3" ry="1.8" transform="rotate(15 275 565)" />
          </g>

          {/* Tender Green Spring Buds & Leaves */}
          <g fill="#10B981" stroke="#047857" strokeWidth="0.4">
            <ellipse cx="248" cy="180" rx="2" ry="4" transform="rotate(30 248 180)" />
            <ellipse cx="218" cy="265" rx="2" ry="4" transform="rotate(-45 218 265)" />
            <ellipse cx="245" cy="330" rx="2" ry="4" transform="rotate(20 245 330)" />
            <ellipse cx="190" cy="420" rx="2" ry="4" transform="rotate(-30 190 420)" />
            <ellipse cx="255" cy="505" rx="2" ry="4" transform="rotate(40 255 505)" />
          </g>
        </g>

        {/* Master Single Blossom Definition */}
        <g id={`${p}singleBlossom`}>
          {/* Stamen halo */}
          <circle cx="0" cy="0" r="3.2" fill="#FBBF24" />
          {/* 5 Petals */}
          <path d="M 0 -3 C -3 -9 3 -9 0 -3" fill="#FDA4AF" stroke="#BE185D" strokeWidth="0.6" />
          <path d="M 3 0 C 9 -3 9 3 3 0" fill="#FDA4AF" stroke="#BE185D" strokeWidth="0.6" />
          <path d="M 0 3 C 3 9 -3 9 0 3" fill="#FDA4AF" stroke="#BE185D" strokeWidth="0.6" />
          <path d="M -3 0 C -9 3 -9 -3 -3 0" fill="#FDA4AF" stroke="#BE185D" strokeWidth="0.6" />
          <path d="M -2 -2 C -7 -7 -3 -8 -2 -2" fill="#F472B6" stroke="#BE185D" strokeWidth="0.5" />
          {/* Inner core */}
          <circle cx="0" cy="0" r="1.6" fill="#DC2626" />
        </g>

        {/* 4. LIÊN HOA THỦY BA (FULL-LENGTH LOTUS LAGOON) */}
        <g id={`${p}lotusLagoonFull`}>
          {/* Water waves at base */}
          <g transform="translate(230, 530)">
            <use href={`#${p}thuyBaHemUnit`} />
          </g>

          {/* Broad Emerald Lotus Leaves at hem */}
          <g transform="translate(195, 520)">
            <ellipse cx="0" cy="0" rx="24" ry="10" fill="#047857" stroke="#F59E0B" strokeWidth="1" />
            <path d="M 0 0 L -18 -6 M 0 0 L 18 -6 M 0 0 L 0 9 M 0 0 L -14 7 M 0 0 L 14 7" stroke="#10B981" strokeWidth="0.8" />
          </g>
          <g transform="translate(265, 515)">
            <ellipse cx="0" cy="0" rx="22" ry="9" fill="#065F46" stroke="#F59E0B" strokeWidth="1" />
            <path d="M 0 0 L -16 -5 M 0 0 L 16 -5 M 0 0 L 0 8 M 0 0 L -12 6 M 0 0 L 12 6" stroke="#10B981" strokeWidth="0.8" />
          </g>

          {/* Long Lotus Stems rising through skirt */}
          <path d="M 205 520 C 215 450 195 380 215 310 C 220 290 225 240 230 190" fill="none" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 255 510 C 245 440 265 370 248 310" fill="none" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" />

          {/* Lower blooming lotus (x=210, y=410) */}
          <g transform="translate(210, 410) scale(1.35)">
            <use href={`#${p}lotusUnit`} />
          </g>
          {/* Second blooming lotus (x=252, y=465) */}
          <g transform="translate(252, 465) scale(1.15)">
            <use href={`#${p}lotusUnit`} />
          </g>
          {/* Lotus bud (x=246, y=340) */}
          <g transform="translate(246, 340)">
            <path d="M 0 0 C -6 -12 0 -22 0 -22 C 0 -22 6 -12 0 0 Z" fill={u(`${p}lotusPetalGrad`)} stroke="#BE185D" strokeWidth="0.8" />
            <circle cx="0" cy="-22" r="1.5" fill="#FEF08A" />
          </g>
          {/* Chest Lotus Medallion (x=230, y=210) */}
          <g transform="translate(230, 210) scale(1.2)">
            <use href={`#${p}lotusUnit`} />
          </g>
          {/* Floating petals */}
          <g fill="#F472B6" opacity="0.85">
            <ellipse cx="240" cy="260" rx="3.5" ry="2" transform="rotate(25 240 260)" />
            <ellipse cx="190" cy="350" rx="3.5" ry="2" transform="rotate(-30 190 350)" />
            <ellipse cx="265" cy="390" rx="4" ry="2.2" transform="rotate(40 265 390)" />
          </g>
        </g>

        {/* 5. TÙNG HẠC DIÊN NIÊN & HẠC VŨ PHI VÂN (FULL-LENGTH CELESTIAL CRANES) */}
        <g id={`${p}craneCelestialFull`}>
          {/* Base Waves & Pine Bough */}
          <g transform="translate(230, 532)">
            <use href={`#${p}thuyBaHemUnit`} />
          </g>
          <g transform="translate(180, 520)">
            <path d="M 0 0 Q 30 -15 60 5" stroke="#78350F" strokeWidth="3" fill="none" />
            <g stroke="#047857" strokeWidth="1.2">
              <line x1="20" y1="-8" x2="10" y2="-22" />
              <line x1="20" y1="-8" x2="20" y2="-24" />
              <line x1="20" y1="-8" x2="30" y2="-22" />
              <line x1="45" y1="-3" x2="35" y2="-17" />
              <line x1="45" y1="-3" x2="45" y2="-19" />
              <line x1="45" y1="-3" x2="55" y2="-17" />
            </g>
          </g>

          {/* CRANE 1: Soaring at upper chest (x=225, y=190) */}
          <g transform="translate(225, 190) scale(1.15)">
            <use href={`#${p}craneUnit`} />
          </g>
          {/* CRANE 2: Gliding at waist (x=205, y=325) */}
          <g transform="translate(205, 325) scale(1.05) rotate(-12)">
            <use href={`#${p}craneUnit`} />
          </g>
          {/* CRANE 3: Dipping at lower skirt (x=248, y=440) */}
          <g transform="translate(248, 440) scale(1.1) rotate(15)">
            <use href={`#${p}craneUnit`} />
          </g>

          {/* Celestial Cloud Streams linking cranes */}
          <use href={`#${p}cloudSwirl`} x="180" y="240" transform="scale(0.85)" />
          <use href={`#${p}cloudSwirl`} x="235" y="360" transform="scale(0.9)" />
          <use href={`#${p}cloudSwirl`} x="175" y="460" transform="scale(0.85)" />
        </g>

        {/* 6. TỨ QUÝ GẤM VÓC & CHÂN TÀ CUNG ĐÌNH (FULL-LENGTH BROCADE PANEL) */}
        <g id={`${p}tuQuyBrocadeFull`}>
          {/* Hem Thủy Ba waves */}
          <g transform="translate(230, 532)">
            <use href={`#${p}thuyBaHemUnit`} />
          </g>
          {/* Vertical Imperial Acanthus Vine (Dây lá lật gấm) */}
          <path
            d="M 230 160 C 242 200 218 240 230 280 C 242 320 218 360 230 400 C 242 440 218 480 230 525"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Four Seasonal Medallions */}
          {/* Mai (Spring) */}
          <g transform="translate(230, 200)">
            <circle cx="0" cy="0" r="14" fill="#047857" stroke="#F59E0B" strokeWidth="1.5" />
            <use href={`#${p}singleBlossom`} transform="scale(1.2)" />
          </g>
          {/* Trúc (Summer) */}
          <g transform="translate(230, 290)">
            <circle cx="0" cy="0" r="14" fill="#065F46" stroke="#F59E0B" strokeWidth="1.5" />
            <path d="M 0 -8 L 0 8 M -6 -2 L -1 3 M 6 -4 L 1 1" stroke="#FEF08A" strokeWidth="1.8" />
          </g>
          {/* Cúc (Autumn) */}
          <g transform="translate(230, 390)">
            <circle cx="0" cy="0" r="14" fill="#78350F" stroke="#F59E0B" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="5" fill="#FEF08A" />
            <path d="M -8 0 L 8 0 M 0 -8 L 0 8 M -6 -6 L 6 6 M -6 6 L 6 -6" stroke="#F59E0B" strokeWidth="1.5" />
          </g>
          {/* Tùng (Winter) */}
          <g transform="translate(230, 480)">
            <circle cx="0" cy="0" r="14" fill="#1E3A8A" stroke="#F59E0B" strokeWidth="1.5" />
            <path d="M 0 6 L 0 -6 M -6 2 L 0 -2 L 6 2 M -7 -1 L 0 -5 L 7 -1" stroke="#FEF08A" strokeWidth="1.6" />
          </g>
        </g>

        {/* 7. VÂN ÁM CUNG ĐÌNH & THỦY BA CHÂN TÀ (FULL-LENGTH CLOUD BROCADE) */}
        <g id={`${p}cloudSwirlFull`}>
          {/* Thủy Ba Hem Waves */}
          <g transform="translate(230, 532)">
            <use href={`#${p}thuyBaHemUnit`} />
          </g>
          {/* Rhythmic Court Cloud Bands from chest to hem */}
          <use href={`#${p}cloudSwirl`} x="195" y="195" transform="scale(0.95)" />
          <use href={`#${p}cloudSwirl`} x="240" y="270" transform="scale(1.05)" />
          <use href={`#${p}cloudSwirl`} x="180" y="350" transform="scale(0.95)" />
          <use href={`#${p}cloudSwirl`} x="235" y="430" transform="scale(1.1)" />
          <use href={`#${p}cloudSwirl`} x="190" y="495" transform="scale(0.9)" />
        </g>

        {/* 8. MASTER LOTUS UNIT */}
        <g id={`${p}lotusUnit`}>
          <ellipse cx="0" cy="8" rx="16" ry="6" fill="#059669" opacity="0.6" />
          <path d="M 0 6 C -8 -2 -14 -15 0 -22 C 14 -15 8 -2 0 6 Z" fill={u(`${p}lotusPetalGrad`)} stroke="#BE185D" strokeWidth="0.8" />
          <path d="M -3 6 C -15 2 -20 -8 -10 -16 C -3 -10 -1 0 -3 6 Z" fill="#FCE7F3" stroke="#DB2777" strokeWidth="0.6" />
          <path d="M 3 6 C 15 2 20 -8 10 -16 C 3 -10 1 0 3 6 Z" fill="#FCE7F3" stroke="#DB2777" strokeWidth="0.6" />
          <circle cx="0" cy="-6" r="3.2" fill="#FDE047" stroke="#F59E0B" strokeWidth="0.8" />
        </g>

        {/* 9. MASTER CRANE UNIT */}
        <g id={`${p}craneUnit`}>
          <path d="M 0 0 Q 15 -10 25 -30 Q 30 -5 18 10 Q 5 25 0 35" fill="none" stroke="#FFFFFF" strokeWidth="3" />
          <path d="M 12 -5 Q 30 -15 45 -10 Q 35 15 15 10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.8" />
          <path d="M 25 -30 L 32 -32 L 28 -28" fill="#DC2626" />
          <path d="M 0 35 L -8 60 M 4 35 L 2 60" stroke="#1E293B" strokeWidth="1.5" />
          <path d="M 32 -3 Q 42 0 46 -8" stroke="#F59E0B" strokeWidth="1.2" fill="none" />
        </g>

        {/* 10. CLOUD SWIRL MASTER */}
        <g id={`${p}cloudSwirl`}>
          <path
            d="M 0 0 C 8 -12 24 -12 30 0 C 38 -5 48 3 45 12 C 43 20 28 22 22 16 C 16 10 2 10 0 0 Z"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="2"
            opacity="0.9"
          />
          <circle cx="22" cy="8" r="2" fill="#FEF08A" />
        </g>

        {/* 11. GRAND BACK DRAGON MEDALLION */}
        <g id={`${p}dragonBackMedallion`}>
          <circle cx="0" cy="0" r="46" fill="none" stroke="#F59E0B" strokeWidth="3.2" strokeDasharray="6,4" />
          <circle cx="0" cy="0" r="40" fill="rgba(245, 158, 11, 0.15)" stroke="#F59E0B" strokeWidth="1.6" />
          <path
            d="M -24 -16 C -32 10 -16 30 8 28 C 30 26 34 0 18 -20 C 0 -32 -16 -20 -8 -6 C -2 6 14 6 12 -2"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
          <circle cx="-13" cy="-20" r="4.2" fill="#FEF08A" stroke="#78350F" strokeWidth="0.8" />
          <circle cx="-14" cy="-21" r="1.4" fill="#FFFFFF" />
          <path d="M -16 -26 L -20 -34 M -10 -26 L -6 -34" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="0" cy="0" r="5.5" fill="#EF4444" stroke="#FEF08A" strokeWidth="1.4" />
        </g>

        {/* 12. THÁNH KIẾM THUẬN THIÊN HOÀNG GIA (SACRED SWORD OF LEGEND) */}
        <g id={`${p}swordLegendFull`}>
          {/* Thủy Ba Hem Wave Base */}
          <g transform="translate(230, 532)">
            <use href={`#${p}thuyBaHemUnit`} />
          </g>

          {/* Radiant Celestial Aura */}
          <line
            x1="230"
            y1="165"
            x2="230"
            y2="515"
            stroke="rgba(56, 189, 248, 0.4)"
            strokeWidth="22"
            strokeLinecap="round"
          />
          <line
            x1="230"
            y1="170"
            x2="230"
            y2="510"
            stroke="rgba(254, 240, 138, 0.45)"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Sacred Golden Dragon coiling around sword */}
          <path
            d="M 218 195 C 248 220 248 260 220 285 C 198 310 205 350 234 375 C 255 395 250 435 226 460 C 215 475 225 495 230 510"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="7.5"
            strokeLinecap="round"
          />
          <path
            d="M 218 195 C 248 220 248 260 220 285 C 198 310 205 350 234 375 C 255 395 250 435 226 460"
            fill="none"
            stroke="#EF4444"
            strokeWidth="2"
            strokeDasharray="3,3"
          />
          {/* Claws grasping blade */}
          <path d="M 224 282 L 236 280 M 224 285 L 235 288" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 234 378 L 222 380 M 234 382 L 223 388" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />

          {/* Sacred Sword Steel Blade */}
          <polygon
            points="226,205 234,205 234,490 230,518 226,490"
            fill="#E2E8F0"
            stroke="#94A3B8"
            strokeWidth="0.8"
          />
          <line x1="230" y1="205" x2="230" y2="515" stroke="#F59E0B" strokeWidth="1.8" />
          <line x1="229" y1="210" x2="229" y2="490" stroke="#38BDF8" strokeWidth="0.8" opacity="0.8" />

          {/* Imperial Runic Inscriptions along Blade */}
          <g stroke="#D97706" strokeWidth="1.2" opacity="0.9">
            <line x1="228" y1="235" x2="232" y2="235" />
            <circle cx="230" cy="255" r="1.5" fill="#FEF08A" />
            <line x1="227" y1="275" x2="233" y2="275" />
            <line x1="228" y1="315" x2="232" y2="315" />
            <circle cx="230" cy="335" r="1.8" fill="#38BDF8" />
            <line x1="227" y1="365" x2="233" y2="365" />
            <line x1="228" y1="415" x2="232" y2="415" />
            <circle cx="230" cy="445" r="1.5" fill="#FEF08A" />
            <line x1="228" y1="475" x2="232" y2="475" />
          </g>

          {/* Dragon Guard at Chest */}
          <g transform="translate(230, 202)">
            <path
              d="M 0 0 C -12 -6 -24 3 -30 12 C -22 10 -12 7 0 2 C 12 7 22 10 30 12 C 24 3 12 -6 0 0 Z"
              fill="#F59E0B"
              stroke="#78350F"
              strokeWidth="1"
            />
            <ellipse cx="0" cy="2" rx="4.5" ry="3.5" fill="#DC2626" stroke="#F59E0B" strokeWidth="1" />
            <circle cx="0" cy="2" r="1.5" fill="#FEF08A" />
          </g>

          {/* Sword Hilt with Crimson Silk Wrap */}
          <g transform="translate(230, 168)">
            <rect x="-3" y="2" width="6" height="32" rx="1.5" fill="#1E293B" stroke="#F59E0B" strokeWidth="0.8" />
            <path d="M -3 6 L 3 10 M -3 10 L 3 6 M -3 14 L 3 18 M -3 18 L 3 14 M -3 22 L 3 26 M -3 26 L 3 22" stroke="#EF4444" strokeWidth="1.2" />
            {/* Pommel with Jade Center */}
            <circle cx="0" cy="0" r="6" fill="#F59E0B" stroke="#78350F" strokeWidth="1" />
            <circle cx="0" cy="0" r="3" fill="#047857" />
            {/* Crimson Silk Tassel */}
            <path d="M 0 6 Q -8 24 -6 45" stroke="#DC2626" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <circle cx="-6" cy="46" r="2.5" fill="#FBBF24" />
          </g>

          {/* Golden bursts around blade tip */}
          <circle cx="230" cy="520" r="2.5" fill="#FEF08A" />
          <circle cx="218" cy="495" r="1.8" fill="#38BDF8" />
          <circle cx="242" cy="495" r="1.8" fill="#38BDF8" />

          {/* Floating court clouds */}
          <use href={`#${p}cloudSwirl`} x="180" y="230" transform="scale(0.85)" />
          <use href={`#${p}cloudSwirl`} x="238" y="340" transform="scale(0.9)" />
          <use href={`#${p}cloudSwirl`} x="175" y="445" transform="scale(0.8)" />
        </g>

        {/* 13. TÙNG BÁCH VÀ TRÚC XANH CUNG ĐÌNH (SACRED PINE & NOBLE BAMBOO) */}
        <g id={`${p}pineBambooFull`}>
          {/* Thủy Ba Hem Wave Base */}
          <g transform="translate(230, 532)">
            <use href={`#${p}thuyBaHemUnit`} />
          </g>

          {/* Noble Bamboo Stalks (Trúc Quân Tử) */}
          <g id="bambooStalkLeft">
            <line x1="198" y1="535" x2="204" y2="465" stroke="#047857" strokeWidth="4.5" strokeLinecap="round" />
            <circle cx="204" cy="465" r="3" fill="#FEF08A" stroke="#065F46" strokeWidth="0.8" />
            <line x1="204" y1="465" x2="210" y2="395" stroke="#059669" strokeWidth="4.2" strokeLinecap="round" />
            <circle cx="210" cy="395" r="2.8" fill="#FEF08A" stroke="#065F46" strokeWidth="0.8" />
            <line x1="210" y1="395" x2="215" y2="325" stroke="#10B981" strokeWidth="3.8" strokeLinecap="round" />
            <circle cx="215" cy="325" r="2.5" fill="#FEF08A" stroke="#065F46" strokeWidth="0.8" />
            <line x1="215" y1="325" x2="218" y2="255" stroke="#34D399" strokeWidth="3.2" strokeLinecap="round" />
            <circle cx="218" cy="255" r="2.2" fill="#FEF08A" stroke="#065F46" strokeWidth="0.8" />

            {/* Bamboo Leaf Sprigs */}
            <path d="M 204 465 Q 185 455 174 465" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M 204 465 Q 190 475 180 488" fill="none" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M 210 395 Q 190 380 178 388" fill="none" stroke="#10B981" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M 210 395 Q 195 405 186 420" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M 210 395 Q 225 385 235 390" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
            <path d="M 215 325 Q 196 312 186 320" fill="none" stroke="#34D399" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M 215 325 Q 200 335 192 350" fill="none" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M 218 255 Q 198 240 188 248" fill="none" stroke="#34D399" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M 218 255 Q 205 268 200 282" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* Ancient Pine Bough (Lão Tùng) */}
          <path
            d="M 268 150 C 255 190 238 230 242 275 C 246 320 262 360 252 410 C 244 450 255 490 250 535"
            fill="none"
            stroke="#78350F"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 266 152 C 253 192 236 232 240 277 C 244 322 260 362 250 412"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="1.5"
            strokeDasharray="6,5"
          />

          {/* Pine Needle Fan Clusters */}
          <g transform="translate(262, 165)">
            <ellipse cx="0" cy="0" rx="16" ry="8" fill="#047857" stroke="#F59E0B" strokeWidth="0.8" />
            <path d="M 0 0 L -12 -6 M 0 0 L -8 -10 M 0 0 L 0 -11 M 0 0 L 8 -10 M 0 0 L 12 -6" stroke="#FEF08A" strokeWidth="1" />
          </g>
          <g transform="translate(242, 225)">
            <ellipse cx="0" cy="0" rx="20" ry="9" fill="#065F46" stroke="#F59E0B" strokeWidth="1" />
            <path d="M 0 0 L -16 -6 M 0 0 L -10 -11 M 0 0 L 0 -12 M 0 0 L 10 -11 M 0 0 L 16 -6" stroke="#34D399" strokeWidth="1.2" />
          </g>
          <g transform="translate(246, 295)">
            <ellipse cx="0" cy="0" rx="22" ry="10" fill="#047857" stroke="#F59E0B" strokeWidth="1" />
            <path d="M 0 0 L -18 -7 M 0 0 L -12 -12 M 0 0 L 0 -13 M 0 0 L 12 -12 M 0 0 L 18 -7" stroke="#FEF08A" strokeWidth="1.2" />
          </g>
          <g transform="translate(258, 375)">
            <ellipse cx="0" cy="0" rx="24" ry="11" fill="#065F46" stroke="#F59E0B" strokeWidth="1" />
            <path d="M 0 0 L -20 -7 M 0 0 L -13 -13 M 0 0 L 0 -14 M 0 0 L 13 -13 M 0 0 L 20 -7" stroke="#34D399" strokeWidth="1.2" />
          </g>
          <g transform="translate(248, 455)">
            <ellipse cx="0" cy="0" rx="22" ry="10" fill="#047857" stroke="#F59E0B" strokeWidth="1" />
            <path d="M 0 0 L -18 -6 M 0 0 L -11 -12 M 0 0 L 0 -13 M 0 0 L 11 -12 M 0 0 L 18 -6" stroke="#FEF08A" strokeWidth="1.2" />
          </g>
          <g transform="translate(252, 518)">
            <ellipse cx="0" cy="0" rx="20" ry="9" fill="#065F46" stroke="#F59E0B" strokeWidth="0.8" />
            <path d="M 0 0 L -15 -6 M 0 0 L -9 -10 M 0 0 L 0 -11 M 0 0 L 9 -10 M 0 0 L 15 -6" stroke="#10B981" strokeWidth="1" />
          </g>

          {/* Golden Pine Cones */}
          <ellipse cx="236" cy="235" rx="3.5" ry="5.5" fill="#B45309" stroke="#FEF08A" strokeWidth="0.8" />
          <ellipse cx="242" cy="308" rx="3.8" ry="6" fill="#B45309" stroke="#FEF08A" strokeWidth="0.8" />
          <ellipse cx="254" cy="388" rx="4" ry="6.5" fill="#B45309" stroke="#FEF08A" strokeWidth="0.8" />

          {/* Morning Dew & Emerald Leaf Sparkles */}
          <circle cx="178" cy="388" r="1.8" fill="#A7F3D0" />
          <circle cx="188" cy="248" r="1.6" fill="#A7F3D0" />
          <circle cx="230" cy="330" r="2" fill="#FEF08A" />
          <circle cx="240" cy="465" r="1.8" fill="#FEF08A" />

          {/* Floating Clouds */}
          <use href={`#${p}cloudSwirl`} x="175" y="270" transform="scale(0.85)" />
          <use href={`#${p}cloudSwirl`} x="228" y="340" transform="scale(0.9)" />
          <use href={`#${p}cloudSwirl`} x="180" y="440" transform="scale(0.85)" />
        </g>

        {/* 14. MASTER BLACK ANIME CLOUD SWIRL (HẮC VÂN WIBU / ANIME CLOUD UNIT) */}
        <g id={`${p}blackCloudSwirl`}>
          {/* Outer dark smoke aura */}
          <path
            d="M 0 0 C 10 -15 30 -15 38 0 C 48 -6 60 4 56 16 C 54 26 36 28 28 20 C 20 12 2 12 0 0 Z"
            fill="rgba(15, 23, 42, 0.45)"
          />
          {/* Main Obsidian Black Cloud Body */}
          <path
            d="M 0 0 C 8 -13 26 -13 32 0 C 40 -5 52 3 48 14 C 45 23 30 25 24 18 C 18 11 2 11 0 0 Z"
            fill={u(`${p}blackCloudGrad`)}
            stroke={u(`${p}crimsonGlow`)}
            strokeWidth="1.8"
          />
          {/* Inner Golden spiral stitch */}
          <path
            d="M 12 6 C 18 2 28 4 28 10 C 28 14 22 16 18 14 C 15 12 16 8 20 8"
            fill="none"
            stroke="#FEF08A"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          {/* Crimson core pearl */}
          <circle cx="28" cy="10" r="2.2" fill="#EF4444" stroke="#FEF08A" strokeWidth="0.6" />
        </g>

        {/* 15. HẮC VÂN TOÀN THÂN CUNG ĐÌNH & ANIME (FULL-LENGTH BLACK CLOUDS DRAPE) */}
        <g id={`${p}blackCloudSwirlFull`}>
          {/* Dark obsidian water waves at skirt hem */}
          <g transform="translate(230, 532)">
            <g fill="none" stroke="#09090B" strokeWidth="3" opacity="0.95">
              <path d="M -85 50 Q -65 32 -45 50 Q -25 32 0 50 Q 25 32 45 50 Q 65 32 85 50" />
              <path d="M -85 44 Q -65 26 -45 44 Q -25 26 0 44 Q 25 26 45 44 Q 65 26 85 44" stroke="#DC2626" strokeWidth="2" />
              <path d="M -75 36 Q -55 20 -35 36 Q -15 20 5 36 Q 25 20 45 36 Q 65 20 85 36" stroke="#F59E0B" strokeWidth="1.5" />
            </g>
            <circle cx="-45" cy="22" r="2.2" fill="#EF4444" />
            <circle cx="5" cy="22" r="2.2" fill="#FEF08A" />
            <circle cx="45" cy="22" r="2.2" fill="#EF4444" />
          </g>

          {/* Grand Chest Cloud Medallion (x=230, y=185) */}
          <g transform="translate(230, 185) scale(1.2)">
            <g transform="translate(-25, -10)">
              <use href={`#${p}blackCloudSwirl`} />
            </g>
            <circle cx="0" cy="0" r="5" fill="#EF4444" stroke="#FEF08A" strokeWidth="1.2" />
          </g>

          {/* Cascading Black Anime Clouds down body */}
          <g transform="translate(190, 240) scale(0.95) rotate(-8)">
            <use href={`#${p}blackCloudSwirl`} />
          </g>
          <g transform="translate(238, 305) scale(1.05) rotate(6)">
            <use href={`#${p}blackCloudSwirl`} />
          </g>
          <g transform="translate(182, 380) scale(1.1) rotate(-12)">
            <use href={`#${p}blackCloudSwirl`} />
          </g>
          <g transform="translate(234, 440) scale(1.15) rotate(10)">
            <use href={`#${p}blackCloudSwirl`} />
          </g>
          <g transform="translate(188, 500) scale(1.05) rotate(-6)">
            <use href={`#${p}blackCloudSwirl`} />
          </g>
          <g transform="translate(242, 515) scale(0.9) rotate(8)">
            <use href={`#${p}blackCloudSwirl`} />
          </g>

          {/* Crimson & Golden Embers drifting among clouds */}
          <circle cx="215" cy="220" r="2" fill="#EF4444" />
          <circle cx="248" cy="265" r="1.8" fill="#FEF08A" />
          <circle cx="205" cy="335" r="2.2" fill="#EF4444" />
          <circle cx="260" cy="370" r="1.8" fill="#FEF08A" />
          <circle cx="218" cy="425" r="2.5" fill="#EF4444" />
          <circle cx="250" cy="475" r="2" fill="#FEF08A" />
          <circle cx="208" cy="525" r="2.2" fill="#EF4444" />
        </g>

        {/* 16. HOÀNG DIỆP THU PHONG (GOLDEN AUTUMN FALLING LEAVES UNIT & FULL-LENGTH DRAPE) */}
        <g id={`${p}singleGoldenLeaf`}>
          <path
            d="M 0 -15 C 9 -11 13 -2 8 8 C 5 14 0 17 0 17 C 0 17 -5 14 -8 8 C -13 -2 -9 -11 0 -15 Z"
            fill="rgba(251, 191, 36, 0.35)"
          />
          <path
            d="M 0 -14 C 8 -10 11 -2 7 7 C 4 13 0 16 0 16 C 0 16 -4 13 -7 7 C -11 -2 -8 -10 0 -14 Z"
            fill={u(`${p}goldenLeafGrad`)}
            stroke="#D97706"
            strokeWidth="0.9"
          />
          <line x1="0" y1="-12" x2="0" y2="14" stroke="#B45309" strokeWidth="0.8" />
          <line x1="0" y1="-7" x2="4" y2="-3" stroke="#B45309" strokeWidth="0.5" opacity="0.8" />
          <line x1="0" y1="-7" x2="-4" y2="-3" stroke="#B45309" strokeWidth="0.5" opacity="0.8" />
          <line x1="0" y1="-1" x2="5" y2="3" stroke="#B45309" strokeWidth="0.5" opacity="0.8" />
          <line x1="0" y1="-1" x2="-5" y2="3" stroke="#B45309" strokeWidth="0.5" opacity="0.8" />
          <line x1="0" y1="5" x2="4" y2="8" stroke="#B45309" strokeWidth="0.5" opacity="0.8" />
          <line x1="0" y1="5" x2="-4" y2="8" stroke="#B45309" strokeWidth="0.5" opacity="0.8" />
        </g>

        <g id={`${p}goldenLeavesFull`}>
          <g transform="translate(230, 532)">
            <g fill="none" stroke={u(`${p}autumnAmberGrad`)} strokeWidth="2.5" opacity="0.9">
              <path d="M -85 50 Q -65 32 -45 50 Q -25 32 0 50 Q 25 32 45 50 Q 65 32 85 50" />
              <path d="M -85 44 Q -65 26 -45 44 Q -25 26 0 44 Q 25 26 45 44 Q 65 26 85 44" stroke="#FDE047" strokeWidth="1.5" />
            </g>
            <circle cx="-45" cy="22" r="2.2" fill="#FEF08A" />
            <circle cx="5" cy="22" r="2.5" fill="#F59E0B" />
            <circle cx="45" cy="22" r="2.2" fill="#FEF08A" />
          </g>

          <path d="M 210,165 Q 260,215 225,285 T 255,380 T 205,475 T 260,560" fill="none" stroke="#FEF08A" strokeWidth="1.4" strokeDasharray="4 3" opacity="0.75" />
          <path d="M 240,195 Q 195,265 245,345 T 200,435 T 240,535" fill="none" stroke="#FBBF24" strokeWidth="1.2" strokeDasharray="5 3" opacity="0.65" />

          <g transform="translate(215, 178) scale(0.95) rotate(28)"><use href={`#${p}singleGoldenLeaf`} /></g>
          <g transform="translate(248, 212) scale(1.15) rotate(-32)"><use href={`#${p}singleGoldenLeaf`} /></g>
          <g transform="translate(202, 252) scale(0.9) rotate(48)"><use href={`#${p}singleGoldenLeaf`} /></g>
          <g transform="translate(236, 288) scale(1.2) rotate(-16)"><use href={`#${p}singleGoldenLeaf`} /></g>
          <g transform="translate(262, 325) scale(0.95) rotate(42)"><use href={`#${p}singleGoldenLeaf`} /></g>
          <g transform="translate(196, 365) scale(1.1) rotate(-46)"><use href={`#${p}singleGoldenLeaf`} /></g>
          <g transform="translate(242, 408) scale(1.25) rotate(32)"><use href={`#${p}singleGoldenLeaf`} /></g>
          <g transform="translate(210, 452) scale(1) rotate(-22)"><use href={`#${p}singleGoldenLeaf`} /></g>
          <g transform="translate(258, 498) scale(1.3) rotate(52)"><use href={`#${p}singleGoldenLeaf`} /></g>
          <g transform="translate(192, 532) scale(0.92) rotate(-34)"><use href={`#${p}singleGoldenLeaf`} /></g>
          <g transform="translate(232, 558) scale(1.35) rotate(18)"><use href={`#${p}singleGoldenLeaf`} /></g>
          <g transform="translate(272, 565) scale(1.05) rotate(-58)"><use href={`#${p}singleGoldenLeaf`} /></g>

          <circle cx="208" cy="195" r="2.2" fill="#FEF08A" />
          <circle cx="254" cy="240" r="1.8" fill="#FDE047" />
          <circle cx="188" cy="285" r="2.5" fill="#FEF08A" />
          <circle cx="248" cy="365" r="2" fill="#FEF08A" />
          <circle cx="198" cy="415" r="1.8" fill="#FDE047" />
          <circle cx="268" cy="465" r="2.4" fill="#FEF08A" />
          <circle cx="222" cy="520" r="2.2" fill="#FEF08A" />
        </g>

        {/* -------------------------------------------------------------
            GEN Z STICKERS & BADGES DEFINITIONS
        -------------------------------------------------------------- */}
        {/* Cyber Heritage Badge */}
        <g id={`${p}stickerCyberBadge`}>
          <polygon points="0,-16 14,-7 14,10 0,18 -14,10 -14,-7" fill="#0F172A" stroke="#06B6D4" strokeWidth="2" />
          <polygon points="0,-12 10,-5 10,7 0,14 -10,7 -10,-5" fill="none" stroke="#38BDF8" strokeWidth="0.8" />
          <text x="0" y="2" textAnchor="middle" fill="#38BDF8" fontSize="8" fontWeight="900" fontFamily="sans-serif">VN</text>
          <text x="0" y="9" textAnchor="middle" fill="#F472B6" fontSize="5" fontWeight="bold" fontFamily="sans-serif">CYBER</text>
        </g>

        {/* Gen Z Spark Star */}
        <g id={`${p}stickerGenzStar`}>
          <path d="M 0 -16 Q 0 0 16 0 Q 0 0 0 16 Q 0 0 -16 0 Q 0 0 0 -16 Z" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1" />
          <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
        </g>

        {/* Streetwear Woven Tag */}
        <g id={`${p}stickerVietTag`}>
          <rect x="-24" y="-8" width="48" height="16" rx="4" fill="#F59E0B" stroke="#000000" strokeWidth="1.2" />
          <text x="0" y="4" textAnchor="middle" fill="#000000" fontSize="9" fontWeight="900" fontFamily="sans-serif" letterSpacing="1">VN 2026</text>
        </g>

        {/* Lightning Pin */}
        <g id={`${p}stickerLightning`}>
          <polygon points="2,-14 -10,0 -2,0 -6,14 8,0 0,0" fill="#FACC15" stroke="#78350F" strokeWidth="1" />
        </g>

        {/* Retro Smile */}
        <g id={`${p}stickerRetroSmile`}>
          <circle cx="0" cy="0" r="10" fill="#FDE047" stroke="#000000" strokeWidth="1.2" />
          <circle cx="-3.5" cy="-2.5" r="1.5" fill="#000000" />
          <circle cx="3.5" cy="-2.5" r="1.5" fill="#000000" />
          <path d="M -4.5 3 Q 0 7.5 4.5 3" stroke="#000000" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </g>

        {/* Barcode Tag */}
        <g id={`${p}stickerBarcode`}>
          <rect x="-18" y="-7" width="36" height="14" rx="2" fill="#FFFFFF" stroke="#0F172A" strokeWidth="0.8" />
          <line x1="-14" y1="-5" x2="-14" y2="3" stroke="#000000" strokeWidth="1.5" />
          <line x1="-10" y1="-5" x2="-10" y2="3" stroke="#000000" strokeWidth="2.5" />
          <line x1="-5" y1="-5" x2="-5" y2="3" stroke="#000000" strokeWidth="1" />
          <line x1="-1" y1="-5" x2="-1" y2="3" stroke="#000000" strokeWidth="2" />
          <line x1="4" y1="-5" x2="4" y2="3" stroke="#000000" strokeWidth="1.5" />
          <line x1="8" y1="-5" x2="8" y2="3" stroke="#000000" strokeWidth="1" />
          <line x1="12" y1="-5" x2="12" y2="3" stroke="#000000" strokeWidth="2" />
        </g>

        {/* -------------------------------------------------------------
            JEWELRY & ACCESSORY UNITS
        -------------------------------------------------------------- */}
        {/* Kiềng Bạc Chạm Sen */}
        <g id={`${p}kiengBacUnit`}>
          <ellipse cx="230" cy="142" rx="28" ry="14" fill="none" stroke="#CBD5E1" strokeWidth="4.5" />
          <ellipse cx="230" cy="142" rx="28" ry="14" fill="none" stroke="#FFFFFF" strokeWidth="1.2" strokeDasharray="3,3" />
          <circle cx="230" cy="156" r="4.5" fill="#E2E8F0" stroke="#64748B" strokeWidth="0.8" />
          <circle cx="230" cy="156" r="2" fill="#38BDF8" />
        </g>

        {/* Ngọc Bội Cung Đình Thắt Eo */}
        <g id={`${p}ngocBoiUnit`}>
          <circle cx="0" cy="0" r="11" fill="#047857" stroke="#F59E0B" strokeWidth="2" />
          <circle cx="0" cy="0" r="5" fill="#047857" stroke="#FEF08A" strokeWidth="0.8" />
          <path d="M 0 11 L -4 38 M 0 11 L 0 42 M 0 11 L 4 38" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="0" cy="42" r="3.2" fill="#DC2626" />
        </g>

        {/* Trâm Cài Tóc Ngọc Vàng */}
        <g id={`${p}tramCaiUnit`}>
          <path d="M -12 -12 L 18 18" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
          <circle cx="-12" cy="-12" r="6" fill="#047857" stroke="#F59E0B" strokeWidth="1.2" />
          <circle cx="-12" cy="-12" r="2.5" fill="#EF4444" />
          <path d="M -15 -18 Q -24 -22 -18 -28" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
        </g>
      </defs>

      {/* =====================================================================
          RENDER BY VIEW ANGLE: FRONT (TRƯỚC), SIDE (NGHIÊNG 3/4), BACK (LƯNG)
      ====================================================================== */}

      {/* -------------------------------------------------------------------
          GÓC CHÍNH DIỆN (FRONT VIEW)
      -------------------------------------------------------------------- */}
      {viewAngle === "front" && (
        <g id="viewFront">
          {/* Back hair layer */}
          {isFemale ? (
            <g id="femaleBackHair">
              <path
                d="M 198 65 C 190 110 186 210 190 325 C 194 365 266 365 270 325 C 274 210 270 110 262 65 Z"
                fill="#281834"
              />
            </g>
          ) : (
            <g id="maleBackHair">
              <path d="M 205 105 L 200 135 L 260 135 L 255 105 Z" fill="#1E293B" />
            </g>
          )}

          {/* Trousers (Quần lụa) */}
          <g id="pantsFront">
            <path
              d={isFemale ? "M 192 345 L 175 645 L 222 645 L 228 375 Z" : "M 172 360 L 138 645 L 208 645 L 226 395 Z"}
              fill={pantsColor}
              stroke="#CBD5E1"
              strokeWidth="0.8"
            />
            <path
              d={isFemale ? "M 232 375 L 238 645 L 285 645 L 268 345 Z" : "M 234 395 L 252 645 L 322 645 L 288 360 Z"}
              fill={pantsColor}
              stroke="#CBD5E1"
              strokeWidth="0.8"
            />
            <path d={isFemale ? "M 195 415 Q 190 535 186 635" : "M 178 410 L 168 635"} stroke="#94A3B8" strokeWidth="1.2" opacity="0.45" fill="none" />
            <path d={isFemale ? "M 265 415 Q 270 535 274 635" : "M 282 410 L 292 635"} stroke="#94A3B8" strokeWidth="1.2" opacity="0.45" fill="none" />
          </g>

          {/* Neck */}
          <path
            d={isFemale ? "M 218 95 L 218 132 L 242 132 L 242 95 Z" : "M 213 95 L 212 135 L 248 135 L 247 95 Z"}
            fill={isFemale ? u(`${p}femaleSkinGrad`) : u(`${p}maleSkinGrad`)}
          />
          {!isFemale && (
            <path d="M 227 114 Q 230 117 233 114" stroke="#C27855" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.7" />
          )}

          {/* -------------------------------------------------------------
              GARMENT BODY & ANATOMY (THEO TỪNG DÒNG CỔ PHỤC)
          -------------------------------------------------------------- */}

          {/* === A. ÁO NHẬT BÌNH CUNG ĐÌNH NỮ & ÁO ĐẠI CỔ HOÀNG TRIỀU NAM === */}
          {isNhatBinh && (
            <g id="garmentNhatBinhFront">
              {/* Thân áo */}
              <path
                d={
                  isFemale
                    ? "M 185 145 Q 195 240 188 315 Q 166 430 152 575 Q 230 588 308 575 Q 294 430 272 315 Q 265 240 275 145 Z"
                    : "M 148 145 L 168 325 L 140 580 Q 230 592 320 580 L 292 325 L 312 145 Z"
                }
                fill={bodyColor}
              />
              {/* Dải nẹp chính giữa */}
              <line x1="230" y1={isFemale ? "210" : "140"} x2="230" y2="578" stroke="#F59E0B" strokeWidth={isFemale ? "3" : "3.5"} />

              {isFemale ? (
                <>
                  {/* CỔ ÁO CHỮ NHẬT BẢN TO VIỀN NGŨ SẮC (NỮ NHẬT BÌNH) */}
                  <g id="nhatBinhRectCollar">
                    <path d="M 205 142 L 255 142 L 255 208 L 205 208 Z" fill="#047857" stroke="#F59E0B" strokeWidth="1.5" />
                    <path d="M 202 139 L 258 139 L 258 211 L 202 211 Z" fill="none" stroke="#1E3A8A" strokeWidth="2.8" />
                    <path d="M 199 136 L 261 136 L 261 214 L 199 214 Z" fill="none" stroke="#FBBF24" strokeWidth="2.6" />
                    <path d="M 196 133 L 264 133 L 264 217 L 196 217 Z" fill="none" stroke="#FFFFFF" strokeWidth="2.4" />
                    <path d="M 193 130 L 267 130 L 267 220 L 193 220 Z" fill="none" stroke="#DC2626" strokeWidth="2.4" />
                    <path d="M 190 127 L 270 127 L 270 223 L 190 223 Z" fill="none" stroke="#059669" strokeWidth="2.2" />
                    <circle cx="230" cy="208" r="4.5" fill="#047857" stroke="#F59E0B" strokeWidth="1.2" />
                    <circle cx="230" cy="208" r="1.8" fill="#FEF08A" />
                  </g>

                  {/* HAI DẢI KẾT NGŨ SẮC (DẢI KIM KHÁNH) NỮ */}
                  <g id="nhatBinhRibbons">
                    <path d="M 224 212 Q 216 295 218 375" stroke="#F59E0B" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <path d="M 224 212 Q 214 295 215 375" stroke="#DC2626" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <circle cx="218" cy="377" r="3" fill="#047857" />
                    <path d="M 236 212 Q 244 295 242 375" stroke="#F59E0B" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <path d="M 236 212 Q 246 295 245 375" stroke="#2563EB" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <circle cx="242" cy="377" r="3" fill="#DC2626" />
                  </g>
                </>
              ) : (
                <>
                  {/* CỔ ÁO ĐẠI CỔ / LẬP LĨNH HOÀNG GIA NAM */}
                  <g id="royalMaleCollar">
                    <path d="M 212 114 Q 230 110 248 114 L 248 122 Q 230 118 212 122 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.8" />
                    <path d="M 210 116 Q 230 112 250 116 L 250 140 Q 230 144 210 140 Z" fill={collarColor} stroke="#F59E0B" strokeWidth="2.2" />
                    <circle cx="230" cy="140" r="3.5" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
                  </g>

                  {/* ĐOÀN LONG BỔ PHỤC NGỰC TRƯỚC (ROYAL DRAGON CHEST MEDALLION) */}
                  <use href={`#${p}maleDragonChestRoundMedallion`} />

                  {/* NGỌC ĐỚI HOÀNG GIA TRIỀU NGUYỄN (IMPERIAL JADE BELT) */}
                  <use href={`#${p}maleJadeBeltUnit`} />
                </>
              )}
            </g>
          )}

          {/* === B. ÁO TỨ THÂN BẮC BỘ (NỮ) & Y PHỤC LIỀN ANH QUAN HỌ (NAM) === */}
          {isTuThan && (
            <g id="garmentTuThanFront">
              {isFemale ? (
                <>
                  {/* LỚP 1: YẾM ĐÀO TRUYỀN THỐNG BÊN TRONG (CHỈ DÀNH CHO NỮ) */}
                  <g id="yemDaoFront">
                    <path
                      d="M 215 130 Q 230 142 245 130 L 254 220 Q 230 230 206 220 Z"
                      fill={innerColor}
                      stroke="#BE185D"
                      strokeWidth="1.2"
                    />
                    <path d="M 216 130 Q 230 120 244 130" fill="none" stroke="#BE185D" strokeWidth="1.8" />
                    <circle cx="230" cy="175" r="5" fill="#FBCFE8" opacity="0.6" />
                    <circle cx="230" cy="175" r="2" fill="#FDE047" />
                  </g>

                  {/* LỚP 2: THÂN ÁO TỨ THÂN NGOÀI MỞ TÀ & THẮT VẠT */}
                  <path
                    d="M 185 145 Q 198 230 206 315 L 175 325 Q 166 430 152 575 Q 230 585 308 575 Q 294 430 285 325 L 254 315 Q 262 230 275 145 Z"
                    fill={bodyColor}
                  />
                  {/* Hai vạt trước mở chữ V để lộ yếm */}
                  <path d="M 185 145 Q 200 230 220 315" stroke="#F59E0B" strokeWidth="2.2" fill="none" />
                  <path d="M 275 145 Q 260 230 240 315" stroke="#F59E0B" strokeWidth="2.2" fill="none" />

                  {/* LỚP 3: DẢI BAO LỤA THẮT LƯNG RỦ DÀI NỮ */}
                  <g id="daiBaoLuaFront">
                    <rect x="200" y="308" width="60" height="15" rx="3" fill={beltColor} stroke="#0369A1" strokeWidth="1" />
                    <circle cx="230" cy="316" r="6" fill="#F472B6" stroke="#BE185D" strokeWidth="1" />
                    <path d="M 226 318 Q 215 420 210 520" stroke={u(`${p}beltGrad`)} strokeWidth="5" fill="none" strokeLinecap="round" />
                    <path d="M 234 318 Q 245 420 248 520" stroke="#F472B6" strokeWidth="4.5" fill="none" strokeLinecap="round" />
                  </g>
                </>
              ) : (
                <>
                  {/* Y PHỤC LIỀN ANH QUAN HỌ KINH BẮC (NAM) */}
                  {/* ÁO CÁNH BẠCH LỤA BÊN TRONG (INNER WHITE SILK TUNIC) */}
                  <g id="maleInnerWhiteTunic">
                    <path d="M 212 116 Q 230 112 248 116 L 248 138 Q 230 142 212 138 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.2" />
                    <path d="M 218 138 L 242 138 L 244 260 L 216 260 Z" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
                    <line x1="230" y1="138" x2="230" y2="260" stroke="#CBD5E1" strokeWidth="1" />
                    <circle cx="230" cy="155" r="2" fill="#94A3B8" />
                    <circle cx="230" cy="185" r="2" fill="#94A3B8" />
                    <circle cx="230" cy="215" r="2" fill="#94A3B8" />
                  </g>

                  {/* ÁO THE / ÁO DÀI LIỀN ANH NGOÀI CÙNG */}
                  <path
                    d="M 148 145 L 168 325 L 140 580 Q 230 592 320 580 L 292 325 L 312 145 Z"
                    fill={bodyColor}
                  />
                  {/* Vạt áo Liền Anh cài khuy chéo sang nách phải */}
                  <path d="M 230 138 Q 256 160 264 205 Q 268 255 244 305 L 248 582" stroke="#F59E0B" strokeWidth="2.5" fill="none" />
                  <circle cx="238" cy="144" r="3" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
                  <circle cx="254" cy="168" r="3" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
                  <circle cx="262" cy="202" r="3" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
                  <circle cx="258" cy="245" r="3" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />

                  {/* THẮT LƯNG LIỀN ANH (NAM) */}
                  <g id="maleQuanHoBelt">
                    <rect x="180" y="318" width="100" height="14" rx="2" fill={beltColor} stroke="#0369A1" strokeWidth="1" />
                    <path d="M 252 325 Q 258 400 254 480" stroke={u(`${p}beltGrad`)} strokeWidth="4.5" fill="none" strokeLinecap="round" />
                  </g>
                </>
              )}
            </g>
          )}

          {/* === C. ÁO DÀI TRUYỀN THỐNG (NỮ) & ÁO GẤM CÁCH TÂN (NAM) === */}
          {isAoDai && (
            <g id="garmentAoDaiFront">
              <path
                d={
                  isFemale
                    ? "M 190 145 Q 202 230 196 305 Q 175 425 160 585 Q 230 592 300 585 Q 285 425 264 305 Q 258 230 270 145 Z"
                    : "M 152 145 L 170 320 L 145 585 Q 230 592 315 585 L 290 320 L 308 145 Z"
                }
                fill={bodyColor}
              />
              {/* Nẹp cúc bấm chéo */}
              <path
                d={isFemale ? "M 230 138 Q 248 150 262 175" : "M 230 138 Q 255 155 268 185"}
                stroke="#F59E0B"
                strokeWidth={isFemale ? "2" : "2.4"}
                fill="none"
              />
              <circle cx={isFemale ? "238" : "240"} cy={isFemale ? "144" : "146"} r="2.5" fill="#FFFFFF" stroke="#D97706" strokeWidth="0.8" />
              <circle cx={isFemale ? "250" : "254"} cy={isFemale ? "158" : "162"} r="2.5" fill="#FFFFFF" stroke="#D97706" strokeWidth="0.8" />
              <circle cx={isFemale ? "260" : "266"} cy={isFemale ? "174" : "182"} r="2.5" fill="#FFFFFF" stroke="#D97706" strokeWidth="0.8" />

              {/* Xẻ tà hai bên hông */}
              <line x1={isFemale ? "196" : "170"} y1={isFemale ? "305" : "320"} x2={isFemale ? "160" : "145"} y2="585" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
              <line x1={isFemale ? "264" : "290"} y1={isFemale ? "305" : "320"} x2={isFemale ? "300" : "315"} y2="585" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />

              {/* Cổ áo dài */}
              <path
                d={
                  isFemale
                    ? "M 216 118 Q 230 114 244 118 L 244 138 Q 230 142 216 138 Z"
                    : "M 212 116 Q 230 112 248 116 L 248 138 Q 230 142 212 138 Z"
                }
                fill={collarColor}
                stroke="#F59E0B"
                strokeWidth={isFemale ? "1.6" : "2"}
              />
            </g>
          )}

          {/* === D. ÁO NGŨ THÂN LẬP LĨNH (MẶC ĐỊNH) === */}
          {isNguThan && (
            <g id="garmentNguThanFront">
              <path
                d={
                  isFemale
                    ? "M 185 145 Q 195 240 190 310 Q 170 425 156 575 Q 230 585 304 575 Q 290 425 270 310 Q 265 240 275 145 Z"
                    : "M 148 145 L 168 325 L 140 580 Q 230 592 320 580 L 292 325 L 312 145 Z"
                }
                fill={bodyColor}
              />
              {/* Nẹp vạt đè bên phải lượn cánh cung */}
              <path
                d={
                  isFemale
                    ? "M 230 138 Q 255 155 260 200 Q 262 245 240 290 Q 232 310 240 578"
                    : "M 230 138 Q 268 158 274 205 Q 276 255 248 305 L 250 582"
                }
                stroke="#F59E0B"
                strokeWidth={isFemale ? "2.4" : "3"}
                fill="none"
              />
              {/* Hàng 5 cúc vàng Ngũ Thường */}
              <g id="frontButtons">
                <circle cx={isFemale ? "238" : "240"} cy="144" r={isFemale ? "3.2" : "4"} fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
                <circle cx={isFemale ? "252" : "260"} cy={isFemale ? "165" : "170"} r={isFemale ? "3.2" : "4"} fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
                <circle cx={isFemale ? "260" : "272"} cy={isFemale ? "195" : "205"} r={isFemale ? "3.2" : "4"} fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
                <circle cx={isFemale ? "256" : "266"} cy={isFemale ? "235" : "248"} r={isFemale ? "3.2" : "4"} fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
                <circle cx={isFemale ? "245" : "252"} cy={isFemale ? "275" : "295"} r={isFemale ? "3.2" : "4"} fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
              </g>
              {/* Cổ Lập Lĩnh với lớp lót bạch lập lĩnh */}
              <path d="M 213 114 Q 230 110 247 114 L 247 122 Q 230 118 213 122 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.8" />
              <path
                d={
                  isFemale
                    ? "M 214 116 Q 230 112 246 116 L 246 138 Q 230 142 214 138 Z"
                    : "M 211 114 Q 230 110 249 114 L 249 138 Q 230 142 211 138 Z"
                }
                fill={collarColor}
                stroke="#F59E0B"
                strokeWidth={isFemale ? "1.8" : "2.4"}
              />
            </g>
          )}

          {/* -------------------------------------------------------------
              FRONT ARTWORK & EMBROIDERY (HỌA TIẾT THÊU TOÀN DIỆN VÀ CHÂN TÀ)
          -------------------------------------------------------------- */}
          <g id="frontDecorations">
            {/* Cổ Phục Embroidery with Precision Silhouette Clipping */}
            <g id="robeFrontEmbroideryClipped" clipPath={isFemale ? u(`${p}robeFrontClipFemale`) : u(`${p}robeFrontClipMale`)}>
              {/* Dragon Motif (Full Length from chest to hem waves) */}
              {hasDragon && (
                <g id="dragonArtFront">
                  <use href={`#${p}dragonImperialFull`} />
                </g>
              )}

              {/* Peach Blossom Branch (Continuous sweeping branch from shoulder to hem) */}
              {hasPeachBlossom && (
                <g id="peachArtFront">
                  <use href={`#${p}peachBlossomFull`} />
                </g>
              )}

              {/* Phoenix (Imperial Phoenix with 5 cascading tail plumes down the skirt) */}
              {hasPhoenix && (
                <g id="phoenixArtFront">
                  <use href={`#${p}phoenixImperialFull`} />
                </g>
              )}

              {/* Crane (Celestial cranes soaring through cloud rivers to hem) */}
              {hasCrane && (
                <g id="craneArtFront">
                  <use href={`#${p}craneCelestialFull`} />
                </g>
              )}

              {/* Lotus (Golden lotus lagoon from wave base to chest) */}
              {hasLotus && (
                <g id="lotusArtFront">
                  <use href={`#${p}lotusLagoonFull`} />
                </g>
              )}

              {/* Tứ Quý (Continuous vertical brocade panel and medallions) */}
              {hasTuQuy && (
                <g id="tuQuyArtFront">
                  <use href={`#${p}tuQuyBrocadeFull`} />
                </g>
              )}

              {/* Sword Legend (Sacred sword Thuận Thiên with radiant aura & dragon) */}
              {hasSword && (
                <g id="swordArtFront">
                  <use href={`#${p}swordLegendFull`} />
                </g>
              )}

              {/* Pine & Bamboo (Sacred pine & noble bamboo evergreen motifs) */}
              {hasTree && (
                <g id="treeArtFront">
                  <use href={`#${p}pineBambooFull`} />
                </g>
              )}

              {/* Black Clouds (Hắc Vân Anime Wibu / Mây Đen Thêu) */}
              {hasBlackClouds && (
                <g id="blackCloudsArtFront">
                  <use href={`#${p}blackCloudSwirlFull`} />
                </g>
              )}

              {/* Golden Leaves (Lá Vàng Rơi Hoàng Kim) */}
              {hasGoldenLeaves && (
                <g id="goldenLeavesArtFront">
                  <use href={`#${p}goldenLeavesFull`} />
                </g>
              )}

              {/* Cloud swirls / Royal Brocade Texture */}
              {hasCloudSwirl && !hasBlackClouds && (
                <g id="cloudsArtFront">
                  <use href={`#${p}cloudSwirlFull`} />
                </g>
              )}

              {/* Áo Nhật Bình Royal Thủy Ba Hem Base (Di sản cung đình triều Nguyễn mặc định) */}
              {!hasExplicitMotifs && isNhatBinh && (
                <g id="nhatBinhBaseWave" transform="translate(230, 532)">
                  <use href={`#${p}thuyBaHemUnit`} />
                </g>
              )}
            </g>

            {/* FITTED WAIST / CHIẾT EO CINCH OVERLAY */}
            {hasFittedWaist && (
              <g id="fittedWaistFront">
                <path
                  d={
                    isFemale
                      ? "M 194 302 Q 230 312 266 302 L 264 336 Q 230 348 196 336 Z"
                      : "M 180 306 Q 230 314 280 306 L 278 340 Q 230 350 182 340 Z"
                  }
                  fill={beltColor}
                  stroke="#F59E0B"
                  strokeWidth="2.2"
                />
                <line x1="208" y1="305" x2="208" y2="339" stroke="#F59E0B" strokeWidth="1.2" strokeDasharray="3,2" />
                <line x1="252" y1="305" x2="252" y2="339" stroke="#F59E0B" strokeWidth="1.2" strokeDasharray="3,2" />
                <rect x="222" y="312" width="16" height="16" rx="3" fill="#0F172A" stroke="#F59E0B" strokeWidth="1.8" />
                <circle cx="230" cy="320" r="4" fill="#047857" stroke="#FEF08A" strokeWidth="0.8" />
                <path d="M 227 328 Q 222 385 220 440" stroke={u(`${p}beltGrad`)} strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M 233 328 Q 238 385 240 440" stroke="#F59E0B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </g>
            )}

            {/* STICKERS & BADGES (Remix Gen Z - Rendered on top of garment) */}
            {hasCyberBadge && (
              <g id="badgeCyber" transform="translate(195, 175) scale(0.95)">
                <use href={`#${p}stickerCyberBadge`} />
              </g>
            )}
            {hasGenzStar && (
              <g id="starGenz" transform="translate(245, 175) scale(0.9)">
                <use href={`#${p}stickerGenzStar`} />
              </g>
            )}
            {hasVietTag && (
              <g id="tagViet" transform="translate(230, 480) rotate(-4)">
                <use href={`#${p}stickerVietTag`} />
              </g>
            )}
            {hasLightningPin && (
              <g id="pinLightning" transform="translate(216, 128) scale(0.85)">
                <use href={`#${p}stickerLightning`} />
              </g>
            )}
            {hasRetroSmile && (
              <g id="smileBadge" transform="translate(202, 215) scale(0.85)">
                <use href={`#${p}stickerRetroSmile`} />
              </g>
            )}
            {hasBarcode && (
              <g id="barcodeBadge" transform="translate(230, 525) scale(0.9)">
                <use href={`#${p}stickerBarcode`} />
              </g>
            )}
          </g>

          {/* -------------------------------------------------------------
              ARMS (CÁNH TAY A-POSE - KHOẢNG TRỐNG THOÁNG 30PX VỚI EO)
          -------------------------------------------------------------- */}
          <g id="armsFrontApose">
            {/* TAY TRÁI */}
            <g id="leftArmGroup">
              <path
                d={
                  isFemale
                    ? "M 185 145 C 145 175 120 230 128 290 Q 134 325 144 348 L 168 340 Q 156 285 156 230 L 195 175 Z"
                    : "M 148 145 C 106 178 86 240 100 305 Q 108 340 120 365 L 150 358 Q 136 290 140 230 L 170 185 Z"
                }
                fill={bodyColor}
                stroke="rgba(0, 0, 0, 0.12)"
                strokeWidth="0.8"
              />
              {/* Viền cửa tay áo: Nếu là Nhật Bình nữ thì có dải ngũ sắc! */}
              {isNhatBinh && isFemale ? (
                <g id="cuffNhatBinhLeft" transform="translate(144, 340)">
                  <line x1="0" y1="0" x2="24" y2="-8" stroke="#1E3A8A" strokeWidth="2.5" />
                  <line x1="0" y1="-3" x2="24" y2="-11" stroke="#FBBF24" strokeWidth="2.2" />
                  <line x1="0" y1="-6" x2="24" y2="-14" stroke="#FFFFFF" strokeWidth="2" />
                  <line x1="0" y1="-9" x2="24" y2="-17" stroke="#DC2626" strokeWidth="2" />
                  <line x1="0" y1="-12" x2="24" y2="-20" stroke="#059669" strokeWidth="2" />
                </g>
              ) : (
                <path
                  d={isFemale ? "M 144 348 L 168 340" : "M 120 365 L 150 358"}
                  stroke="#F59E0B"
                  strokeWidth={isFemale ? "2.5" : "3.2"}
                />
              )}
              {/* Bàn tay trái */}
              <path
                d={
                  isFemale
                    ? "M 144 348 C 140 364 146 376 154 378 C 160 376 164 364 168 340 Z"
                    : "M 120 365 C 116 382 122 396 132 398 C 138 396 142 382 148 358 Z"
                }
                fill={isFemale ? u(`${p}femaleSkinGrad`) : u(`${p}maleSkinGrad`)}
                stroke={isFemale ? "#FBCFE8" : "#C27855"}
                strokeWidth="0.8"
              />
            </g>

            {/* TAY PHẢI */}
            {hasQuatLua ? (
              <g id="rightArmHoldingFan">
                <path
                  d={
                    isFemale
                      ? "M 275 145 C 300 178 322 215 342 246 L 358 236 Q 328 198 300 165 Z"
                      : "M 312 145 C 334 178 354 215 372 250 L 390 240 Q 358 198 334 165 Z"
                  }
                  fill={bodyColor}
                  stroke="rgba(0, 0, 0, 0.12)"
                  strokeWidth="0.8"
                />
                <path d={isFemale ? "M 342 246 L 358 236" : "M 372 250 L 390 240"} stroke="#F59E0B" strokeWidth={isFemale ? "2.5" : "3.2"} />
                <path
                  d={
                    isFemale
                      ? "M 342 244 C 348 236 358 244 354 254 C 348 254 344 248 342 244 Z"
                      : "M 372 248 C 380 240 390 248 386 260 C 380 260 374 254 372 248 Z"
                  }
                  fill={isFemale ? u(`${p}femaleSkinGrad`) : u(`${p}maleSkinGrad`)}
                  stroke={isFemale ? "#FBCFE8" : "#C27855"}
                  strokeWidth="0.8"
                />
                {/* Quạt Lụa Thêu Sen trên tay phải */}
                <g id="quatLuaOverlay" transform={isFemale ? "translate(348, 230) rotate(-18)" : "translate(378, 234) rotate(-18)"}>
                  <path d="M 0 0 C 18 -26 42 -26 60 0 Z" fill="#F8FAFC" stroke="#F59E0B" strokeWidth="1.5" />
                  <path d="M 0 0 L 15 -18 M 0 0 L 30 -22 M 0 0 L 45 -18 M 0 0 L 60 0" stroke="#78350F" strokeWidth="1.2" />
                  <circle cx="30" cy="-12" r="5" fill="#F472B6" />
                  <circle cx="30" cy="-12" r="2" fill="#FDE047" />
                  <path d="M 0 0 L -6 18" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
                </g>
              </g>
            ) : (
              <g id="rightArmFree">
                <path
                  d={
                    isFemale
                      ? "M 275 145 C 315 175 340 230 332 290 Q 326 325 316 348 L 292 340 Q 304 285 304 230 L 265 175 Z"
                      : "M 312 145 C 354 178 374 240 360 305 Q 352 340 340 365 L 310 358 Q 324 290 320 230 L 290 185 Z"
                  }
                  fill={bodyColor}
                  stroke="rgba(0, 0, 0, 0.12)"
                  strokeWidth="0.8"
                />
                {/* Viền cửa tay áo: Nếu là Nhật Bình nữ thì có ngũ sắc! */}
                {isNhatBinh && isFemale ? (
                  <g id="cuffNhatBinhRight" transform="translate(292, 340)">
                    <line x1="0" y1="0" x2="24" y2="8" stroke="#1E3A8A" strokeWidth="2.5" />
                    <line x1="0" y1="-3" x2="24" y2="5" stroke="#FBBF24" strokeWidth="2.2" />
                    <line x1="0" y1="-6" x2="24" y2="2" stroke="#FFFFFF" strokeWidth="2" />
                    <line x1="0" y1="-9" x2="24" y2="-1" stroke="#DC2626" strokeWidth="2" />
                    <line x1="0" y1="-12" x2="24" y2="-4" stroke="#059669" strokeWidth="2" />
                  </g>
                ) : (
                  <path
                    d={isFemale ? "M 316 348 L 292 340" : "M 340 365 L 310 358"}
                    stroke="#F59E0B"
                    strokeWidth={isFemale ? "2.5" : "3.2"}
                  />
                )}
                {/* Bàn tay phải */}
                <path
                  d={
                    isFemale
                      ? "M 316 348 C 320 364 314 376 306 378 C 300 376 296 364 292 340 Z"
                      : "M 340 365 C 344 382 338 396 328 398 C 322 396 318 382 312 358 Z"
                  }
                  fill={isFemale ? u(`${p}femaleSkinGrad`) : u(`${p}maleSkinGrad`)}
                  stroke={isFemale ? "#FBCFE8" : "#C27855"}
                  strokeWidth="0.8"
                />
              </g>
            )}
          </g>

          {/* -------------------------------------------------------------
              JEWELRY OVERLAYS: KIỀNG BẠC / NGỌC BỘI
          -------------------------------------------------------------- */}
          {hasKiengBac && <use href={`#${p}kiengBacUnit`} />}
          {hasNgocBoi && (
            <g id="ngocBoiPlacement" transform="translate(262, 330)">
              <use href={`#${p}ngocBoiUnit`} />
            </g>
          )}

          {/* Túi Tote Canvas */}
          {hasTote && (
            <g id="totePlacement" transform="translate(138, 320)">
              <rect x="0" y="0" width="34" height="42" rx="4" fill="#F8FAFC" stroke="#0F172A" strokeWidth="1.2" />
              <path d="M 6 0 Q 17 -22 28 0" fill="none" stroke="#0F172A" strokeWidth="1.8" />
              <circle cx="17" cy="20" r="8" fill="#FEE2E2" />
              <text x="17" y="23" textAnchor="middle" fill="#DC2626" fontSize="7" fontWeight="bold">VIỆT</text>
            </g>
          )}

          {/* -------------------------------------------------------------
              FACE & HAIR FRONT
          -------------------------------------------------------------- */}
          <g id="headAndFaceFront">
            {/* Face shape */}
            <path
              d={
                isFemale
                  ? "M 202 58 C 196 86 210 112 230 117 C 250 112 264 86 258 58 C 252 36 208 36 202 58 Z"
                  : "M 194 56 L 190 82 L 206 112 L 230 118 L 254 112 L 270 82 L 266 56 Z"
              }
              fill={isFemale ? u(`${p}femaleSkinGrad`) : u(`${p}maleSkinGrad`)}
            />

            {/* Ears (Stylized Anime Ears) */}
            {isFemale ? (
              <g id="femaleEars">
                <path d="M 199 74 C 194 78 194 85 199 89" fill="none" stroke="#F4C2A5" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 261 74 C 266 78 266 85 261 89" fill="none" stroke="#F4C2A5" strokeWidth="2.5" strokeLinecap="round" />
              </g>
            ) : (
              <g id="maleEars">
                <path d="M 193 72 C 187 76 187 86 193 90" fill="none" stroke="#E2A682" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 267 72 C 273 76 273 86 267 90" fill="none" stroke="#E2A682" strokeWidth="2.5" strokeLinecap="round" />
              </g>
            )}

            {/* Eyes, Eyebrows & Face Features */}
            {isFemale ? (
              <g id="femaleEyes">
                {/* Eyebrows */}
                <path d="M 210 68 Q 217 65 224 67" stroke="#3F2B56" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                <path d="M 236 67 Q 243 65 250 68" stroke="#3F2B56" strokeWidth="1.8" fill="none" strokeLinecap="round" />

                {/* Left eye */}
                <path d="M 208 76 Q 218 70 224 76" stroke="#1E1926" strokeWidth="2.8" fill="none" strokeLinecap="round" />
                <ellipse cx="216" cy="80" rx="4.5" ry="6" fill="#4C1D95" />
                <circle cx="214.5" cy="77" r="1.8" fill="#FFFFFF" />
                <circle cx="218" cy="83" r="1" fill="#FFFFFF" />
                <path d="M 209 87 Q 216 89 223 87" stroke="#F472B6" strokeWidth="1.2" fill="none" opacity="0.6" />

                {/* Right eye */}
                <path d="M 236 76 Q 242 70 252 76" stroke="#1E1926" strokeWidth="2.8" fill="none" strokeLinecap="round" />
                <ellipse cx="244" cy="80" rx="4.5" ry="6" fill="#4C1D95" />
                <circle cx="242.5" cy="77" r="1.8" fill="#FFFFFF" />
                <circle cx="246" cy="83" r="1" fill="#FFFFFF" />
                <path d="M 237 87 Q 244 89 251 87" stroke="#F472B6" strokeWidth="1.2" fill="none" opacity="0.6" />

                {/* Anime wibu sparkle stars in eyes */}
                {(stickers.includes("genz_star") || outfitConfig?.pattern === "anime") && (
                  <g fill="#FEF08A" opacity="0.95">
                    <polygon points="214.5,75 215.5,77 217.5,77 216,78.5 216.5,80.5 214.5,79 212.5,80.5 213,78.5 211.5,77 213.5,77" />
                    <polygon points="242.5,75 243.5,77 245.5,77 244,78.5 244.5,80.5 242.5,79 240.5,80.5 241,78.5 239.5,77 241.5,77" />
                  </g>
                )}

                {/* Nose dot */}
                <circle cx="230" cy="89" r="1.1" fill="#E29578" />

                {/* Blush & lips */}
                <ellipse cx="210" cy="88" rx="5" ry="2.5" fill="#FDA4AF" opacity="0.6" />
                <ellipse cx="250" cy="88" rx="5" ry="2.5" fill="#FDA4AF" opacity="0.6" />
                <path d="M 226 98 Q 230 102 234 98" stroke="#E11D48" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                <path d="M 228 100 Q 230 101.5 232 100" stroke="#FDA4AF" strokeWidth="1.5" fill="none" opacity="0.8" />
              </g>
            ) : (
              <g id="maleEyes">
                {/* Kiếm Mi (Sword Eyebrows - Sharp & Heroic) */}
                <polygon points="202,68 224,63 222,66 202,70" fill="#0F172A" />
                <polygon points="258,68 236,63 238,66 258,70" fill="#0F172A" />

                {/* Male eyes: Sharp, resolute, dignified */}
                <path d="M 204 74 L 223 75" stroke="#0F172A" strokeWidth="2.8" fill="none" strokeLinecap="round" />
                <ellipse cx="214" cy="78" rx="4" ry="5.2" fill="#0284C7" />
                <circle cx="212" cy="76" r="1.6" fill="#FFFFFF" />
                <path d="M 206 82 L 221 82" stroke="#94A3B8" strokeWidth="0.8" fill="none" opacity="0.4" />

                <path d="M 237 75 L 256 74" stroke="#0F172A" strokeWidth="2.8" fill="none" strokeLinecap="round" />
                <ellipse cx="246" cy="78" rx="4" ry="5.2" fill="#0284C7" />
                <circle cx="244" cy="76" r="1.6" fill="#FFFFFF" />
                <path d="M 239 82 L 254 82" stroke="#94A3B8" strokeWidth="0.8" fill="none" opacity="0.4" />

                {/* Subtle anime sparkle if enabled */}
                {(stickers.includes("genz_star") || outfitConfig?.pattern === "anime") && (
                  <g fill="#38BDF8" opacity="0.95">
                    <polygon points="212,74 213,76 215,76 213.5,77.5 214,79.5 212,78 210,79.5 210.5,77.5 209,76 211,76" />
                    <polygon points="244,74 245,76 247,76 245.5,77.5 246,79.5 244,78 242,79.5 242.5,77.5 241,76 243,76" />
                  </g>
                )}

                {/* Defined masculine nose bridge */}
                <path d="M 229 76 L 230 89 L 226 92 L 234 92" stroke="#B45309" strokeWidth="1.2" fill="none" strokeLinecap="round" />

                {/* Dignified firm mouth */}
                <path d="M 223 99 Q 230 98 237 99" stroke="#9A3412" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                <path d="M 226 102 Q 230 103 234 102" stroke="#C27855" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.6" />
              </g>
            )}

            {/* Front Hair Bangs */}
            {isFemale ? (
              <g id="femaleFrontHair">
                <path
                  d="M 198 50 Q 212 66 215 58 Q 224 68 230 56 Q 236 68 245 58 Q 258 66 262 50 Q 268 35 230 32 Q 192 35 198 50 Z"
                  fill="#281834"
                />
                {/* Side hair strands framing face */}
                <path d="M 199 52 Q 195 72 198 90" stroke={u(`${p}femaleHairGrad`)} strokeWidth="2.8" fill="none" strokeLinecap="round" />
                <path d="M 261 52 Q 265 72 262 90" stroke={u(`${p}femaleHairGrad`)} strokeWidth="2.8" fill="none" strokeLinecap="round" />
              </g>
            ) : (
              <g id="maleFrontHair">
                {/* Short neat masculine hairline */}
                <path
                  d="M 190 54 Q 205 64 215 52 Q 228 66 235 46 Q 248 64 266 48 Q 272 28 230 26 Q 188 28 190 54 Z"
                  fill="#1E293B"
                />
                {/* Crisp sideburns */}
                <path d="M 194 54 L 193 78" stroke={u(`${p}maleHairGrad`)} strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M 266 54 L 267 78" stroke={u(`${p}maleHairGrad`)} strokeWidth="3" fill="none" strokeLinecap="round" />
              </g>
            )}

            {/* Trâm cài tóc - Only for female */}
            {hasTramCai && isFemale && (
              <g id="tramCaiPlacement" transform="translate(254, 45)">
                <use href={`#${p}tramCaiUnit`} />
              </g>
            )}
          </g>
        </g>
      )}

      {/* -------------------------------------------------------------------
          GÓC NGHIÊNG 3/4 (SIDE PERSPECTIVE VIEW)
      -------------------------------------------------------------------- */}
      {viewAngle === "side" && (
        <g id="viewSide">
          {/* Tóc sau góc nghiêng */}
          {isFemale ? (
            <path
              d="M 215 65 C 190 120 180 250 185 370 C 188 410 205 410 210 370 C 215 250 230 120 240 85 Z"
              fill="#281834"
            />
          ) : (
            <path d="M 215 90 L 205 130 L 250 130 L 255 90 Z" fill="#1E293B" />
          )}

          {/* Quần góc nghiêng */}
          <g id="pantsSide">
            <path d="M 205 370 L 195 645 L 235 645 L 230 370 Z" fill={pantsColor} opacity="0.8" />
            <path d="M 225 365 L 220 645 L 265 645 L 255 365 Z" fill={pantsColor} />
            <path d="M 240 375 L 244 635" stroke="#94A3B8" strokeWidth="1.4" opacity="0.6" fill="none" />
          </g>

          {/* Thân áo góc nghiêng theo từng loại áo */}
          <g id="robeSide">
            {/* Tà sau khuất */}
            <path
              d={isFemale ? "M 205 150 L 190 320 Q 180 440 175 570 L 235 570 L 230 320 Z" : "M 195 150 L 180 320 L 170 575 L 235 575 L 230 320 Z"}
              fill={bodyColor}
              opacity="0.85"
            />
            {/* Tà trước chính */}
            <path
              d={
                isFemale
                  ? "M 215 145 Q 240 230 235 310 Q 220 425 210 575 Q 260 582 295 572 Q 285 425 270 310 Q 265 230 260 145 Z"
                  : "M 205 145 L 235 320 L 215 580 Q 275 588 305 578 L 285 320 L 280 145 Z"
              }
              fill={bodyColor}
            />

            {/* Chi tiết cổ & nẹp góc nghiêng */}
            {isNhatBinh ? (
              isFemale ? (
                // Cổ chữ nhật Nhật Bình góc nghiêng (Nữ)
                <g id="collarNhatBinhSide">
                  <path d="M 222 120 L 262 135 L 256 195 L 226 185 Z" fill="#047857" stroke="#F59E0B" strokeWidth="1.5" />
                  <path d="M 220 118 L 264 133 L 258 197 L 224 187 Z" fill="none" stroke="#FBBF24" strokeWidth="2.5" />
                  <path d="M 218 116 L 266 131 L 260 199 L 222 189 Z" fill="none" stroke="#DC2626" strokeWidth="2.5" />
                  {/* Dải kim khánh buông rủ nghiêng */}
                  <path d="M 252 195 Q 256 280 250 365" stroke="#F59E0B" strokeWidth="3" fill="none" strokeLinecap="round" />
                </g>
              ) : (
                // Cổ Áo Bào Hoàng Triều & Đai Ngọc góc nghiêng (Nam)
                <g id="collarRoyalMaleSide">
                  <path d="M 220 114 Q 240 112 258 120 L 254 140 Q 236 134 218 136 Z" fill={collarColor} stroke="#F59E0B" strokeWidth="2" />
                  <rect x="220" y="320" width="55" height="15" rx="3" fill="#B45309" stroke="#F59E0B" strokeWidth="2" />
                  <rect x="236" y="322" width="14" height="11" rx="1.5" fill="#047857" stroke="#FDE047" strokeWidth="0.8" />
                </g>
              )
            ) : isTuThan ? (
              isFemale ? (
                // Yếm đào & Dải bao góc nghiêng (Nữ)
                <g id="tuThanSide">
                  <path d="M 226 135 L 252 145 L 246 220 L 222 210 Z" fill={innerColor} stroke="#BE185D" strokeWidth="1" />
                  <rect x="220" y="305" width="40" height="15" rx="3" fill={beltColor} stroke="#0369A1" strokeWidth="1" />
                  <path d="M 245 315 Q 248 420 242 510" stroke={u(`${p}beltGrad`)} strokeWidth="4.5" fill="none" />
                </g>
              ) : (
                // Y Phục Liền Anh góc nghiêng (Nam)
                <g id="tuThanMaleSide">
                  <path d="M 220 116 Q 240 114 256 122 L 252 140 Q 236 136 218 138 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.2" />
                  <rect x="215" y="318" width="50" height="14" rx="2" fill={beltColor} stroke="#0369A1" strokeWidth="1" />
                  <path d="M 248 325 Q 252 400 248 480" stroke={u(`${p}beltGrad`)} strokeWidth="4.5" fill="none" />
                </g>
              )
            ) : isAoDai ? (
              // Áo Dài góc nghiêng: xẻ tà cao
              <g id="aoDaiSide">
                <path d="M 220 116 Q 240 114 256 122 L 252 142 Q 236 136 218 138 Z" fill={collarColor} stroke="#F59E0B" strokeWidth="1.6" />
                <line x1="235" y1="310" x2="210" y2="575" stroke="rgba(0,0,0,0.2)" strokeWidth="1.2" />
              </g>
            ) : (
              // Ngũ Thân góc nghiêng: nẹp cong và cúc
              <g id="nguThanSide">
                <path d="M 235 138 Q 265 160 270 210 Q 272 260 255 315 L 260 575" stroke="#F59E0B" strokeWidth="2.5" fill="none" />
                <circle cx="248" cy="155" r="3.2" fill="#F59E0B" />
                <circle cx="266" cy="180" r="3.2" fill="#F59E0B" />
                <circle cx="270" cy="220" r="3.2" fill="#F59E0B" />
                <circle cx="262" cy="270" r="3.2" fill="#F59E0B" />
                <path d="M 220 116 Q 240 114 256 122 L 252 142 Q 236 136 218 138 Z" fill={collarColor} stroke="#F59E0B" strokeWidth="1.8" />
              </g>
            )}
          </g>

          {/* Artwork on Side Angle (3/4 Perspective Clipped to Robe) */}
          <g id="robeSideEmbroideryClipped" clipPath={isFemale ? u(`${p}robeSideClipFemale`) : u(`${p}robeSideClipMale`)}>
            {hasDragon && (
              <g id="dragonSide" transform="translate(18, 0) scale(0.92 1)">
                <use href={`#${p}dragonImperialFull`} />
              </g>
            )}
            {hasPeachBlossom && (
              <g id="peachSide" transform="translate(16, 0) scale(0.92 1)">
                <use href={`#${p}peachBlossomFull`} />
              </g>
            )}
            {hasPhoenix && (
              <g id="phoenixSide" transform="translate(18, 0) scale(0.92 1)">
                <use href={`#${p}phoenixImperialFull`} />
              </g>
            )}
            {hasCrane && (
              <g id="craneSide" transform="translate(18, 0) scale(0.92 1)">
                <use href={`#${p}craneCelestialFull`} />
              </g>
            )}
            {hasLotus && (
              <g id="lotusSide" transform="translate(18, 0) scale(0.92 1)">
                <use href={`#${p}lotusLagoonFull`} />
              </g>
            )}
            {hasTuQuy && (
              <g id="tuQuySide" transform="translate(18, 0) scale(0.92 1)">
                <use href={`#${p}tuQuyBrocadeFull`} />
              </g>
            )}
            {hasSword && (
              <g id="swordSide" transform="translate(18, 0) scale(0.92 1)">
                <use href={`#${p}swordLegendFull`} />
              </g>
            )}
            {hasTree && (
              <g id="treeSide" transform="translate(16, 0) scale(0.92 1)">
                <use href={`#${p}pineBambooFull`} />
              </g>
            )}
            {hasBlackClouds && (
              <g id="blackCloudsSide" transform="translate(18, 0) scale(0.92 1)">
                <use href={`#${p}blackCloudSwirlFull`} />
              </g>
            )}
            {hasGoldenLeaves && (
              <g id="goldenLeavesSide" transform="translate(18, 0) scale(0.92 1)">
                <use href={`#${p}goldenLeavesFull`} />
              </g>
            )}
            {hasCloudSwirl && !hasBlackClouds && (
              <g id="cloudsSide" transform="translate(18, 0) scale(0.92 1)">
                <use href={`#${p}cloudSwirlFull`} />
              </g>
            )}
            {!hasExplicitMotifs && isNhatBinh && (
              <g id="nhatBinhSideWave" transform="translate(250, 532)">
                <use href={`#${p}thuyBaHemUnit`} />
              </g>
            )}
          </g>

          {/* FITTED WAIST CINCH SIDE */}
          {hasFittedWaist && (
            <g id="fittedWaistSide">
              <path
                d="M 226 308 Q 252 312 266 312 L 263 340 Q 248 340 224 336 Z"
                fill={beltColor}
                stroke="#F59E0B"
                strokeWidth="2"
              />
              <circle cx="258" cy="324" r="4.5" fill="#047857" stroke="#F59E0B" strokeWidth="1.2" />
              <path d="M 258 328 Q 260 385 256 440" stroke={u(`${p}beltGrad`)} strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          )}

          {hasCyberBadge && (
            <g id="badgeCyberSide" transform="translate(245, 185) scale(0.9)">
              <use href={`#${p}stickerCyberBadge`} />
            </g>
          )}

          {/* Cánh tay góc nghiêng (Leading arm in 3/4 stance) */}
          <g id="armSide">
            <path
              d="M 250 150 C 275 190 290 240 285 295 Q 282 325 275 345 L 255 338 Q 262 285 260 230 L 245 180 Z"
              fill={bodyColor}
            />
            {/* Nếu là Nhật Bình: Cổ tay ngũ sắc! */}
            {isNhatBinh ? (
              <g id="cuffNhatBinhSide" transform="translate(255, 338)">
                <line x1="0" y1="0" x2="20" y2="7" stroke="#1E3A8A" strokeWidth="2.5" />
                <line x1="0" y1="-3" x2="20" y2="4" stroke="#FBBF24" strokeWidth="2.2" />
                <line x1="0" y1="-6" x2="20" y2="1" stroke="#FFFFFF" strokeWidth="2" />
                <line x1="0" y1="-9" x2="20" y2="-2" stroke="#DC2626" strokeWidth="2" />
                <line x1="0" y1="-12" x2="20" y2="-5" stroke="#059669" strokeWidth="2" />
              </g>
            ) : (
              <path d="M 275 345 L 255 338" stroke="#F59E0B" strokeWidth="2.5" />
            )}
            <path
              d="M 275 345 C 278 358 274 368 268 370 C 264 368 260 358 258 340 Z"
              fill={isFemale ? u(`${p}femaleSkinGrad`) : u(`${p}maleSkinGrad`)}
              stroke={isFemale ? "#FBCFE8" : "#D4A373"}
              strokeWidth="0.8"
            />
          </g>

          {/* Mặt góc nghiêng 3/4 */}
          <g id="headSide">
            <path
              d={
                isFemale
                  ? "M 215 58 C 210 86 225 110 245 116 C 262 110 272 88 268 58 C 262 36 220 36 215 58 Z"
                  : "M 215 56 L 210 82 L 225 110 L 245 115 L 265 105 L 270 78 L 265 56 Z"
              }
              fill={isFemale ? u(`${p}femaleSkinGrad`) : u(`${p}maleSkinGrad`)}
            />
            {/* Eye 3/4 */}
            {isFemale ? (
              <>
                <path d="M 240 74 Q 250 68 258 75" stroke="#1E1926" strokeWidth="2.8" fill="none" strokeLinecap="round" />
                <ellipse cx="250" cy="78" rx="4.5" ry="6" fill="#4C1D95" />
                <circle cx="248" cy="75" r="1.8" fill="#FFFFFF" />
                <path d="M 262 76 L 266 84 L 260 86" stroke="#D97706" strokeWidth="1" fill="none" />
                <path d="M 245 98 Q 252 101 258 98" stroke="#E11D48" strokeWidth="1.8" fill="none" />
              </>
            ) : (
              <>
                <polygon points="238,68 256,64 254,67 238,69" fill="#0F172A" />
                <path d="M 240 74 L 258 75" stroke="#0F172A" strokeWidth="2.8" fill="none" strokeLinecap="round" />
                <ellipse cx="250" cy="78" rx="4" ry="5.2" fill="#0284C7" />
                <circle cx="248" cy="76" r="1.6" fill="#FFFFFF" />
                <path d="M 260 76 L 266 86 L 262 88" stroke="#B45309" strokeWidth="1.2" fill="none" />
                <line x1="245" y1="99" x2="258" y2="99" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
              </>
            )}
            <path d="M 220 54 Q 240 76 255 58 Q 262 74 268 52 Z" fill={isFemale ? u(`${p}femaleHairGrad`) : u(`${p}maleHairGrad`)} />
          </g>
        </g>
      )}

      {/* -------------------------------------------------------------------
          MẶT SAU / LƯNG (BACK VIEW)
      -------------------------------------------------------------------- */}
      {viewAngle === "back" && (
        <g id="viewBack">
          {/* Tóc xõa phía sau */}
          {isFemale ? (
            <g id="femaleHairBack">
              <path
                d="M 190 50 C 180 120 170 250 178 360 C 182 390 278 390 282 360 C 290 250 280 120 270 50 Z"
                fill="#281834"
              />
              <path d="M 215 140 Q 230 155 245 140" stroke="#F472B6" strokeWidth="3" fill="none" />
            </g>
          ) : (
            <g id="maleHairBack">
              <path d="M 195 50 L 190 95 L 270 95 L 265 50 Z" fill="#1E293B" />
            </g>
          )}

          {/* Quần phía sau */}
          <g id="pantsBack">
            <path
              d={isFemale ? "M 192 345 L 175 645 L 222 645 L 228 375 Z" : "M 172 360 L 138 645 L 208 645 L 226 395 Z"}
              fill={pantsColor}
              stroke="#CBD5E1"
              strokeWidth="0.8"
            />
            <path
              d={isFemale ? "M 232 375 L 238 645 L 285 645 L 268 345 Z" : "M 234 395 L 252 645 L 322 645 L 288 360 Z"}
              fill={pantsColor}
              stroke="#CBD5E1"
              strokeWidth="0.8"
            />
          </g>

          {/* Thân áo phía sau theo từng dòng áo */}
          <g id="robeBack">
            <path
              d={
                isFemale
                  ? "M 185 145 Q 195 240 190 310 Q 170 425 156 575 Q 230 585 304 575 Q 290 425 270 310 Q 265 240 275 145 Z"
                  : "M 148 145 L 168 325 L 140 580 Q 230 592 320 580 L 292 325 L 312 145 Z"
              }
              fill={bodyColor}
            />

            {/* ĐƯỜNG SỐNG LƯNG (TRADITIONAL CENTER SPINE SEAM) */}
            <line
              x1="230"
              y1={isNhatBinh ? "190" : "135"}
              x2="230"
              y2="578"
              stroke="#F59E0B"
              strokeWidth="2.5"
              strokeDasharray={isNhatBinh ? "none" : "8,4"}
            />

            {/* Cổ áo phía sau */}
            {isNhatBinh && isFemale ? (
              // Cổ chữ nhật Nhật Bình phía sau gáy (Nữ)
              <g id="nhatBinhBackCollar">
                <path d="M 205 125 L 255 125 L 255 155 L 205 155 Z" fill="#047857" stroke="#F59E0B" strokeWidth="1.5" />
                <path d="M 202 122 L 258 122 L 258 158 L 202 158 Z" fill="none" stroke="#FBBF24" strokeWidth="2.5" />
                <path d="M 199 119 L 261 119 L 261 161 L 199 161 Z" fill="none" stroke="#DC2626" strokeWidth="2.5" />
              </g>
            ) : (
              // Cổ đứng phía sau
              <path
                d={
                  isFemale
                    ? "M 214 116 Q 230 114 246 116 L 246 138 Q 230 136 214 138 Z"
                    : "M 211 114 Q 230 110 249 114 L 249 138 Q 230 136 211 138 Z"
                }
                fill={collarColor}
                stroke="#F59E0B"
                strokeWidth={isFemale ? "2" : "2.4"}
              />
            )}
          </g>

          {/* -------------------------------------------------------------
              GRAND BACK EMBROIDERY CENTERPIECE (ĐẠI BẢN HOA VĂN LƯNG & CHÂN TÀ)
          -------------------------------------------------------------- */}
          <g id="backCenterpiece">
            {/* Silhouette-clipped back embroidery */}
            <g id="robeBackEmbroideryClipped" clipPath={isFemale ? u(`${p}robeBackClipFemale`) : u(`${p}robeBackClipMale`)}>
              {/* Thủy Ba wave hem at the back */}
              <g transform="translate(230, 532)">
                <use href={`#${p}thuyBaHemUnit`} />
              </g>

              {/* Dragon Medallion on back spine */}
              {hasDragon && !hasPhoenix && (
                <g id="dragonBack" transform="translate(230, 260) scale(1.15)">
                  <use href={`#${p}dragonBackMedallion`} />
                  <use href={`#${p}cloudSwirl`} x="180" y="340" transform="scale(0.85)" />
                  <use href={`#${p}cloudSwirl`} x="235" y="420" transform="scale(0.9)" />
                </g>
              )}

              {/* Phoenix back centerpiece */}
              {hasPhoenix && (
                <g id="phoenixBack">
                  <use href={`#${p}phoenixImperialFull`} />
                </g>
              )}

              {/* Black Clouds back centerpiece (Hắc Vân Anime Wibu) */}
              {hasBlackClouds && (
                <g id="blackCloudsBack">
                  <use href={`#${p}blackCloudSwirlFull`} />
                </g>
              )}

              {/* Golden Leaves back centerpiece */}
              {hasGoldenLeaves && (
                <g id="goldenLeavesBack">
                  <use href={`#${p}goldenLeavesFull`} />
                </g>
              )}

              {/* Cloud swirls back */}
              {hasCloudSwirl && !hasBlackClouds && !hasDragon && !hasPhoenix && (
                <g id="cloudsBack">
                  <use href={`#${p}cloudSwirlFull`} />
                </g>
              )}

              {/* Peach blossom branch sweeping across back */}
              {hasPeachBlossom && (
                <g id="peachBack">
                  <use href={`#${p}peachBlossomFull`} />
                </g>
              )}

              {/* Lotus lagoon back */}
              {hasLotus && (
                <g id="lotusBack">
                  <use href={`#${p}lotusLagoonFull`} />
                </g>
              )}

              {/* Crane celestial back */}
              {hasCrane && (
                <g id="craneBack">
                  <use href={`#${p}craneCelestialFull`} />
                </g>
              )}

              {/* Tứ quý brocade back */}
              {hasTuQuy && (
                <g id="tuQuyBack">
                  <use href={`#${p}tuQuyBrocadeFull`} />
                </g>
              )}

              {/* Sword Legend back centerpiece */}
              {hasSword && (
                <g id="swordBack">
                  <use href={`#${p}swordLegendFull`} />
                </g>
              )}

              {/* Pine & Bamboo back centerpiece */}
              {hasTree && (
                <g id="treeBack">
                  <use href={`#${p}pineBambooFull`} />
                </g>
              )}
            </g>

            {/* FITTED WAIST CINCH BACK */}
            {hasFittedWaist && (
              <g id="fittedWaistBack">
                <path
                  d={
                    isFemale
                      ? "M 194 302 Q 230 312 266 302 L 264 336 Q 230 348 196 336 Z"
                      : "M 180 306 Q 230 314 280 306 L 278 340 Q 230 350 182 340 Z"
                  }
                  fill={beltColor}
                  stroke="#F59E0B"
                  strokeWidth="2.2"
                />
                <path d="M 222 308 L 238 318 M 238 308 L 222 318 M 222 320 L 238 330 M 238 320 L 222 330" stroke="#FEF08A" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M 226 336 Q 220 400 222 460" stroke={u(`${p}beltGrad`)} strokeWidth="3.2" fill="none" strokeLinecap="round" />
                <path d="M 234 336 Q 240 400 238 460" stroke="#F59E0B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </g>
            )}

            {/* Hai dải ngũ sắc thắt lưng rủ phía sau áo Nhật Bình (chỉ dành cho nữ) */}
            {isNhatBinh && isFemale && (
              <g id="nhatBinhBackRibbons" transform="translate(230, 310)">
                <path d="M -8 0 Q -12 60 -10 120" stroke="#DC2626" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M 0 0 Q 0 60 2 120" stroke="#F59E0B" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M 8 0 Q 12 60 10 120" stroke="#059669" strokeWidth="3" fill="none" strokeLinecap="round" />
              </g>
            )}

            {/* Streetwear back graphic tag for Gen Z */}
            {hasVietTag && (
              <g id="backVietTag" transform="translate(230, 420) scale(1.3)">
                <use href={`#${p}stickerVietTag`} />
              </g>
            )}
          </g>

          {/* Cánh tay phía sau (Back view A-pose) */}
          <g id="armsBack">
            <path
              d={
                isFemale
                  ? "M 185 145 C 145 175 120 230 128 290 Q 134 325 144 348 L 168 340 Q 156 285 156 230 L 195 175 Z"
                  : "M 148 145 C 106 178 86 240 100 305 Q 108 340 120 365 L 150 358 Q 136 290 140 230 L 170 185 Z"
              }
              fill={bodyColor}
              stroke="rgba(0, 0, 0, 0.12)"
              strokeWidth="0.8"
            />
            {isNhatBinh && isFemale ? (
              <g id="cuffNhatBinhBackLeft" transform="translate(144, 340)">
                <line x1="0" y1="0" x2="24" y2="-8" stroke="#1E3A8A" strokeWidth="2.5" />
                <line x1="0" y1="-3" x2="24" y2="-11" stroke="#FBBF24" strokeWidth="2.2" />
                <line x1="0" y1="-6" x2="24" y2="-14" stroke="#DC2626" strokeWidth="2" />
              </g>
            ) : (
              <path d={isFemale ? "M 144 348 L 168 340" : "M 120 365 L 150 358"} stroke="#F59E0B" strokeWidth={isFemale ? "2.5" : "3.2"} />
            )}

            <path
              d={
                isFemale
                  ? "M 275 145 C 315 175 340 230 332 290 Q 326 325 316 348 L 292 340 Q 304 285 304 230 L 265 175 Z"
                  : "M 312 145 C 354 178 374 240 360 305 Q 352 340 340 365 L 310 358 Q 324 290 320 230 L 290 185 Z"
              }
              fill={bodyColor}
              stroke="rgba(0, 0, 0, 0.12)"
              strokeWidth="0.8"
            />
            {isNhatBinh && isFemale ? (
              <g id="cuffNhatBinhBackRight" transform="translate(292, 340)">
                <line x1="0" y1="0" x2="24" y2="8" stroke="#1E3A8A" strokeWidth="2.5" />
                <line x1="0" y1="-3" x2="24" y2="5" stroke="#FBBF24" strokeWidth="2.2" />
                <line x1="0" y1="-6" x2="24" y2="2" stroke="#DC2626" strokeWidth="2" />
              </g>
            ) : (
              <path d={isFemale ? "M 316 348 L 292 340" : "M 340 365 L 310 358"} stroke="#F59E0B" strokeWidth={isFemale ? "2.5" : "3.2"} />
            )}
          </g>
        </g>
      )}

      {/* =====================================================================
          ACCESSORIES OVERLAYS: NÓN, KHĂN, KÍNH, MŨ, GIÀY
      ====================================================================== */}

      {/* Khăn Đóng / Khăn Xếp Triều Nguyễn */}
      {hasKhanDong && (
        <g id="animeKhanDong">
          {isFemale ? (
            <>
              {/* Khăn Vành Dây Hoàng Cung Nữ */}
              <ellipse
                cx="230"
                cy={viewAngle === "back" ? "32" : "38"}
                rx="44"
                ry="18"
                fill="#0F172A"
                stroke="#F59E0B"
                strokeWidth="2.2"
              />
              <path
                d={viewAngle === "back" ? "M 190 32 Q 230 24 270 32" : "M 190 38 Q 230 46 270 38"}
                stroke="#F59E0B"
                strokeWidth="2"
                fill="none"
              />
            </>
          ) : (
            <>
              {/* Khăn Đóng Nam Triều Nguyễn (Nếp Gấp Chữ Nhân 人 Đặc Trưng) */}
              <ellipse
                cx="230"
                cy={viewAngle === "back" ? "30" : "36"}
                rx="48"
                ry="17"
                fill="#09090B"
                stroke="#F59E0B"
                strokeWidth="1.8"
              />
              <ellipse cx="230" cy={viewAngle === "back" ? "26" : "30"} rx="45" ry="13" fill="#18181B" />
              {/* Các nếp quấn khăn xếp */}
              <path d="M 186 36 Q 230 44 274 36" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" fill="none" />
              <path d="M 188 32 Q 230 40 272 32" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" fill="none" />
              <path d="M 190 28 Q 230 36 270 28" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" fill="none" />
              {/* Đỉnh nếp gấp Chữ Nhân (人) trước trán */}
              {viewAngle !== "back" && (
                <>
                  <path d="M 222 46 L 230 34 L 238 46" stroke="#F59E0B" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M 223 42 L 230 32 L 237 42" stroke="#E2E8F0" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </>
              )}
            </>
          )}
        </g>
      )}

      {/* Khăn Mỏ Quạ Bắc Bộ (Nữ) & Khăn Xếp Liền Anh (Nam) */}
      {hasKhanMoQua && !hasKhanDong && !hasCap && (
        <g id="animeKhanMoQua">
          {isFemale ? (
            <>
              <path
                d="M 194 48 Q 230 18 266 48 L 260 65 Q 230 56 200 65 Z"
                fill="#09090B"
                stroke="#27272A"
                strokeWidth="1.2"
              />
              <polygon points="230,65 225,55 235,55" fill="#09090B" />
            </>
          ) : (
            <>
              {/* Nam giới Quan Họ: Khăn Xếp Liền Anh */}
              <ellipse cx="230" cy="36" rx="46" ry="16" fill="#18181B" stroke="#3F3F46" strokeWidth="1.5" />
              <path d="M 190 38 Q 230 46 270 38" stroke="#52525B" strokeWidth="1.5" fill="none" />
              <path d="M 223 46 L 230 36 L 237 46" stroke="#CBD5E1" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </>
          )}
        </g>
      )}

      {/* Nón Quai Thao Duyên Dáng */}
      {hasNonQuaiThao && (
        <g id="animeNonQuaiThao">
          {/* Vành nón thúng tròn rộng */}
          <ellipse cx="230" cy="28" rx="68" ry="18" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
          <ellipse cx="230" cy="28" rx="55" ry="14" fill="#FDE68A" stroke="#B45309" strokeWidth="1" />
          {/* Đỉnh nón phẳng */}
          <ellipse cx="230" cy="24" rx="28" ry="8" fill="#F59E0B" />
          {/* Quai thao lụa hồng buông hai bên */}
          <path d="M 180 32 Q 170 120 185 220" stroke="#F472B6" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 280 32 Q 290 120 275 220" stroke="#F472B6" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      )}

      {/* Mũ Streetwear */}
      {hasCap && !hasKhanDong && (
        <g id="animeStreetwearCap">
          <path d="M 192 48 Q 230 18 268 48 L 265 58 Q 230 48 195 58 Z" fill="#18181B" />
          <path d="M 190 56 Q 230 50 270 56 L 282 66 Q 230 54 178 66 Z" fill="#27272A" stroke="#52525B" strokeWidth="1" />
        </g>
      )}

      {/* Kính Râm Cyberpunk Y2K */}
      {hasKinhRam && viewAngle === "front" && (
        <g id="animeKinhRam">
          <path d="M 206 74 L 254 74 L 252 83 L 208 83 Z" fill="rgba(15, 23, 42, 0.92)" stroke="#06B6D4" strokeWidth="1.6" />
          <line x1="206" y1="76" x2="254" y2="76" stroke="#EC4899" strokeWidth="1" />
          <circle cx="215" cy="78" r="1.5" fill="#38BDF8" />
          <circle cx="245" cy="78" r="1.5" fill="#38BDF8" />
        </g>
      )}

      {/* FOOTWEAR (GIÀY DÉP) */}
      {/* 1. Combat Boots */}
      {hasCombatBoot && (
        <g id="animeCombatBoots">
          <path d={isFemale ? "M 166 615 L 220 615 L 222 668 L 164 668 Z" : "M 140 615 L 205 615 L 208 672 L 138 672 Z"} fill="#18181B" />
          <rect x={isFemale ? "160" : "134"} y={isFemale ? "662" : "666"} width={isFemale ? "66" : "78"} height="12" rx="3" fill="#27272A" stroke="#52525B" strokeWidth="1.2" />
          <path d={isFemale ? "M 238 615 L 292 615 L 294 668 L 236 668 Z" : "M 252 615 L 318 615 L 320 672 L 250 672 Z"} fill="#18181B" />
          <rect x={isFemale ? "232" : "246"} y={isFemale ? "662" : "666"} width={isFemale ? "66" : "78"} height="12" rx="3" fill="#27272A" stroke="#52525B" strokeWidth="1.2" />
        </g>
      )}

      {/* 2. Sneaker Trắng */}
      {hasSneaker && (
        <g id="animeSneakers">
          <path d={isFemale ? "M 170 638 Q 185 630 214 638 L 218 670 L 166 670 Z" : "M 142 638 Q 160 630 198 638 L 202 674 L 138 674 Z"} fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          <rect x={isFemale ? "164" : "134"} y={isFemale ? "662" : "666"} width={isFemale ? "56" : "68"} height="10" rx="3.5" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="1.2" />
          <path d={isFemale ? "M 246 638 Q 261 630 288 638 L 292 670 L 242 670 Z" : "M 262 638 Q 280 630 315 638 L 320 674 L 258 674 Z"} fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          <rect x={isFemale ? "240" : "254"} y={isFemale ? "662" : "666"} width={isFemale ? "56" : "68"} height="10" rx="3.5" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="1.2" />
        </g>
      )}

      {/* 3. Hài Thêu Mũi Cong Hoàng Cung */}
      {hasHaiTheu && (
        <g id="animeHaiTheu">
          <path d={isFemale ? "M 175 642 Q 192 638 215 642 L 218 668 L 165 668 Q 160 655 175 642 Z" : "M 148 642 Q 170 638 200 642 L 204 670 L 138 670 Q 132 655 148 642 Z"} fill="#DC2626" stroke="#F59E0B" strokeWidth="1.8" />
          {/* Mũi cong vút */}
          <path d={isFemale ? "M 165 668 Q 155 658 162 648" : "M 138 670 Q 128 660 135 650"} stroke="#F59E0B" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d={isFemale ? "M 245 642 Q 268 638 285 642 Q 300 655 295 668 L 242 668 Z" : "M 260 642 Q 290 638 312 642 Q 328 655 322 670 L 256 670 Z"} fill="#DC2626" stroke="#F59E0B" strokeWidth="1.8" />
          <path d={isFemale ? "M 295 668 Q 305 658 298 648" : "M 322 670 Q 332 660 325 650"} stroke="#F59E0B" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      )}

      {/* 4. Guốc Mộc Quai Lụa */}
      {hasGuocMoc && (
        <g id="animeGuocMoc">
          {/* Đế gỗ mộc */}
          <rect x={isFemale ? "168" : "140"} y="658" width={isFemale ? "50" : "60"} height="10" rx="3" fill="#78350F" stroke="#451A03" strokeWidth="1" />
          <path d={isFemale ? "M 178 658 Q 192 646 208 658" : "M 152 658 Q 170 646 190 658"} stroke="#DC2626" strokeWidth="4" fill="none" strokeLinecap="round" />
          <rect x={isFemale ? "242" : "260"} y="658" width={isFemale ? "50" : "60"} height="10" rx="3" fill="#78350F" stroke="#451A03" strokeWidth="1" />
          <path d={isFemale ? "M 252 658 Q 266 646 282 658" : "M 272 658 Q 290 646 310 658"} stroke="#DC2626" strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
      )}

      {/* 5. Loafer Chunky */}
      {hasLoafer && (
        <g id="animeLoafer">
          <path d={isFemale ? "M 170 642 L 216 642 L 218 668 L 166 668 Z" : "M 142 642 L 202 642 L 204 670 L 138 670 Z"} fill="#0F172A" />
          <rect x={isFemale ? "164" : "136"} y="662" width={isFemale ? "56" : "70"} height="8" rx="2" fill="#1E293B" />
          <circle cx={isFemale ? "192" : "170"} cy="648" r="3" fill="#F59E0B" />
          <path d={isFemale ? "M 244 642 L 290 642 L 292 668 L 242 668 Z" : "M 258 642 L 318 642 L 320 670 L 256 670 Z"} fill="#0F172A" />
          <rect x={isFemale ? "240" : "254"} y="662" width={isFemale ? "56" : "70"} height="8" rx="2" fill="#1E293B" />
          <circle cx={isFemale ? "268" : "288"} cy="648" r="3" fill="#F59E0B" />
        </g>
      )}

      {/* 6. Giày lụa mặc định */}
      {!hasCombatBoot && !hasSneaker && !hasHaiTheu && !hasGuocMoc && !hasLoafer && (
        <g id="animeDefaultShoes">
          <ellipse cx={isFemale ? "192" : "170"} cy={isFemale ? "650" : "655"} rx={isFemale ? "22" : "26"} ry="9" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1.2" />
          <ellipse cx={isFemale ? "268" : "290"} cy={isFemale ? "650" : "655"} rx={isFemale ? "22" : "26"} ry="9" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1.2" />
        </g>
      )}

      {/* =====================================================================
          CULTURAL X-RAY HOTSPOTS
      ====================================================================== */}
      {showXRay && viewAngle === "front" && (
        <g id="animeCulturalHotspots">
          <g className="cursor-pointer group" onClick={() => onSelectHotspot("collar", ["ANCHOR_01", "ANCHOR_AD_01", "ANCHOR_NB_01"])}>
            <circle cx="230" cy="128" r="16" fill="rgba(224,122,95,0.25)" className="animate-ping" />
            <circle
              cx="230"
              cy="128"
              r="8"
              fill={visualState.collar === "conflict" ? "#F43F5E" : visualState.collar === "caution" ? "#F59E0B" : "#10B981"}
              stroke="#FFFFFF"
              strokeWidth="2.2"
            />
            <circle cx="230" cy="128" r="3" fill="#FFFFFF" />
          </g>

          <g className="cursor-pointer group" onClick={() => onSelectHotspot("torso", ["ANCHOR_02", "ANCHOR_03", "ANCHOR_AD_02", "ANCHOR_TT_01", "ANCHOR_NB_02"])}>
            <circle cx="230" cy="320" r="16" fill="rgba(245,158,11,0.25)" className="animate-ping" />
            <circle
              cx="230"
              cy="320"
              r="8"
              fill={visualState.torso === "conflict" ? "#F43F5E" : visualState.torso === "caution" ? "#F59E0B" : "#10B981"}
              stroke="#FFFFFF"
              strokeWidth="2.2"
            />
            <circle cx="230" cy="320" r="3" fill="#FFFFFF" />
          </g>

          <g className="cursor-pointer group" onClick={() => onSelectHotspot("feet", ["ANCHOR_AD_03"])}>
            <circle cx="230" cy="655" r="15" fill="rgba(56,189,248,0.25)" className="animate-ping" />
            <circle
              cx="230"
              cy="655"
              r="7.5"
              fill={visualState.feet === "conflict" ? "#F43F5E" : visualState.feet === "caution" ? "#F59E0B" : "#38BDF8"}
              stroke="#FFFFFF"
              strokeWidth="2.2"
            />
            <circle cx="230" cy="655" r="2.8" fill="#FFFFFF" />
          </g>
        </g>
      )}
    </svg>
  );
};
