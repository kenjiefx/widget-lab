import { useState } from "react";
import { WidgetData, WidgetInstance } from "../../../types";
import {
  Layers,
  MessageSquare,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
} from "lucide-react";

export type Props = {
  selectedWidgetTypeId: string;
  widgetData: Array<WidgetData>;
  onWidgetSelect: (widgetTypeId: string) => void;
};

export default function WidgetLibrary({
  selectedWidgetTypeId,
  widgetData,
  onWidgetSelect,
}: Props) {
  const [searchFilter, setSearchFilter] = useState<string>("");
  const filteredInstances = widgetData.filter((widget) => {
    return (
      widget.className.toLowerCase().includes(searchFilter.toLowerCase()) ||
      widget.instanceId.toLowerCase().includes(searchFilter.toLowerCase())
    );
  });

  function handleSelectWidgetInstance(typeId: string) {
    onWidgetSelect(typeId);
  }

  function getWidgetIcon(className: string) {
    switch (className) {
      case "ReviewsMainWidget":
        return <MessageSquare className="w-4 h-4" />;
      case "ReviewsStarRatingsWidget":
        return <Star className="w-4 h-4" />;
      case "PromotedProducts":
        return <ShoppingBag className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5 text-[#60a4ff]" /> Available Instances
        </label>
        <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-sky-50 text-[#0f53ac] border border-sky-100">
          {widgetData.length}
        </span>
      </div>

      {widgetData.length > 4 && (
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search instances..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/70 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#60a4ff] focus:bg-white transition-all"
          />
        </div>
      )}

      {filteredInstances.length === 0 ? (
        <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
          {widgetData.length === 0
            ? "No widget instances discovered for this App Key."
            : "No widget instances matching search."}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredInstances.map((widget) => {
            const isSelected = selectedWidgetTypeId === widget.typeId;
            return (
              <button
                key={widget.typeId}
                type="button"
                onClick={() => handleSelectWidgetInstance(widget.typeId)}
                className={`w-full text-left p-3 rounded-xl transition-all duration-200 border relative ${
                  isSelected
                    ? "border-[#60a4ff] bg-gradient-to-r from-sky-50/80 to-blue-50/50 shadow-sm ring-2 ring-[#60a4ff]/25"
                    : "border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/70"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "is-primary-background text-white shadow-xs"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {getWidgetIcon(widget.className)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        {widget.isLegacy && (
                          <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full border border-slate-200">
                            Legacy
                          </span>
                        )}
                        <p className="text-xs font-semibold text-[#122a3d] truncate">
                          {widget.classDisplayName}
                        </p>
                        {widget.variantDisplayName !== "" && (
                          <p className="text-xs font-light text-slate-400 truncate">
                            — {widget.variantDisplayName}
                          </p>
                        )}
                      </div>
                      <p className="font-mono text-[10px] text-slate-400 mt-0.5 truncate">
                        ID: {widget.instanceId || "default"}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="shrink-0 flex items-center gap-1 text-[10px] font-medium text-[#0f53ac] bg-white px-2 py-0.5 rounded-full border border-sky-200 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Active
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
