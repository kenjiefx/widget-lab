import LogoText from "../features/logo/components/LogoText";
import LogoThumbnail from "../features/logo/components/LogoThumbnail";

export default function Header() {
  return (
    <header className="flex items-center fixed top-0 left-0 right-0 h-16 bg-slate-50 z-50 shadow-md">
      <LogoThumbnail />
      <div className="flex items-center ml-3 z-100">
        <LogoText />
      </div>
    </header>
  );
}
