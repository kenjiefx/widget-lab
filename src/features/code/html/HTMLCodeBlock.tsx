import { Check, Copy } from "lucide-react";
import { useState } from "react";

type Props = {
  htmlCode: string;
  filename: string;
};

function renderLineTokens(line: string) {
  if (!line) {
    return <span className="text-slate-400 select-none">&nbsp;</span>;
  }
  // If line is a standalone comment
  if (line.trim().startsWith("<!--") && line.trim().endsWith("-->")) {
    return <span className="text-slate-500 italic">{line}</span>;
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
        <span key={`text-${lastIndex}`} className="text-slate-700">
          {line.slice(lastIndex, match.index)}
        </span>,
      );
    }
    const [, comment, tag, attr, str, bracket] = match;
    if (comment) {
      elements.push(
        <span key={`c-${match.index}`} className="text-slate-500 italic">
          {comment}
        </span>,
      );
    } else if (tag) {
      elements.push(
        <span key={`t-${match.index}`} className="text-blue-600 font-medium">
          {tag}
        </span>,
      );
    } else if (attr) {
      elements.push(
        <span key={`a-${match.index}`} className="text-emerald-600">
          {attr}
        </span>,
      );
    } else if (str) {
      elements.push(
        <span key={`s-${match.index}`} className="text-amber-600">
          {str}
        </span>,
      );
    } else if (bracket) {
      elements.push(
        <span key={`b-${match.index}`} className="text-blue-600 font-medium">
          {bracket}
        </span>,
      );
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < line.length) {
    elements.push(
      <span key={`tail-${lastIndex}`} className="text-slate-700">
        {line.slice(lastIndex)}
      </span>,
    );
  }
  return elements.length > 0 ? elements : <span>{line}</span>;
}

export default function HTMLCodeBlock({ htmlCode, filename }: Props) {
  const [copied, setCopied] = useState<boolean>(false);

  const codeLines = htmlCode.split("\n");

  function handleCopy(textToCopy: string) {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-100 shadow-[0_12px_32px_-12px_rgba(15,23,42,0.12)] overflow-hidden flex flex-col">
      {/* Simulated Editor Toolbar */}
      <div className="h-10 px-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></span>
          <span className="ml-2 text-[11px] font-mono text-slate-500 font-medium">
            {filename}
          </span>
        </div>
        <button
          type="button"
          onClick={() => handleCopy(htmlCode)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 active:scale-95 transition-all"
          title="Copy snippet"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-600 font-semibold text-[11px]">
                Copied!
              </span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-[11px]">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Formatted Code Block */}
      <div className="p-3.5 font-mono text-[11.5px] leading-relaxed overflow-x-auto max-h-[340px] overflow-y-auto scrollbar-thin">
        {codeLines.map((line, idx) => (
          <div key={idx} className="flex hover:bg-slate-100 rounded px-1 -mx-1">
            <span className="w-6 shrink-0 text-slate-400 select-none text-right pr-3 text-[10.5px]">
              {idx + 1}
            </span>
            <span className="flex-1 whitespace-pre">
              {renderLineTokens(line)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
