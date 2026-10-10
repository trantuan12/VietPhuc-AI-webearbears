import React, { useState } from "react";
import sourcesData from "../../data/sources.json" with { type: "json" };
import { CulturalAnchor, ApprovedFact, Source, TargetVisual } from "../../types/culture";
import { BookOpen, ExternalLink, Bookmark, HelpCircle, CheckCircle2 } from "lucide-react";

const allSources: Source[] = sourcesData as Source[];

interface HeritageAnchorsProps {
  anchors: CulturalAnchor[];
  educationalFacts: ApprovedFact[];
  onSelectTargetVisual?: (target: TargetVisual) => void;
}

export const HeritageAnchors: React.FC<HeritageAnchorsProps> = ({
  anchors,
  educationalFacts,
  onSelectTargetVisual,
}) => {
  const [activeTab, setActiveTab] = useState<"anchors" | "facts" | "sources">("anchors");

  const getSourcesByIds = (ids: string[]) => {
    return allSources.filter((s) => ids.includes(s.id));
  };

  return (
    <div className="flex flex-col gap-3 p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 shadow-xl">
      {/* Tab Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-bold text-neutral-100 uppercase tracking-wide">
            Cơ sở dữ liệu di sản (Đã thẩm định)
          </h3>
        </div>

        <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
          <button
            type="button"
            onClick={() => setActiveTab("anchors")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              activeTab === "anchors"
                ? "bg-amber-500 text-neutral-950 shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Điểm neo cốt lõi ({anchors.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("facts")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              activeTab === "facts"
                ? "bg-amber-500 text-neutral-950 shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Tri thức giáo dục ({educationalFacts.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("sources")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              activeTab === "sources"
                ? "bg-amber-500 text-neutral-950 shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Nguồn trích dẫn ({allSources.length})
          </button>
        </div>
      </div>

      {/* Tab: Điểm neo cốt lõi (Anchors) */}
      {activeTab === "anchors" && (
        <div className="flex flex-col gap-2.5 pt-1">
          {anchors.map((anchor) => {
            const anchorSources = getSourcesByIds(anchor.source_ids);
            return (
              <div
                key={anchor.id}
                className="p-3.5 rounded-xl bg-neutral-950/50 border border-neutral-800/80 hover:border-neutral-700 transition flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <h4 className="text-xs font-bold text-neutral-200">
                      {anchor.name}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectTargetVisual?.(anchor.target_visual)}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-amber-300 hover:border-amber-500/40 transition cursor-pointer"
                  >
                    Vùng: {anchor.target_visual}
                  </button>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  {anchor.description}
                </p>

                {anchorSources.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] text-neutral-500">
                    <span className="font-medium text-neutral-400">Nguồn thẩm định:</span>
                    {anchorSources.map((s) => (
                      <span
                        key={s.id}
                        className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300"
                      >
                        {s.publisher}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Tri thức giáo dục (Facts) */}
      {activeTab === "facts" && (
        <div className="flex flex-col gap-2.5 pt-1">
          {educationalFacts.map((fact) => {
            const factSources = getSourcesByIds(fact.source_ids);
            return (
              <div
                key={fact.id}
                className="p-3.5 rounded-xl bg-neutral-950/50 border border-neutral-800/80 hover:border-neutral-700 transition flex flex-col gap-1.5"
              >
                <div className="flex items-start gap-2">
                  <HelpCircle className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-neutral-200 leading-relaxed flex-1">
                    {fact.text}
                  </p>
                </div>

                {factSources.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pl-5 pt-0.5 text-[10px] text-neutral-500">
                    <span className="font-medium text-neutral-400">Tư liệu:</span>
                    {factSources.map((s) => (
                      <span
                        key={s.id}
                        className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300"
                      >
                        {s.publisher}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Nguồn trích dẫn (Sources) */}
      {activeTab === "sources" && (
        <div className="flex flex-col gap-2.5 pt-1">
          {allSources.map((source) => (
            <div
              key={source.id}
              className="p-3.5 rounded-xl bg-neutral-950/50 border border-neutral-800/80 flex items-start justify-between gap-3"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-amber-400">
                    {source.id}
                  </span>
                  <span className="text-xs font-semibold text-neutral-200">
                    {source.publisher}
                  </span>
                  {source.verified && (
                    <span className="flex items-center gap-0.5 text-[10px] text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Đã đối chiếu</span>
                    </span>
                  )}
                </div>
                <h4 className="text-xs text-neutral-300 leading-snug">
                  {source.title}
                </h4>
                <span className="text-[10px] text-neutral-500">
                  Ngày tra cứu: {source.accessed_at}
                </span>
              </div>

              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition shrink-0"
                title="Truy cập nguồn tài liệu"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
