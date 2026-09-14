import { KeyRound, Box } from "lucide-react";
import { useState } from "react";

export default function StartPage() {
  const [appKey, setAppKey] = useState("");
  const [productId, setProductId] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = `?appKey=${encodeURIComponent(appKey)}&productId=${encodeURIComponent(productId)}`;
    window.location.href = `/${params}`;
  };
  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center gap-14 lg:gap-20 px-6 sm:px-10 lg:px-20 pt-28 pb-16">
      <div className="w-full max-w-md">
        <h1 className="text-4xl sm:text-[2.75rem] mb-4 is-title-text leading-[1.1] text-[#122a3d]">
          Hello, there!
        </h1>
        <p className="text-base text-slate-600 mb-9 leading-relaxed max-w-sm">
          Add your App Key and Product ID to load a clean preview of your
          widget.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="appKey"
              className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2"
            >
              <KeyRound className="w-4 h-4 text-[#60a4ff]" strokeWidth={2} />
              App Key
            </label>
            <input
              value={appKey}
              onChange={(e) => setAppKey(e.target.value)}
              id="appKey"
              type="text"
              placeholder="iXOAlMhR8547ex7PS66fpGGdeq0V0YQ1pa3J0QJy"
              autoComplete="off"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white font-mono text-[0.9rem] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-[#60a4ff]/45 transition-shadow"
            />
          </div>

          <div>
            <label
              htmlFor="productId"
              className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2"
            >
              <Box className="w-4 h-4 text-[#60a4ff]" strokeWidth={2} />
              Product ID
            </label>
            <input
              id="productId"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              type="text"
              placeholder="99817238182920"
              autoComplete="off"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white font-mono text-[0.9rem] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-[#60a4ff]/45 transition-shadow"
            />
          </div>

          <button
            type="submit"
            className="mt-3 px-6 py-3 is-primary-background text-white font-medium rounded-xl transition duration-300 hover:brightness-[1.08] active:scale-[0.98] shadow-[0_10px_24px_-10px_rgba(96,164,255,0.65)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#60a4ff]"
          >
            Preview widget
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-500">
          Don&apos;t have a key yet?{" "}
          <a href="#" className="is-link is-primary-text font-medium">
            Create your Yotpo account
          </a>
        </p>
      </div>

      <div className="hidden lg:block relative w-full max-w-sm aspect-square rounded-[2rem] border border-[#d9edf7] bg-[linear-gradient(150deg,#f3fbfd,#e7f2fb)] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="/assets/home.svg"
            alt="Home vector"
            className="w-3/4 h-auto"
          />
        </div>
      </div>
    </div>
  );
}
