import { OutfitConfig } from "../types/studio";
import { CalloutAnnotations, CalloutItem } from "../types/ai";

export interface ComputeCalloutParams {
  garmentId: string;
  prompt?: string;
  outfitConfig?: Partial<OutfitConfig>;
  gender?: "female" | "male";
  remixTier?: string;
  customFromAI?: CalloutAnnotations;
}

export function computeCalloutAnnotations({
  garmentId,
  prompt = "",
  outfitConfig,
  gender = "female",
  remixTier = "fusion",
  customFromAI,
}: ComputeCalloutParams): {
  collar: CalloutItem;
  sleeves: CalloutItem;
  embroidery: CalloutItem;
  body: CalloutItem;
} {
  const norm = (prompt || "").toLowerCase();
  const bodyColor = outfitConfig?.colors?.body?.toUpperCase() || "#047857";
  const collarColor = outfitConfig?.colors?.collar?.toUpperCase() || "#F59E0B";
  const motifs = outfitConfig?.motifs || [];
  const stickers = outfitConfig?.stickers || [];
  const pattern = outfitConfig?.pattern || "plain";

  // =========================================================================
  // 1. COLLAR (CỔ ÁO)
  // =========================================================================
  let collar: CalloutItem;
  if (customFromAI?.collar?.title && customFromAI?.collar?.subtitle) {
    collar = customFromAI.collar;
  } else if (norm.includes("hust") || norm.includes("bách khoa") || norm.includes("bach khoa") || (collarColor === "#FFFFFF" && bodyColor === "#DC2626")) {
    collar = {
      title: garmentId === "garment_nhatbinh_01" ? "Cổ Nhật Bình HUST" : "Cổ áo viền trắng HUST",
      subtitle: "Viền trắng tương phản sắc đỏ Bách Khoa",
    };
  } else if (norm.includes("đen") || collarColor === "#1C1917" || collarColor === "#09090B") {
    collar = {
      title: garmentId === "garment_nhatbinh_01" ? "Cổ Nhật Bình viền đen" : "Cổ áo viền huyền mặc",
      subtitle: "Tone đen tối giản sang trọng hiện đại",
    };
  } else if (collarColor === "#F59E0B" || collarColor === "#FBBF24" || collarColor === "#D97706") {
    collar = {
      title: garmentId === "garment_nhatbinh_01" ? "Cổ dải ngũ sắc viền kim" : "Cổ thêu chỉ kim tuyến",
      subtitle: "Chỉ vàng ngũ hành hoàng triều quý phái",
    };
  } else {
    switch (garmentId) {
      case "garment_nhatbinh_01":
        collar = {
          title: "Cổ Nhật Bình ngũ sắc",
          subtitle: "Bản chữ nhật viền ngũ hành đối khâm",
        };
        break;
      case "garment_nguthan_01":
        collar = {
          title: "Cổ đứng lập lĩnh",
          subtitle: "Cổ cao 2-3cm, 5 khuy cài hữu chuẩn mực",
        };
        break;
      case "garment_aodai_01":
        collar = {
          title: "Cổ áo dài truyền thống",
          subtitle: gender === "female" ? "Cổ trụ 3cm thanh thoát tôn dáng" : "Cổ đứng nghiêm trang chững chạc",
        };
        break;
      case "garment_tuthan_01":
      default:
        collar = {
          title: "Cổ yếm đào & giao lĩnh",
          subtitle: "Yếm lụa bên trong khoác ngoài cổ phóng",
        };
        break;
    }
  }

  // =========================================================================
  // 2. SLEEVES (TAY ÁO)
  // =========================================================================
  let sleeves: CalloutItem;
  if (customFromAI?.sleeves?.title && customFromAI?.sleeves?.subtitle) {
    sleeves = customFromAI.sleeves;
  } else {
    switch (garmentId) {
      case "garment_nhatbinh_01":
        if (norm.includes("anime") || norm.includes("wibu") || pattern === "anime") {
          sleeves = {
            title: "Tay thụng Anime Wibu",
            subtitle: "Dải ngũ sắc phong cách cosplay phá cách",
          };
        } else if (norm.includes("khỏe khoắn") || norm.includes("hiện đại") || norm.includes("streetwear") || norm.includes("sneaker") || norm.includes("canvas") || remixTier === "genz") {
          sleeves = {
            title: "Tay thụng Gen Z",
            subtitle: "Phóng khoáng, khỏe khoắn phong cách hiện đại",
          };
        } else {
          sleeves = {
            title: "Tay áo rộng cung đình",
            subtitle: "Dải ngũ sắc hoàng triều thanh cao",
          };
        }
        break;

      case "garment_nguthan_01":
        if (gender === "male") {
          sleeves = {
            title: remixTier === "genz" ? "Tay áo thụng cách tân" : "Tay thụng lễ nghi",
            subtitle: "Khoan thai đoan trang chuẩn đạo Nho",
          };
        } else {
          sleeves = {
            title: "Tay chẽn ngũ thân",
            subtitle: "Ôm gọn cổ tay, linh hoạt nhã nhặn",
          };
        }
        break;

      case "garment_aodai_01":
        sleeves = {
          title: "Tay áo Raglan",
          subtitle: remixTier === "genz" ? "Tay raglan phối cách tân trẻ trung" : "Nối raglan ôm mềm mại không nếp gấp",
        };
        break;

      case "garment_tuthan_01":
      default:
        sleeves = {
          title: "Tay áo chẽn dân gian",
          subtitle: remixTier === "genz" ? "Tay chẽn năng động hội nhập hè phố" : "Gọn gàng tiện lợi trẩy hội Kinh Bắc",
        };
        break;
    }
  }

  // =========================================================================
  // 3. EMBROIDERY (HỌA TIẾT THÊU)
  // =========================================================================
  let embroidery: CalloutItem;
  if (customFromAI?.embroidery?.title && customFromAI?.embroidery?.subtitle) {
    embroidery = customFromAI.embroidery;
  } else if (
    motifs.includes("golden_leaves") ||
    motifs.includes("falling_leaves") ||
    norm.includes("lá vàng") ||
    norm.includes("lá vàng rơi") ||
    norm.includes("la vang") ||
    norm.includes("lá rơi") ||
    norm.includes("lá phong") ||
    norm.includes("autumn") ||
    norm.includes("hoàng diệp")
  ) {
    embroidery = {
      title: "Lá Vàng Rơi Hoàng Kim",
      subtitle: "Lá thu vàng bay lượn nhẹ nhàng trên tà áo",
    };
  } else if (
    motifs.includes("cloud_black") ||
    norm.includes("mây màu đen") ||
    norm.includes("mây đen") ||
    norm.includes("hắc vân") ||
    norm.includes("black cloud")
  ) {
    embroidery = {
      title: norm.includes("anime") || norm.includes("wibu") || pattern === "anime" ? "Hắc Vân Anime Wibu" : "Họa tiết Hắc Vân",
      subtitle: "Mây đen huyền mặc viền đỏ ánh kim",
    };
  } else if (motifs.includes("cloud_swirl") || norm.includes("vân mây") || norm.includes("mây ngũ sắc")) {
    embroidery = {
      title: "Vân Mây Ngũ Sắc",
      subtitle: "Mây lành tường vân cung đình cát tường",
    };
  } else if (motifs.includes("dragon") || norm.includes("rồng") || norm.includes("long")) {
    embroidery = {
      title: "Rồng Hoàng Triều",
      subtitle: "Thêu chỉ kim tuyến quyền uy thiên tử",
    };
  } else if (motifs.includes("phoenix") || norm.includes("phượng") || norm.includes("phụng")) {
    embroidery = {
      title: "Phượng Hoàng Cung",
      subtitle: "Phụng vũ nghê thường thanh cao quý phái",
    };
  } else if (motifs.includes("lotus") || norm.includes("sen") || norm.includes("hoa sen")) {
    embroidery = {
      title: "Sen Hồng Cung Đình",
      subtitle: "Thanh tịnh thuần khiết thoát tục tao nhã",
    };
  } else if (motifs.includes("crane") || norm.includes("hạc")) {
    embroidery = {
      title: "Hạc Ngậm Sen",
      subtitle: "Trường thọ cát tường đài các hoàng gia",
    };
  } else if (motifs.includes("sword_legend") || norm.includes("kiếm") || norm.includes("gươm")) {
    embroidery = {
      title: "Thánh Kiếm Hoàng Gia",
      subtitle: "Gươm báu Thuận Thiên uy dũng hào khí",
    };
  } else if (motifs.includes("pine_bamboo") || norm.includes("tùng") || norm.includes("trúc")) {
    embroidery = {
      title: "Tùng Bách & Trúc Xanh",
      subtitle: "Trường tồn khí tiết quân tử thanh tao",
    };
  } else if (motifs.includes("tu_quy") || norm.includes("tứ quý")) {
    embroidery = {
      title: "Tứ Quý Cổ Phong",
      subtitle: "Tùng • Cúc • Trúc • Mai phú quý thịnh vượng",
    };
  } else if (stickers.length > 0) {
    embroidery = {
      title: "Sticker Streetwear Y2K",
      subtitle: stickers.includes("genz_star") ? "Ngôi sao Chrome & Badge Cyberpunk" : "Huy hiệu đương đại cá tính Gen Z",
    };
  } else {
    // Default embroidery according to garment
    switch (garmentId) {
      case "garment_nhatbinh_01":
        embroidery = {
          title: "Phượng Hoàng Cung",
          subtitle: "Thêu chỉ vàng hoàng phi tao nhã",
        };
        break;
      case "garment_nguthan_01":
        embroidery = {
          title: "Gấm Vân Mây Cung Đình",
          subtitle: "Dệt chìm hoa văn ngũ hành tôn nghiêm",
        };
        break;
      case "garment_aodai_01":
        embroidery = {
          title: "Hoa Sen & Hoa Văn Chìm",
          subtitle: "Thanh tịnh nhẹ nhàng truyền thống",
        };
        break;
      case "garment_tuthan_01":
      default:
        embroidery = {
          title: "Họa Tiết Dân Gian",
          subtitle: "Mộc mạc Kinh Bắc trẩy hội xuân",
        };
        break;
    }
  }

  // =========================================================================
  // 4. BODY / SKIRT (THÂN TÀ / THÂN ÁO)
  // =========================================================================
  let body: CalloutItem;
  if (customFromAI?.body?.title && customFromAI?.body?.subtitle) {
    body = customFromAI.body;
  } else if (norm.includes("hust") || norm.includes("bách khoa") || norm.includes("bach khoa") || bodyColor === "#DC2626") {
    body = {
      title: "Thân tà đỏ HUST",
      subtitle: "Sắc đỏ Bách Khoa kết hợp nếp áo đối khâm",
    };
  } else if (
    bodyColor === "#38BDF8" ||
    bodyColor === "#0284C7" ||
    bodyColor === "#BAE6FD" ||
    norm.includes("xanh da trời") ||
    norm.includes("xanh da troi") ||
    norm.includes("xanh dương") ||
    norm.includes("xanh duong") ||
    norm.includes("sky blue")
  ) {
    body = {
      title: "Thân tà Xanh Da Trời",
      subtitle: "Sắc xanh da trời dịu mát, hiện đại khỏe khoắn",
    };
  } else if (bodyColor === "#047857") {
    body = {
      title: "Thân tà Lục Ngọc",
      subtitle: garmentId === "garment_nhatbinh_01" ? "Sắc lục ngọc cung tần triều Nguyễn" : "Nếp tà xanh ngọc bích quý phái",
    };
  } else if (bodyColor === "#1E3A8A") {
    body = {
      title: "Thân tà Lam Cung Đình",
      subtitle: "Sắc lam vương giả quyền quý hoàng tộc",
    };
  } else if (bodyColor === "#6D28D9") {
    body = {
      title: "Thân tà Tím Huế",
      subtitle: "Nét tím mộng mơ đài các xứ Huế",
    };
  } else if (bodyColor === "#FFFFFF" || bodyColor === "#FAF8F5") {
    body = {
      title: "Thân tà Bạch Ngọc",
      subtitle: "Sắc trắng tinh khôi thanh tao thoát tục",
    };
  } else if (bodyColor === "#1C1917") {
    body = {
      title: "Thân tà Huyền Mặc",
      subtitle: "Đen tuyền huyền bí sang trọng quyền lực",
    };
  } else if (bodyColor === "#78350F") {
    body = {
      title: "Thân tà Nâu Đồng Nội",
      subtitle: "Màu nâu sồng mộc mạc dân gian",
    };
  } else {
    switch (garmentId) {
      case "garment_nhatbinh_01":
        body = {
          title: "Thân áo đối khâm",
          subtitle: "2 vạt song song buông rủ thanh nhã",
        };
        break;
      case "garment_nguthan_01":
        body = {
          title: "Thân ngũ thân 5 vạt",
          subtitle: "Ngũ thường đạo lý kín đáo nghiêm cẩn",
        };
        break;
      case "garment_aodai_01":
        body = {
          title: "Tà áo dài 2 mảnh",
          subtitle: "Thướt tha bay bổng xẻ tà cao",
        };
        break;
      case "garment_tuthan_01":
      default:
        body = {
          title: "Thân tứ thân 4 vạt",
          subtitle: "Buộc dải lưng duyên dáng Kinh Bắc",
        };
        break;
    }
  }

  return { collar, sleeves, embroidery, body };
}
