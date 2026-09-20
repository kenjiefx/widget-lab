import { Box, Sparkles, Loader2 } from "lucide-react";
import { WidgetInstance } from "../../../types";
import { generatePreviewUrl } from "../services/previewService";

export type Props = {
  appKey: string;
  productId: string;
  widgetId: string;
  widgetTypeId: string;
  language: string;
  reloadKey?: number | string;
};

export default function WidgetPreviewContainer({
  appKey,
  productId,
  widgetId,
  widgetTypeId,
  language,
  reloadKey = 0,
}: Props) {
  if (!widgetId || widgetId.trim() === "") {
    return (
      <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center bg-white p-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-[#60a4ff] shadow-xs">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#122a3d]">
              Connecting to Yotpo
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Discovering widget instances...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const src = generatePreviewUrl({
    appKey,
    productId,
    widgetId,
    widgetTypeId,
    language,
    reloadKey: reloadKey.toString(),
  });
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
