import { useState, useEffect, useRef } from "react";
import {
  KeyRound,
  Box,
  Sparkles,
  Star,
  MessageSquare,
  ExternalLink,
  Copy,
  Check,
  RotateCw,
  Maximize2,
  Monitor,
  Tablet,
  Smartphone,
  ShieldCheck,
  ArrowLeft,
  Layers,
  ShoppingBag,
  SlidersHorizontal,
  Eye,
  Search,
} from "lucide-react";
import WidgetPreviewContainer from "../features/widgets/components/WidgetPreviewContainer";
import { useProductSimpleDataGetter } from "../features/widgets/hooks/useProductSimpleDataGetter";
import { WidgetInstance } from "../types";

type Props = {
  appKey: string;
  productId: string;
  widgetId: string;
  widgetType: string;
  widgetInstances: WidgetInstance[];
};

type ViewportMode = "fluid" | "desktop" | "tablet" | "mobile";

export default function PreviewPage({
  appKey,
  productId,
  widgetId,
  widgetType,
  widgetInstances,
}: Props) {
  const { simpleProductData, isLoading } = useProductSimpleDataGetter({
    appKey,
    productId,
  });

  const [selectedWidgetInstanceId, setSelectedWidgetInstanceId] =
    useState<string>(widgetId);
  const [selectedWidgetType, setSelectedWidgetType] =
    useState<string>(widgetType);
  const [viewportMode, setViewportMode] = useState<ViewportMode>("fluid");
  const [mobileTab, setMobileTab] = useState<"preview" | "config">("preview");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [reloadKey, setReloadKey] = useState<number>(0);
  const [isReloading, setIsReloading] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);
  const [stickyStyle, setStickyStyle] = useState<React.CSSProperties>({
    position: "sticky",
    top: "5rem",
  });

  // Dynamic sticky positioning:
  // When scrolling down, sticks to bottom if taller than viewport.
  // When scrolling up, sticks to top.
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const updateSticky = () => {
      if (window.innerWidth < 1024) {
        setStickyStyle({});
        return;
      }

      const el = previewRef.current;
      if (!el) return;

      const elHeight = el.offsetHeight;
      const windowHeight = window.innerHeight;
      const topOffset = 80; // 5rem = 80px (64px fixed header + 16px space)
      const bottomOffset = 16; // 1rem = 16px breathing room at bottom

      // If the preview pane fits in the viewport:
      if (elHeight <= windowHeight - topOffset - bottomOffset) {
        setStickyStyle({
          position: "sticky",
          top: `${topOffset}px`,
        });
        return;
      }

      // If the preview pane is taller than the viewport:
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY;
      lastScrollY = currentScrollY;

      if (scrollingDown) {
        // Sticky at the bottom part when there is no more to scroll in this pane
        setStickyStyle({
          position: "sticky",
          top: `calc(100vh - ${elHeight + bottomOffset}px)`,
        });
      } else {
        // Sticky at the top part when scrolling up
        setStickyStyle({
          position: "sticky",
          top: `${topOffset}px`,
        });
      }
    };

    window.addEventListener("scroll", updateSticky, { passive: true });
    window.addEventListener("resize", updateSticky, { passive: true });
    updateSticky();

    return () => {
      window.removeEventListener("scroll", updateSticky);
      window.removeEventListener("resize", updateSticky);
    };
  }, [viewportMode, widgetInstances.length]);

  // Sync selected widget if props update
  useEffect(() => {
    if (widgetId && (!selectedWidgetInstanceId || selectedWidgetInstanceId === "")) {
      setSelectedWidgetInstanceId(widgetId);
    } else if (!selectedWidgetInstanceId && widgetInstances.length > 0) {
      setSelectedWidgetInstanceId(widgetInstances[0].instanceId);
      setSelectedWidgetType(widgetInstances[0].className);
    }
  }, [widgetId, widgetInstances]);

  function handleSelectWidgetInstance(widget: WidgetInstance) {
    setSelectedWidgetInstanceId(widget.instanceId);
    setSelectedWidgetType(widget.className);
    setMobileTab("preview");
  }

  function handleReload() {
    setIsReloading(true);
    setReloadKey((prev) => prev + 1);
    setTimeout(() => setIsReloading(false), 600);
  }

  function copyToClipboard(text: string, fieldName: string) {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    }
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

  const rawPreviewUrl = `/widgets/reviews-main-widget.html?appKey=${encodeURIComponent(
    appKey
  )}&productId=${encodeURIComponent(productId)}&widgetId=${encodeURIComponent(
    selectedWidgetInstanceId
  )}`;

  const filteredInstances = widgetInstances.filter(
    (widget) =>
      widget.className.toLowerCase().includes(searchFilter.toLowerCase()) ||
      widget.instanceId.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="pt-16 min-h-screen bg-[#fbfeff] flex flex-col font-sans">
      {/* Mobile Tab Bar */}
      <div className="lg:hidden flex items-center justify-center bg-white border-b border-slate-200 px-4 py-2 shrink-0">
        <div className="flex w-full max-w-xs bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setMobileTab("preview")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mobileTab === "preview"
                ? "bg-white text-[#122a3d] shadow-xs"
                : "text-slate-500"
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-[#60a4ff]" />
            <span>Live Preview</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("config")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mobileTab === "config"
                ? "bg-white text-[#122a3d] shadow-xs"
                : "text-slate-500"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#60a4ff]" />
            <span>Inspector & Info</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row items-start min-h-[calc(100vh-4rem)]">
        {/* Left Sidebar: Control & Metadata Panel */}
        <aside
          className={`w-full lg:w-80 xl:w-92 shrink-0 border-r border-slate-200/80 bg-white/95 backdrop-blur-sm flex-col z-10 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] ${
            mobileTab === "config" ? "flex" : "hidden lg:flex"
          }`}
        >
          {/* Header section */}
          <div className="p-5 border-b border-slate-100 flex flex-col gap-2">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#60a4ff] transition-colors self-start"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Setup</span>
            </a>
            <div className="mt-1">
              <h1 className="text-xl font-bold is-title-text text-[#122a3d]">
                Widget Studio
              </h1>
              <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                Inspect and test your live Yotpo widgets
              </p>
            </div>
          </div>

          {/* Controls section */}
          <div className="p-5 space-y-5">
            {/* Product Overview Card matching StartPage vector gradient card */}
            <div className="rounded-2xl border border-[#d9edf7] bg-[linear-gradient(150deg,#f3fbfd,#e7f2fb)] p-4 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
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

              {isLoading ? (
                <div className="space-y-2.5 animate-pulse py-2">
                  <div className="h-4 bg-slate-200/70 rounded-md w-3/4"></div>
                  <div className="h-3 bg-slate-200/50 rounded-md w-1/2"></div>
                </div>
              ) : simpleProductData.isFound ? (
                <div className="space-y-3">
                  <p className="font-semibold text-sm text-[#122a3d] leading-snug line-clamp-2">
                    {simpleProductData.name || "Product Name Unavailable"}
                  </p>
                  <div className="space-y-1.5 font-mono text-[11px] text-slate-600">
                    <div className="flex items-center justify-between py-1 border-t border-slate-200/50">
                      <span className="text-slate-500 font-sans text-xs">Product ID</span>
                      <div className="flex items-center gap-1">
                        <span className="truncate max-w-[130px] font-semibold text-slate-800">
                          {productId}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(productId, "productId")}
                          className="p-1 hover:text-[#60a4ff] text-slate-400 transition-colors"
                          title="Copy Product ID"
                        >
                          {copiedField === "productId" ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>

                    {simpleProductData.yotpoInternalId && (
                      <div className="flex items-center justify-between py-1 border-t border-slate-200/50">
                        <span className="text-slate-500 font-sans text-xs">Yotpo ID</span>
                        <span className="font-semibold text-slate-800">
                          {simpleProductData.yotpoInternalId}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-600 py-1">
                  <p className="font-medium text-slate-700">Product details not found</p>
                  <p className="font-mono text-[11px] text-slate-500 mt-1">ID: {productId}</p>
                </div>
              )}
            </div>

            {/* App Key Credential Card */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                  <KeyRound className="w-3.5 h-3.5 text-[#60a4ff]" /> App Key
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(appKey, "appKey")}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-[#60a4ff] transition-colors"
                >
                  {copiedField === "appKey" ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span className="text-emerald-600 font-medium">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <div className="font-mono text-[11px] text-slate-600 truncate bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 select-all">
                {appKey}
              </div>
            </div>

            {/* Widget Instances Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  <Layers className="w-3.5 h-3.5 text-[#60a4ff]" /> Available Instances
                </label>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-sky-50 text-[#0f53ac] border border-sky-100">
                  {widgetInstances.length}
                </span>
              </div>

              {widgetInstances.length > 4 && (
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
                  {widgetInstances.length === 0
                    ? "No widget instances discovered for this App Key."
                    : "No widget instances matching search."}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredInstances.map((widget) => {
                    const isSelected = widget.instanceId === selectedWidgetInstanceId;
                    return (
                      <button
                        key={widget.instanceId}
                        type="button"
                        onClick={() => handleSelectWidgetInstance(widget)}
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
                              <p className="text-xs font-semibold text-[#122a3d] truncate">
                                {widget.className}
                              </p>
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
          </div>
        </aside>

        {/* Main Preview Canvas Area */}
        <main
          ref={previewRef}
          style={stickyStyle}
          className={`flex-1 flex-col bg-slate-100/70 min-w-0 w-full overflow-hidden self-start transition-[top] duration-75 ${
            mobileTab === "preview" ? "flex" : "hidden lg:flex"
          }`}
        >
          {/* Canvas Top Toolbar */}
          <div className="h-14 px-4 sm:px-6 border-b border-slate-200/80 bg-white flex items-center justify-between shrink-0 gap-4">
            {/* Left: Active instance status */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-semibold text-slate-700 hidden sm:inline">
                  Live Preview
                </span>
              </div>
              <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
              <div className="flex items-center gap-2 truncate">
                <span className="text-xs sm:text-sm font-semibold text-[#122a3d] truncate">
                  {selectedWidgetType}
                </span>
                <span className="hidden md:inline-block font-mono text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                  {selectedWidgetInstanceId || "default"}
                </span>
              </div>
            </div>

            {/* Center: Viewport Mode Switcher */}
            <div className="hidden sm:flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/60 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewportMode("fluid")}
                title="Fluid Width (100%)"
                className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg transition-all ${
                  viewportMode === "fluid"
                    ? "bg-white text-[#122a3d] font-semibold shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#60a4ff]" />
                <span>Fluid</span>
              </button>
              <button
                type="button"
                onClick={() => setViewportMode("desktop")}
                title="Desktop Viewport (1200px)"
                className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg transition-all ${
                  viewportMode === "desktop"
                    ? "bg-white text-[#122a3d] font-semibold shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Monitor className="w-3.5 h-3.5 text-[#60a4ff]" />
                <span>Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => setViewportMode("tablet")}
                title="Tablet Viewport (768px)"
                className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg transition-all ${
                  viewportMode === "tablet"
                    ? "bg-white text-[#122a3d] font-semibold shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Tablet className="w-3.5 h-3.5 text-[#60a4ff]" />
                <span>Tablet</span>
              </button>
              <button
                type="button"
                onClick={() => setViewportMode("mobile")}
                title="Mobile Viewport (390px)"
                className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg transition-all ${
                  viewportMode === "mobile"
                    ? "bg-white text-[#122a3d] font-semibold shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-[#60a4ff]" />
                <span>Mobile</span>
              </button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={handleReload}
                title="Reload widget"
                className="p-2 text-slate-500 hover:text-[#122a3d] hover:bg-slate-100 rounded-lg transition-colors"
              >
                <RotateCw
                  className={`w-4 h-4 transition-transform ${
                    isReloading ? "animate-spin text-[#60a4ff]" : ""
                  }`}
                />
              </button>
              {selectedWidgetType === "ReviewsMainWidget" && (
                <a
                  href={rawPreviewUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="Open raw widget in new tab"
                  className="p-2 text-slate-500 hover:text-[#122a3d] hover:bg-slate-100 rounded-lg transition-colors hidden md:block"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Preview Canvas Surface */}
          <div
            className="flex-1 p-3 sm:p-4 flex justify-center items-start"
            style={{
              backgroundImage:
                "radial-gradient(rgba(148, 163, 184, 0.28) 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          >
            {/* Viewport Frame */}
            <div
              className={`bg-white rounded-2xl border border-slate-200/90 shadow-[0_12px_40px_-16px_rgba(15,23,42,0.08)] flex flex-col overflow-hidden transition-all duration-300 w-full ${
                viewportMode === "fluid"
                  ? "h-[calc(100vh-11.5rem)] min-h-[520px]"
                  : viewportMode === "desktop"
                  ? "max-w-[1200px] h-[calc(100vh-11.5rem)] min-h-[520px]"
                  : viewportMode === "tablet"
                  ? "max-w-[768px] h-[calc(100vh-11.5rem)] min-h-[520px]"
                  : "max-w-[390px] h-[calc(100vh-11.5rem)] min-h-[520px] rounded-3xl border-2 border-slate-300 shadow-[0_20px_50px_-16px_rgba(15,23,42,0.15)]"
              }`}
            >
              {/* Simulated Browser Bar (Eliminates the raw iframe feel) */}
              <div className="h-10 px-4 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between shrink-0 select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200/80 rounded-md font-mono text-[11px] text-slate-500 shadow-2xs max-w-[280px] sm:max-w-[380px] truncate">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="truncate">
                    storefront.preview/product/{productId}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 font-medium">
                  {viewportMode === "fluid"
                    ? "100%"
                    : viewportMode === "desktop"
                    ? "1200px"
                    : viewportMode === "tablet"
                    ? "768px"
                    : "390px"}
                </div>
              </div>

              {/* Live Preview Container (Scrollable) */}
              <div className="flex-1 w-full h-full bg-white overflow-y-auto relative">
                <WidgetPreviewContainer
                  appKey={appKey}
                  productId={productId}
                  widgetId={selectedWidgetInstanceId}
                  widgetType={selectedWidgetType as WidgetInstance["className"]}
                  reloadKey={reloadKey}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
