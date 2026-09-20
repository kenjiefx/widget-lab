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
  Code2,
} from "lucide-react";
import WidgetPreviewContainer from "../features/widgets/components/WidgetPreviewContainer";
import { useProductSimpleDataGetter } from "../features/widgets/hooks/useProductSimpleDataGetter";
import { WidgetData, WidgetInstance } from "../types";
import WidgetLibrary from "./pages/preview/WidgetLibrary";
import WidgetCode from "./pages/preview/WidgetCode";
import { generatePreviewUrl } from "../features/widgets/services/previewService";
import WidgetHTML from "./pages/preview/WidgetHTML";

type Props = {
  appKey: string;
  productId: string;
  widgetTypeId: string;
  widgetId: string;
  widgetType: string;
  language: string;
  widgetData: WidgetData[];
};

type ViewportMode = "fluid" | "desktop" | "tablet" | "mobile";

export default function PreviewPage({
  appKey,
  productId,
  widgetId,
  widgetType,
  widgetTypeId,
  language,
  widgetData,
}: Props) {
  const { simpleProductData, isLoading } = useProductSimpleDataGetter({
    appKey,
    productId,
  });

  const [selectedWidgetTypeId, setSelectedWidgetTypeId] =
    useState<string>(widgetTypeId);
  const [selectedWidgetInstanceId, setSelectedWidgetInstanceId] =
    useState<string>(widgetId);
  const [viewportMode, setViewportMode] = useState<ViewportMode>("fluid");
  const [mobileTab, setMobileTab] = useState<"preview" | "config" | "code">(
    "preview",
  );
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
  }, [viewportMode, widgetData.length]);

  function handleSelectWidgetInstance(widgetTypeId: string) {
    const selectedWidget = widgetData.find((w) => w.typeId === widgetTypeId);
    if (!selectedWidget) return;
    setSelectedWidgetInstanceId(selectedWidget.instanceId);
    setSelectedWidgetTypeId(selectedWidget.typeId);
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

  const rawPreviewUrl = generatePreviewUrl({
    appKey,
    productId,
    widgetId: selectedWidgetInstanceId,
    widgetTypeId: selectedWidgetTypeId,
    language,
    reloadKey: reloadKey.toString(),
  });

  return (
    <div className="pt-16 min-h-screen bg-[#fbfeff] flex flex-col font-sans">
      {/* Mobile Tab Bar */}
      <div className="lg:hidden flex items-center justify-center border-b border-slate-200 px-4 py-2 shrink-0">
        <div className="flex w-full max-w-sm bg-slate-100 p-1 rounded-xl">
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
            <span>Preview</span>
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
            <span>Inspector</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("code")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mobileTab === "code"
                ? "bg-white text-[#122a3d] shadow-xs"
                : "text-slate-500"
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-[#60a4ff]" />
            <span>Code</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row items-start min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white to-slate-100/70">
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
              {/* <h1 className="text-xl font-bold is-title-text text-[#122a3d]">
                Widget Studio
              </h1> */}
              <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                Inspect and test your live Yotpo widgets
              </p>
            </div>
          </div>

          {/* Controls section */}
          <div className="p-5 space-y-5">
            <WidgetHTML
              appKey={appKey}
              productId={productId}
              widgetId={selectedWidgetInstanceId}
              widgetTypeId={selectedWidgetTypeId}
              language={language}
            />

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
                      <span className="text-emerald-600 font-medium">
                        Copied
                      </span>
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

            <WidgetLibrary
              selectedWidgetTypeId={selectedWidgetTypeId}
              widgetData={widgetData}
              onWidgetSelect={handleSelectWidgetInstance}
            />
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
              <a
                href={rawPreviewUrl}
                target="_blank"
                rel="noreferrer"
                title="Open raw widget in new tab"
                className="p-2 text-slate-500 hover:text-[#122a3d] hover:bg-slate-100 rounded-lg transition-colors hidden md:block"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
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
                  language={language}
                  widgetId={selectedWidgetInstanceId}
                  widgetTypeId={selectedWidgetTypeId}
                  reloadKey={reloadKey}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      <div className="flex items-center fixed bottom-1 right-3">
        <div>
          <a
            href="/pages/terms-and-conditions.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-500 hover:text-[#60a4ff] transition-colors"
          >
            Terms And Conditions
          </a>
        </div>
        <div>
          <span className="text-xs text-slate-400 mx-1">|</span>
        </div>
        <div>
          <a
            href="/pages/privacy-policy.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-500 hover:text-[#60a4ff] transition-colors"
          >
            Privacy Policy
          </a>
        </div>
        <div>
          <span className="text-xs text-slate-400 mx-1">|</span>
        </div>
        <div>
          <a
            href="https://www.github.com/kenjiefx/widget-lab"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-500 hover:text-[#60a4ff] transition-colors"
          >
            Made with ❤️ by kenjiefx
          </a>
        </div>
      </div>
    </div>
  );
}
