import React from "react";
import eventsData from "../../data/events.json" with { type: "json" };
import { EventData, RemixTier } from "../../types/culture";
import { Calendar, AlertCircle } from "lucide-react";

const events: EventData[] = eventsData as EventData[];

interface EventSelectorProps {
  selectedEventId: string;
  onSelectEvent: (eventId: string) => void;
  currentTier: RemixTier;
  disabled?: boolean;
}

export const EventSelector: React.FC<EventSelectorProps> = ({
  selectedEventId,
  onSelectEvent,
  currentTier,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-amber-500" />
          <span>Ngữ cảnh sự kiện</span>
        </label>
        <span className="text-[11px] text-neutral-500">Khảo sát bối cảnh mặc</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {events.map((ev) => {
          const isSelected = ev.id === selectedEventId;
          const isTierAllowed = ev.allowed_remix_tiers.includes(currentTier);

          return (
            <button
              key={ev.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectEvent(ev.id)}
              className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between ${
                isSelected
                  ? "bg-amber-500/10 border-amber-500/60 text-white shadow-[0_0_15px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/40"
                  : "bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:bg-neutral-900 hover:border-neutral-700"
              } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <h4 className="text-xs font-semibold leading-snug">
                    {ev.name}
                  </h4>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                  {ev.description}
                </p>
              </div>

              {!isTierAllowed && (
                <div className="mt-2 pt-2 border-t border-neutral-800/80 flex items-center gap-1 text-[10px] text-amber-400/90 font-medium">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>Trừ {ev.tier_mismatch_penalty}đ bối cảnh với tầng hiện tại</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
