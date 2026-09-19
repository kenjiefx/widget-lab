import { Box, ExternalLink } from "lucide-react";
import { useProductSimpleDataGetter } from "../../../features/widgets/hooks/useProductSimpleDataGetter";

type Props = {
  appKey: string;
  productId: string;
};

export function ProductOverviewCard({ appKey, productId }: Props) {
  const { simpleProductData, isLoading } = useProductSimpleDataGetter({
    appKey,
    productId,
  });
  if (isLoading) {
    return null;
  }
  if (!simpleProductData.isFound) {
    return null;
  }
  return (
    <div className="hidden md:block ml-6 rounded-2xl border border-[#d9edf7] bg-[linear-gradient(150deg,#f3fbfd,#e7f2fb)] px-4 py-1 shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-[11px] uppercase tracking-wider text-slate-600 flex items-center gap-1.5 text-sm">
          <Box className="w-3.5 h-3.5 text-[#60a4ff]" /> Product Info
        </span>
        {simpleProductData.url && (
          <a
            href={simpleProductData.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs is-link font-medium hover:underline text-[#0f53ac]"
            title="Open live product page"
          >
            <span>Store page</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
      <div className="space-y-0.5">
        <p className="font-semibold text-sm text-[#122a3d] leading-snug line-clamp-2">
          {simpleProductData.name || "Product Name Unavailable"}
        </p>
        <div className="flex items-center space-x-1.5 font-mono text-[11px] text-slate-600">
          {simpleProductData.yotpoInternalId && (
            <div className="flex space-x-2 items-center justify-between border-slate-200/50">
              <span className="text-slate-500 font-sans text-xs">Yotpo ID</span>
              <span className="font-semibold text-slate-800">
                {simpleProductData.yotpoInternalId}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
