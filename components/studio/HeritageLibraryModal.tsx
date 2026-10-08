import React, { useState } from "react";
import {
  X,
  BookOpen,
  Layers,
  Sparkles,
  Shirt,
  Check,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Info,
} from "lucide-react";
import garmentsData from "@/data/garments.json" with { type: "json" };

interface HeritageLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGarment: (garmentId: string) => void;
  currentGarmentId: string;
}

export const HeritageLibraryModal: React.FC<HeritageLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectGarment,
  currentGarmentId,
}) => {
  const [activeTab, setActiveTab] = useState<"garments" | "motifs" | "guide">("garments");

  if (!isOpen) return null;

  const garments = garmentsData as any[];

  const heritageMotifs = [
    {
      id: "thuy_ba",
      title: "Thủy Ba Sóng Nước & Tam Sơn",
      dynasty: "Hoàng triều Nhà Nguyễn",
      meaning: "Biểu tượng của giang sơn vững bền, ba ngọn núi thiêng (Tam Sơn) vươn lên giữa sóng biển cuộn trào, thường thêu ở gấu áo hoàng tộc.",
      source: "Bảo tàng Lịch sử Quốc gia & Cố đô Huế",
      tag: "Điển chế Hoàng gia",
    },
    {
      id: "dragon_nguyen",
      title: "Rồng Mây Triều Nguyễn (Long Vân)",
      dynasty: "Thời Nguyễn (1802 - 1945)",
      meaning: "Rồng năm móng dành riêng cho hoàng đế; rồng bốn móng dành cho hoàng tử và quan lại cao cấp. Thể hiện quyền uy tối thượng và điềm lành mưa thuận gió hòa.",
      source: "Khâm định Đại Nam hội điển sự lệ",
      tag: "Vương quyền",
    },
    {
      id: "phoenix_trieu",
      title: "Phượng Hoàng Triều",
      dynasty: "Cung đình Huế",
      meaning: "Hình tượng linh điểu thanh cao, hiện thân của đức hạnh, sự trang nhã và chuẩn mực mẫu nghi thiên hạ của Hoàng thái hậu, Hoàng hậu và Công chúa.",
      source: "Bảo tàng Cổ vật Cung đình Huế",
      tag: "Hậu cung",
    },
    {
      id: "sen_cung_dinh",
      title: "Hoa Sen Cung Đình & Tứ Quý",
      dynasty: "Thời Lê - Nguyễn",
      meaning: "Biểu trưng cho cốt cách thanh bạch, thuần khiết 'gần bùn mà chẳng hôi tanh mùi bùn'. Kết hợp Tùng - Cúc - Trúc - Mai thể hiện sự luân chuyển bốn mùa cát tường.",
      source: "Mỹ thuật cổ truyền Việt Nam",
      tag: "Văn hóa dân tộc",
    },
    {
      id: "ngu_sac_ribbon",
      title: "Dải Ngũ Sắc Ngũ Hành",
      dynasty: "Cung đình Triều Nguyễn",
      meaning: "Năm dải màu Kim - Mộc - Thủy - Hỏa - Thổ (Trắng, Xanh, Đen/Lam, Đỏ, Vàng) nơi cửa tay và nẹp cổ áo Nhật Bình, tượng trưng cho vũ trụ hài hòa và trật tự lễ giáo.",
      source: "Quy chuẩn trang phục cung đình",
      tag: "Triết lý Ngũ Hành",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in select-none">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden text-stone-800 animate-in zoom-in-95 duration-200">
        {/* MODAL HEADER */}
        <div className="px-6 py-4 border-b border-stone-200/80 flex items-center justify-between bg-stone-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E07A5F]/10 border border-[#E07A5F]/20 flex items-center justify-center text-[#E07A5F]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-stone-900 tracking-tight">
                  THƯ VIỆN CỔ PHỤC & DI SẢN
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Bảo Chứng Văn Hóa
                </span>
              </div>
              <p className="text-xs text-stone-500 font-normal">
                Kho tàng tri thức y phục truyền thống Việt Nam & Quy chuẩn khảo cứu
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* TAB SWITCHER */}
        <div className="px-6 pt-3 border-b border-stone-100 flex items-center gap-6 text-xs font-bold bg-white shrink-0">
          <button
            onClick={() => setActiveTab("garments")}
            className={`pb-2.5 relative transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "garments"
                ? "text-[#E07A5F] font-black"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            <Shirt className="w-3.5 h-3.5" />
            <span>Tứ Đại Cổ Phục Việt</span>
            {activeTab === "garments" && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#E07A5F] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("motifs")}
            className={`pb-2.5 relative transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "motifs"
                ? "text-[#E07A5F] font-black"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Điển Chế Hoa Văn & Điểm Neo</span>
            {activeTab === "motifs" && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#E07A5F] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("guide")}
            className={`pb-2.5 relative transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "guide"
                ? "text-[#E07A5F] font-black"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Cẩm Nang Stylist Gen Z</span>
            {activeTab === "guide" && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#E07A5F] rounded-full" />
            )}
          </button>
        </div>

        {/* TAB CONTENT (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* TAB 1: GARMENTS GALLERY */}
          {activeTab === "garments" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {garments.map((g) => {
                const isSelected = g.id === currentGarmentId;
                return (
                  <div
                    key={g.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                      isSelected
                        ? "bg-[#E07A5F]/5 border-[#E07A5F] shadow-sm ring-1 ring-[#E07A5F]/40"
                        : "bg-[#FAF8F5] border-stone-200/80 hover:border-stone-300"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-white border border-stone-200 text-[#E07A5F] text-[10px] font-bold">
                          {g.dynasty.split(" (")[0]}
                        </span>
                        {isSelected && (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-[#E07A5F]">
                            <Check className="w-3.5 h-3.5" />
                            <span>Đang mặc</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-extrabold text-stone-900 mt-2.5">
                        {g.name}
                      </h3>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                        {g.description}
                      </p>

                      <div className="mt-3.5 pt-3 border-t border-stone-200/60">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                          Điểm neo bất biến (Anchors):
                        </div>
                        <ul className="text-xs text-stone-700 space-y-1">
                          {g.anchors.slice(0, 2).map((anc: any) => (
                            <li key={anc.id} className="flex items-start gap-1.5 text-[11px]">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{anc.name}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onSelectGarment(g.id);
                        onClose();
                      }}
                      className={`w-full mt-4 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? "bg-white border border-[#E07A5F] text-[#E07A5F]"
                          : "bg-[#E07A5F] text-white hover:bg-[#d86e52] shadow-xs"
                      }`}
                    >
                      <span>{isSelected ? "Đang chọn trang phục này" : "Mặc Thử Trên Người Mẫu"}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: MOTIFS & CULTURAL CODES */}
          {activeTab === "motifs" && (
            <div className="space-y-3.5">
              {heritageMotifs.map((motif) => (
                <div
                  key={motif.id}
                  className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 hover:border-stone-300 transition-all flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#E07A5F]" />
                      <h4 className="text-xs font-black text-stone-900">{motif.title}</h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-200/70 text-stone-600">
                      {motif.tag}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed pl-4">
                    {motif.meaning}
                  </p>

                  <div className="flex items-center gap-3 text-[10.5px] text-stone-400 pl-4 mt-1">
                    <span>Thời kỳ: <strong className="text-stone-700">{motif.dynasty}</strong></span>
                    <span>•</span>
                    <span>Tư liệu tham chiếu: <em className="text-stone-700">{motif.source}</em></span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: STYLING GUIDE */}
          {activeTab === "guide" && (
            <div className="space-y-4 text-xs text-stone-700 leading-relaxed">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900">
                <h4 className="font-extrabold text-sm mb-1">
                  💡 Quy Chuẩn Phối Đồ Di Sản Đương Đại
                </h4>
                <p>
                  Việt Phục Remix khuyến khích tinh thần sáng tạo của Gen Z khi ứng dụng trang phục truyền thống vào đời sống hàng ngày (Kỷ yếu, dạo phố, cà phê, sự kiện), với tôn chỉ: <strong>Bảo tồn cốt lõi - Tự do cách tân diện mạo</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl bg-white border border-stone-200">
                  <h5 className="font-bold text-stone-900 text-xs mb-2 flex items-center gap-1.5">
                    <span className="text-emerald-600">✓</span> Được khuyến khích (Safe / Creative)
                  </h5>
                  <ul className="space-y-1.5 text-[11px] text-stone-600 list-disc list-inside">
                    <li>Phối áo dài / ngũ thân cùng giày sneaker trắng, loafer hiện đại</li>
                    <li>Sử dụng quạt lụa đào, ngọc bội hoặc kính râm Y2K cá tính</li>
                    <li>Thay đổi bảng màu sắc tươi trẻ phù hợp kỷ yếu và lễ hội</li>
                    <li>Sử dụng túi tote vải canvas in họa tiết văn hóa dân gian</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-stone-200">
                  <h5 className="font-bold text-stone-900 text-xs mb-2 flex items-center gap-1.5">
                    <span className="text-rose-600">✗</span> Cần tránh (Cultural Conflict)
                  </h5>
                  <ul className="space-y-1.5 text-[11px] text-stone-600 list-disc list-inside">
                    <li>Cắt ngắn vạt áo ngũ thân, áo nhật bình gây biến dạng cấu trúc</li>
                    <li>Bỏ hàng 5 cúc cài truyền thống hoặc xẻ tà sai điển chế</li>
                    <li>Xuyên tạc họa tiết hoàng triều bằng hình ảnh phản cảm</li>
                    <li>Mặc cổ áo hở quá sâu làm mất sự đoan trang thanh lịch</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-3.5 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-stone-500 shrink-0">
          <span>Hệ thống dữ liệu bảo chứng bởi Viện Văn hóa & Di sản</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-900 text-white font-bold hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Đóng Thư Viện
          </button>
        </div>
      </div>
    </div>
  );
};
