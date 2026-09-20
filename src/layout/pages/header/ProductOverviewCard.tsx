import { useState, useEffect } from "react";
import { ExternalLink, Package } from "lucide-react";
import { useProductSimpleDataGetter } from "../../../features/widgets/hooks/useProductSimpleDataGetter";

type Props = {
  appKey: string;
  productId: string;
};

/**
 * Clean placeholder thumbnail rendered when imageUrl is empty, missing, or fails to load.
 */
function ProductPlaceholderImage() {
  return (
    <div
      className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#ebf6fc] to-[#d8ecf8] text-[#60a4ff]"
      title="No product image available"
      aria-label="No product image available"
    >
      <Package className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#60a4ff]/90" strokeWidth={1.8} />
    </div>
  );
}

export function ProductOverviewCard({ appKey, productId }: Props) {
  const { simpleProductData, isLoading } = useProductSimpleDataGetter({
    appKey,
    productId,
  });

  const [imageError, setImageError] = useState(false);

  // Reset image error state whenever the image URL changes
  useEffect(() => {
    setImageError(false);
  }, [simpleProductData.imageUrl]);

  if (isLoading) {
    return (
      <div
        className="hidden md:flex items-center gap-2.5 ml-3 sm:ml-5 h-11 sm:h-12 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-2xl border border-slate-200/70 bg-white/70 shadow-2xs animate-pulse max-w-[200px] lg:max-w-[260px] shrink-0"
        aria-busy="true"
        aria-label="Loading product details"
      >
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-slate-200/80 shrink-0" />
        <div className="flex-1 space-y-1.5 min-w-0">
          <div className="h-3 w-20 sm:w-28 bg-slate-200/80 rounded" />
          <div className="h-2 w-12 sm:w-16 bg-slate-200/60 rounded" />
        </div>
      </div>
    );
  }

  if (!simpleProductData.isFound) {
    return null;
  }

  const hasImageUrl = Boolean(
    simpleProductData.imageUrl && simpleProductData.imageUrl.trim().length > 0,
  );

  const thumbnailNode = (
    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl overflow-hidden shrink-0 border border-[#d9edf7] bg-white shadow-2xs flex items-center justify-center relative">
      {hasImageUrl && !imageError ? (
        <img
          src={simpleProductData.imageUrl}
          alt={simpleProductData.name || "Product"}
          className="w-full h-full object-cover object-center transition-opacity duration-200"
          loading="lazy"
          decoding="async"
          onError={() => setImageError(true)}
        />
      ) : (
        <ProductPlaceholderImage />
      )}
    </div>
  );

  return (
    <div
      className="hidden md:flex items-center gap-2.5 ml-3 sm:ml-5 h-11 sm:h-12 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-2xl border border-[#d9edf7] bg-[linear-gradient(135deg,#f3fbfd_0%,#e7f2fb_100%)] shadow-2xs hover:shadow-xs hover:border-[#bde1f4] transition-all min-w-0 max-w-[180px] md:max-w-[240px] lg:max-w-[320px] xl:max-w-[380px] shrink"
    >
      {/* Product Image Thumbnail / Placeholder */}
      {simpleProductData.url ? (
        <a
          href={simpleProductData.url}
          target="_blank"
          rel="noreferrer"
          title="Open product store page"
          className="shrink-0 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#60a4ff]/50 rounded-lg sm:rounded-xl"
        >
          {thumbnailNode}
        </a>
      ) : (
        thumbnailNode
      )}

      {/* Product Details */}
      <div className="min-w-0 flex-1 flex flex-col justify-center">
        {/* Top Row: Title + External Link */}
        <div className="flex items-center gap-1 min-w-0">
          <span
            className="font-semibold text-xs sm:text-[13px] text-[#122a3d] truncate leading-tight select-text"
            title={simpleProductData.name || "Product Info"}
          >
            {simpleProductData.name || "Product Name Unavailable"}
          </span>
          {simpleProductData.url && (
            <a
              href={simpleProductData.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center text-slate-400 hover:text-[#0f53ac] transition-colors shrink-0 p-0.5 rounded hover:bg-sky-100/60"
              title="Open live product page"
              aria-label="Open live product page"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Bottom Row: Metadata & Store Link */}
        <div className="flex items-center gap-1.5 sm:gap-2 font-mono text-[10px] sm:text-[11px] text-slate-500 leading-tight mt-0.5 min-w-0">
          {simpleProductData.yotpoInternalId ? (
            <div
              className="inline-flex items-center gap-1 min-w-0 truncate"
              title={`Yotpo ID: ${simpleProductData.yotpoInternalId}`}
            >
              <span className="font-sans text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold text-slate-400 shrink-0">
                ID
              </span>
              <span className="font-semibold text-slate-700 truncate select-all">
                {simpleProductData.yotpoInternalId}
              </span>
            </div>
          ) : simpleProductData.productId ? (
            <div
              className="inline-flex items-center gap-1 min-w-0 truncate"
              title={`Product ID: ${simpleProductData.productId}`}
            >
              <span className="font-sans text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold text-slate-400 shrink-0">
                PID
              </span>
              <span className="font-semibold text-slate-700 truncate select-all">
                {simpleProductData.productId}
              </span>
            </div>
          ) : null}

          {simpleProductData.url && (
            <>
              <span className="text-slate-300 text-[10px] shrink-0">•</span>
              <a
                href={simpleProductData.url}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] sm:text-[11px] font-sans font-medium text-[#0f53ac] hover:underline shrink-0"
              >
                Store page
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
