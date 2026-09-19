import { useState } from "react";
import { Code2, Copy, Check, ExternalLink, Sparkles } from "lucide-react";
import { getWidgetDataByTypeId } from "../../../features/widgets/services/widgetData";

type Props = {
  appKey: string;
  productId: string;
  widgetId: string;
  widgetTypeId: string;
};

type CodeTab = "all" | "html" | "script";

function renderLineTokens(line: string) {
  if (!line) {
    return <span className="text-slate-600 select-none">&nbsp;</span>;
  }

  // If line is a standalone comment
  if (line.trim().startsWith("<!--") && line.trim().endsWith("-->")) {
    return <span className="text-slate-400 italic">{line}</span>;
  }

  // Regex to match HTML tags, attributes, strings, comments, and closing brackets
  const regex =
    /(<!--[\s\S]*?-->)|(<\/?[\w-]+)|([\w:-]+(?==))|("[^"]*"|'[^']*')|(\/?>)/g;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      elements.push(
        <span key={`text-${lastIndex}`} className="text-slate-300">
          {line.slice(lastIndex, match.index)}
        </span>,
      );
    }

    const [, comment, tag, attr, str, bracket] = match;

    if (comment) {
      elements.push(
        <span key={`c-${match.index}`} className="text-slate-400 italic">
          {comment}
        </span>,
      );
    } else if (tag) {
      elements.push(
        <span key={`t-${match.index}`} className="text-[#60a4ff] font-medium">
          {tag}
        </span>,
      );
    } else if (attr) {
      elements.push(
        <span key={`a-${match.index}`} className="text-emerald-400">
          {attr}
        </span>,
      );
    } else if (str) {
      elements.push(
        <span key={`s-${match.index}`} className="text-amber-300">
          {str}
        </span>,
      );
    } else if (bracket) {
      elements.push(
        <span key={`b-${match.index}`} className="text-[#60a4ff] font-medium">
          {bracket}
        </span>,
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < line.length) {
    elements.push(
      <span key={`tail-${lastIndex}`} className="text-slate-300">
        {line.slice(lastIndex)}
      </span>,
    );
  }

  return elements.length > 0 ? elements : <span>{line}</span>;
}

declare global {
  interface Window {
    __WDGCONF?: {
      getWidgetHTML: (
        appKey: string,
        productId: string,
        widgetId: string,
        widgetTypeId: string,
      ) => string;
    };
  }
}

export default function WidgetCode({
  appKey,
  productId,
  widgetId,
  widgetTypeId,
}: Props) {
  const [activeTab, setActiveTab] = useState<CodeTab>("all");
  const [copied, setCopied] = useState<boolean>(false);

  const widgetHTML: string =
    typeof window !== "undefined" && window.__WDGCONF?.getWidgetHTML
      ? window.__WDGCONF.getWidgetHTML(
          appKey,
          productId,
          widgetId,
          widgetTypeId,
        )
      : "";

  const widgetData = getWidgetDataByTypeId(widgetTypeId);

  function generateCommentTitle() {
    if (widgetData) {
      if (widgetData.variantDisplayName !== "") {
        return `<!-- ${widgetData.classDisplayName} - ${widgetData.variantDisplayName} ${widgetData.isLegacy ? "(Legacy)" : ""} -->`;
      }
      return `<!-- ${widgetData.classDisplayName} ${widgetData.isLegacy ? "(Legacy)" : ""} -->`;
    }
    return "";
  }

  function generateWidgetLoaderScript() {
    if (widgetData) {
      if (!widgetData.isLegacy) {
        return `<script type="text/javascript" src="https://cdn-widgetsrepository.yotpo.com/v1/loader/${appKey}"></script>`;
      } else {
        return `<script type="text/javascript">(function e(){
    var e=document.createElement("script");
    e.type="text/javascript",e.async=true,
    e.src="//staticw2.yotpo.com/${appKey}/widget.js?v2enforce=true";
    var t=document.getElementsByTagName("script")[0];
    t.parentNode.insertBefore(e,t)}
)();</script>`;
      }
    }
    return "";
  }

  const loaderScript = generateWidgetLoaderScript();
  const commentTitle = generateCommentTitle();

  let currentCode = "";
  let filename = "storefront.html";

  if (activeTab === "all") {
    currentCode = [loaderScript, commentTitle, widgetHTML]
      .filter(Boolean)
      .join("\n\n");
    filename = "embed-all.html";
  } else if (activeTab === "html") {
    currentCode = [commentTitle, widgetHTML].filter(Boolean).join("\n");
    filename = "widget-div.html";
  } else {
    currentCode = loaderScript;
    filename = "loader-script.html";
  }

  const codeLines = currentCode.split("\n");

  function handleCopy(textToCopy: string) {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <section className="w-full flex flex-col font-sans">
      {/* Header section matching PreviewPage left sidebar */}
      <div className="p-5 border-b border-slate-100 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          {widgetData?.isLegacy ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-amber-50 text-amber-700 border border-amber-200">
              Legacy Widget
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-sky-50 text-[#0f53ac] border border-sky-100">
              Widget 3.0
            </span>
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold is-title-text text-[#122a3d]">
            Installation
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
            Embed code for{" "}
            <span className="">{widgetData?.classDisplayName || "Widget"}</span>
          </p>
        </div>
      </div>

      {/* Main panel body */}
      <div className="p-5 space-y-5">
        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/60 shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-1.5 px-2 text-xs rounded-lg font-medium transition-all ${
              activeTab === "all"
                ? "bg-white text-[#122a3d] font-semibold shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            All In One
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("html")}
            className={`flex-1 py-1.5 px-2 text-xs rounded-lg font-medium transition-all ${
              activeTab === "html"
                ? "bg-white text-[#122a3d] font-semibold shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Widget Div
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("script")}
            className={`flex-1 py-1.5 px-2 text-xs rounded-lg font-medium transition-all ${
              activeTab === "script"
                ? "bg-white text-[#122a3d] font-semibold shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Loader Script
          </button>
        </div>

        {/* Code Canvas Card with macOS Dots */}
        <div className="rounded-2xl border border-slate-800 bg-[#0b1320] shadow-[0_12px_32px_-12px_rgba(15,23,42,0.35)] overflow-hidden flex flex-col">
          {/* Simulated Editor Toolbar */}
          <div className="h-10 px-3.5 bg-[#101928] border-b border-slate-800 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></span>
              <span className="ml-2 text-[11px] font-mono text-slate-400 font-medium">
                {filename}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(currentCode)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/90 active:scale-95 transition-all"
              title="Copy snippet"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold text-[11px]">
                    Copied!
                  </span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[11px]">Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Formatted Code Block */}
          <div className="p-3.5 font-mono text-[11.5px] leading-relaxed overflow-x-auto max-h-[340px] overflow-y-auto scrollbar-thin">
            {codeLines.map((line, idx) => (
              <div
                key={idx}
                className="flex hover:bg-slate-800/40 rounded px-1 -mx-1"
              >
                <span className="w-6 shrink-0 text-slate-600 select-none text-right pr-3 text-[10.5px]">
                  {idx + 1}
                </span>
                <span className="flex-1 whitespace-pre">
                  {renderLineTokens(line)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Implementation Guide Card matching Product Info Card aesthetic */}
        <div className="rounded-2xl border border-[#d9edf7] bg-[linear-gradient(150deg,#f3fbfd,#e7f2fb)] p-4 shadow-sm relative overflow-hidden space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#60a4ff]" /> Implementation
              Guide
            </span>
            <a
              href="https://support.yotpo.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs is-link font-medium hover:underline text-[#0f53ac]"
              title="Yotpo Documentation"
            >
              <span>Docs</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-white text-[#0f53ac] font-bold flex items-center justify-center text-[10px] shrink-0 border border-sky-200 mt-0.5 shadow-2xs">
                1
              </span>
              <p className="leading-snug">
                Place the{" "}
                <strong className="text-slate-800 font-medium">
                  Loader Script
                </strong>{" "}
                in your store layout template&apos;s{" "}
                <code className="bg-white/90 px-1 py-0.5 rounded text-[10.5px] font-mono border border-slate-200/60 text-[#0f53ac]">
                  &lt;head&gt;
                </code>{" "}
                section.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-white text-[#0f53ac] font-bold flex items-center justify-center text-[10px] shrink-0 border border-sky-200 mt-0.5 shadow-2xs">
                2
              </span>
              <p className="leading-snug">
                Place the{" "}
                <strong className="text-slate-800 font-medium">
                  Widget HTML
                </strong>{" "}
                container where you want the reviews to appear.
              </p>
            </div>
          </div>

          {/* Configuration Parameters Pill Overview */}
          <div className="pt-2 border-t border-slate-200/50 flex flex-wrap items-center gap-1.5 text-[10.5px] font-mono">
            <div className="bg-white/80 border border-slate-200/80 rounded-md px-2 py-1 text-slate-600 flex items-center gap-1">
              <span className="text-slate-400 font-sans">Instance:</span>
              <span className="font-semibold text-slate-800">
                {widgetId || "default"}
              </span>
            </div>
            {widgetData?.variantDisplayName && (
              <div className="bg-white/80 border border-slate-200/80 rounded-md px-2 py-1 text-slate-600 flex items-center gap-1">
                <span className="text-slate-400 font-sans">Variant:</span>
                <span className="font-semibold text-slate-800">
                  {widgetData.variantDisplayName}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
