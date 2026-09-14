import { Box, Sparkles } from "lucide-react";
import { WidgetInstance } from "../../../types";

export default function WidgetPreviewContainer({
  appKey,
  productId,
  widgetId,
  widgetType,
  reloadKey = 0,
}: {
  appKey: string;
  productId: string;
  widgetId: string;
  widgetType: WidgetInstance["className"];
  reloadKey?: number | string;
}) {
  if (widgetType === "ReviewsMainWidget") {
    const src = `/widgets/reviews-main-widget.html?appKey=${encodeURIComponent(appKey)}&productId=${encodeURIComponent(productId)}&widgetId=${encodeURIComponent(widgetId)}&_r=${reloadKey}`;
    return (
      <div className="iframe-container w-full h-full min-h-[500px] flex flex-col bg-white">
        <iframe
          key={`${widgetId}-${reloadKey}`}
          src={src}
          title="Reviews Main Widget Preview"
          className="w-full h-full flex-1 border-0 block bg-white"
        />
      </div>
    );
  }

  // Fallback for other widget types
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] h-full p-8 text-center">
      <div className="w-full max-w-md p-8 rounded-2xl border border-[#d9edf7] bg-[linear-gradient(150deg,#f3fbfd,#e7f2fb)] shadow-sm">
        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-white border border-[#d9edf7] flex items-center justify-center text-[#60a4ff] shadow-sm">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold is-title-text text-[#122a3d] mb-2">
          {widgetType || "Widget Preview"}
        </h3>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Rendering for this widget type is currently in development.
        </p>
        <div className="bg-white/80 rounded-xl p-3 border border-slate-200/80 text-left space-y-1.5 font-mono text-xs text-slate-700">
          <div className="flex justify-between">
            <span className="text-slate-400">Widget ID:</span>
            <span className="font-semibold text-slate-800">{widgetId || "None"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Product ID:</span>
            <span className="truncate max-w-[180px]">{productId}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
