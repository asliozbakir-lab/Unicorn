"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  FolderKanban,
  Coins,
  Landmark,
  Globe2,
  FileText,
  Printer,
  Plus,
  Compass,
  ArrowRight,
  X,
} from "lucide-react";

interface SearchResults {
  projects: { id: string; code: string; name: string; category: string }[];
  calls: { id: string; callCode: string | null; title: string; triageStatus: string }[];
  panels: { id: string; title: string; institution: string }[];
  cities: { id: string; cityName: string; countryName: string; flagEmoji: string | null }[];
  documents: { id: string; name: string; category: string; driveUrl: string | null }[];
}

const QUICK_ROUTES = [
  { label: "Proje Özeti Çıktısı / Rapor Merkezi", href: "/raporlar", icon: Printer, hint: "A4 / Word / Excel" },
  { label: "Hibe & Fon Radarı (İncelenecek Çağrılar)", href: "/fon-cagrilari", icon: Coins, hint: "Triage & G0–G5" },
  { label: "Yeni Proje Başlat", href: "/projeler/yeni", icon: Plus, hint: "Kayıt Formu" },
  { label: "Strateji & Kalite (13 Klasör + Sunumlar)", href: "/strateji", icon: Compass, hint: "ISO 9001 & Sunum" },
  { label: "700. Yıl Panelleri", href: "/fethi-700-paneller", icon: Landmark, hint: "Fetih 1326" },
];

export function CommandPalette() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>({
    projects: [],
    calls: [],
    panels: [],
    cities: [],
    documents: [],
  });
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const openPalette = () => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) {
      dialog.showModal();
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  };

  const closePalette = () => {
    dialogRef.current?.close();
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (dialogRef.current?.open) {
          closePalette();
        } else {
          openPalette();
        }
      }
    };

    const onCustomOpen = () => openPalette();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("open-command-palette", onCustomOpen);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("open-command-palette", onCustomOpen);
    };
  }, []);

  // Click-outside fallback when closedby="any" is unsupported
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || "closedBy" in HTMLDialogElement.prototype) return;

    const outside = (e: PointerEvent) => {
      const r = dialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };

    let pressedOutside = false;
    const onDown = (e: PointerEvent) => {
      pressedOutside = outside(e);
    };
    const onUp = (e: PointerEvent) => {
      if (pressedOutside && outside(e)) dialog.close();
    };

    dialog.addEventListener("pointerdown", onDown);
    dialog.addEventListener("pointerup", onUp);
    return () => {
      dialog.removeEventListener("pointerdown", onDown);
      dialog.removeEventListener("pointerup", onUp);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
          setActiveIndex(0);
        }
      } catch {
        // Silent network guard
      } finally {
        setLoading(false);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [query]);

  const flatItems: { id: string; label: string; sub?: string; href: string; external?: boolean; kind: string }[] = [];

  if (!query.trim()) {
    for (const r of QUICK_ROUTES) {
      flatItems.push({ id: `q-${r.href}`, label: r.label, sub: r.hint, href: r.href, kind: "Hızlı Erişim" });
    }
  } else {
    const qLower = query.toLowerCase();
    for (const r of QUICK_ROUTES) {
      if (r.label.toLowerCase().includes(qLower) || r.hint.toLowerCase().includes(qLower)) {
        flatItems.push({ id: `q-${r.href}`, label: r.label, sub: r.hint, href: r.href, kind: "Sayfa" });
      }
    }
  }

  for (const p of results.projects) {
    flatItems.push({ id: `p-${p.id}`, label: p.name, sub: p.code, href: `/projeler/${p.id}`, kind: "Proje" });
  }
  for (const c of results.calls) {
    flatItems.push({
      id: `c-${c.id}`,
      label: c.title,
      sub: c.callCode || "Çağrı",
      href: "/fon-cagrilari",
      kind: "Fon Çağrısı",
    });
  }
  for (const pn of results.panels) {
    flatItems.push({
      id: `pn-${pn.id}`,
      label: pn.title,
      sub: pn.institution,
      href: "/fethi-700-paneller",
      kind: "700. Yıl Paneli",
    });
  }
  for (const ct of results.cities) {
    flatItems.push({
      id: `ct-${ct.id}`,
      label: `${ct.flagEmoji || "🌍"} ${ct.cityName}`,
      sub: ct.countryName,
      href: "/uluslararasi",
      kind: "Kardeş Şehir",
    });
  }
  for (const d of results.documents) {
    flatItems.push({
      id: `d-${d.id}`,
      label: d.name,
      sub: d.category,
      href: d.driveUrl || "/belgeler",
      external: Boolean(d.driveUrl && d.driveUrl.startsWith("http")),
      kind: "Belge",
    });
  }

  const navigateItem = (item: (typeof flatItems)[number]) => {
    closePalette();
    if (item.external) {
      window.open(item.href, "_blank", "noreferrer");
    } else {
      router.push(item.href);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (flatItems.length ? (prev + 1) % flatItems.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (flatItems.length ? (prev - 1 + flatItems.length) % flatItems.length : 0));
    } else if (e.key === "Enter" && flatItems[activeIndex]) {
      e.preventDefault();
      navigateItem(flatItems[activeIndex]);
    }
  };

  const getKindIcon = (kind: string) => {
    switch (kind) {
      case "Proje":
        return <FolderKanban className="w-4 h-4 text-[#0B4F3A]" />;
      case "Fon Çağrısı":
        return <Coins className="w-4 h-4 text-[#7A9A3B]" />;
      case "700. Yıl Paneli":
        return <Landmark className="w-4 h-4 text-[#C5A059]" />;
      case "Kardeş Şehir":
        return <Globe2 className="w-4 h-4 text-blue-600" />;
      case "Belge":
        return <FileText className="w-4 h-4 text-rose-600" />;
      default:
        return <Compass className="w-4 h-4 text-[#0B4F3A]" />;
    }
  };

  return (
    <dialog
      ref={dialogRef}
      {...({ closedby: "any" } as any)}
      aria-labelledby="cmd-palette-title"
      className="m-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl overflow-hidden"
    >
      <div className="sr-only">
        <h1 id="cmd-palette-title">Osmangazi Ar-Ge 360 Hızlı Arama ve Komut Paleti</h1>
      </div>

      {/* Arama Çubuğu */}
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 bg-slate-50/70">
        <Search className="w-4 h-4 text-[#0B4F3A] shrink-0" />
        <input
          ref={inputRef}
          type="search"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Proje, hibe çağrısı, kardeş şehir, belge veya sayfa ara..."
          className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
        />
        {loading && (
          <span className="text-[11px] font-medium text-[#0B4F3A]">Aranıyor...</span>
        )}
        <button
          type="button"
          onClick={closePalette}
          aria-label="Kapat"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Sonuçlar */}
      <div className="max-h-[58vh] overflow-y-auto p-2 space-y-1">
        {flatItems.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-500">
            &ldquo;{query}&rdquo; için eşleşen kayıt bulunamadı.
          </div>
        ) : (
          flatItems.map((item, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigateItem(item)}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-left transition ${
                  isSelected
                    ? "bg-[#0B4F3A]/10 text-[#0B4F3A]"
                    : "hover:bg-slate-50 text-slate-800"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200/80 flex items-center justify-center shrink-0 shadow-2xs">
                    {getKindIcon(item.kind)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold truncate">{item.label}</div>
                    {item.sub && (
                      <div className="text-[11px] text-slate-500 truncate">{item.sub}</div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-500">
                    {item.kind}
                  </span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? "text-[#0B4F3A]" : "text-slate-300"}`} />
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Alt İpucu Çubuğu */}
      <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-3">
          <span><kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-mono text-[10px]">↑↓</kbd> Gezin</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-mono text-[10px]">Enter</kbd> Git</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-mono text-[10px]">Esc</kbd> Kapat</span>
        </div>
        <span className="font-semibold text-[#0B4F3A]">Osmangazi AR-GE 360</span>
      </div>
    </dialog>
  );
}
