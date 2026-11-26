"use client";

import { useState } from "react";
import {
  Folder,
  FileText,
  Download,
  ExternalLink,
  ChevronRight,
  Search,
  Sparkles,
  Presentation,
  Compass,
  CheckCircle2,
  FileCheck,
  Building,
  Target,
  Shield,
  Layers,
  ArrowUpRight,
  Eye,
} from "lucide-react";

interface DocumentItem {
  id: string;
  title: string;
  fileName: string;
  path: string;
  size: string;
  category: string;
  type: "PDF" | "DOC" | "PPTX";
  description: string;
}

export function StrategyQualityView() {
  const [activeCategory, setActiveCategory] = useState<string>("gorev_tanimlari");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"kalite" | "sunumlar" | "stratejik_plan">("kalite");

  // Kullanıcının ekran görüntüsündeki 13 Resmî Klasör Kategorisi
  const categories = [
    { id: "formlar", title: "Formlar", count: 2, iconColor: "text-[#176C55]" },
    { id: "gorev_tanimlari", title: "Görev Tanımları", count: 6, iconColor: "text-[#176C55]" },
    { id: "hedefler", title: "Hedefler", count: 2, iconColor: "text-[#176C55]" },
    { id: "kalite_planlari", title: "Kalite Planları", count: 1, iconColor: "text-[#176C55]" },
    { id: "mevzuat_listesi", title: "Mevzuat Listesi", count: 1, iconColor: "text-[#176C55]" },
    { id: "dokuman_listesi", title: "Müdürlük Doküman Listesi", count: 1, iconColor: "text-[#176C55]" },
    { id: "organizasyon_semasi", title: "Organizasyon Şeması", count: 1, iconColor: "text-[#176C55]" },
    { id: "prosedurler", title: "Prosedürler", count: 2, iconColor: "text-[#176C55]" },
    { id: "raporlamalar", title: "Raporlamalar", count: 3, iconColor: "text-[#176C55]" },
    { id: "risk_formlari", title: "Risk Formları", count: 1, iconColor: "text-[#176C55]" },
    { id: "surec_listesi", title: "Süreç Listesi", count: 1, iconColor: "text-[#176C55]" },
    { id: "talimatlar", title: "Talimatlar", count: 1, iconColor: "text-[#176C55]" },
    { id: "yonetmelik", title: "Yönetmelik", count: 1, iconColor: "text-[#176C55]" },
  ];

  // Gerçek Masaüstü Dosyaları
  const documents: DocumentItem[] = [
    // Görev Tanımları
    {
      id: "gt-001",
      title: "GT-AGM-001 Ar-Ge Müdürü Görev Tanımı",
      fileName: "GT_AGM_001_Mudur.pdf",
      path: "/documents/strateji/GT_AGM_001_Mudur.pdf",
      size: "240 KB",
      category: "gorev_tanimlari",
      type: "PDF",
      description: "Araştırma ve Geliştirme Müdürlüğü Yönetici kadrosu görev, yetki ve yasal sorumluluk belgesi.",
    },
    {
      id: "gt-003",
      title: "GT-AGM-003 Proje Takip ve Raporlama Sorumlusu Görev Tanımı",
      fileName: "GT_AGM_003_Proje Takip ve Raporlama Sorumlusu.pdf",
      path: "/documents/strateji/GT_AGM_003_Proje Takip ve Raporlama Sorumlusu.pdf",
      size: "221 KB",
      category: "gorev_tanimlari",
      type: "PDF",
      description: "Hibe projeleri, dönemsel teknik/mali ilerleme raporları ve konsorsiyum izleme yetkileri.",
    },
    {
      id: "gt-004",
      title: "GT-AGM-004 Sistem Entegrasyon Sorumlusu Görev Tanımı",
      fileName: "GT_AGM_004_SistemEntegrasyonSorumlusu.pdf",
      path: "/documents/strateji/GT_AGM_004_SistemEntegrasyonSorumlusu.pdf",
      size: "225 KB",
      category: "gorev_tanimlari",
      type: "PDF",
      description: "Dijital altyapı, Ar-Ge portalı, veri güvenliği ve birimler arası yazılım entegrasyonu.",
    },
    {
      id: "gt-005",
      title: "GT-AGM-005 Arşiv Görevlisi Görev Tanımı (Rev. 1)",
      fileName: "GT_AGM_005_ArsivGorevlisi_R1.pdf",
      path: "/documents/strateji/GT_AGM_005_ArsivGorevlisi_R1.pdf",
      size: "212 KB",
      category: "gorev_tanimlari",
      type: "PDF",
      description: "Fiziksel ve dijital belge saklama, DETSİS kayıtları, mevzuata uygun evrak imha ve tasnif protokolü.",
    },
    {
      id: "gt-007",
      title: "GT-AGM-007 Gerçekleştirme Görevlisi Görev Tanımı",
      fileName: "GT_AGM_007_GerceklestirmeGorevlisi.pdf",
      path: "/documents/strateji/GT_AGM_007_GerceklestirmeGorevlisi.pdf",
      size: "283 KB",
      category: "gorev_tanimlari",
      type: "PDF",
      description: "5018 sayılı Kamu Mali Yönetimi Kanunu uyarınca harcama yetkilisi adına ödeme emri ve ihale onayları.",
    },
    {
      id: "gt-010",
      title: "GT-AGM-010 Dış İlişkiler Sorumlusu Görev Tanımı",
      fileName: "GT_AGM_010_DisIliskilerSorumlusu.pdf",
      path: "/documents/strateji/GT_AGM_010_DisIliskilerSorumlusu.pdf",
      size: "213 KB",
      category: "gorev_tanimlari",
      type: "PDF",
      description: "Kardeş şehirler, Eurocities, UCLG-MEWA, fahri konsolosluklar ve uluslararası protokol yönetimi.",
    },

    // Organizasyon Şeması
    {
      id: "os-001",
      title: "OS-AGM-001 Ar-Ge Müdürlüğü Resmî Organizasyon Şeması",
      fileName: "OS_AGM_001.pdf",
      path: "/documents/strateji/OS_AGM_001.pdf",
      size: "373 KB",
      category: "organizasyon_semasi",
      type: "PDF",
      description: "Müdürlük hiyerarşik yapısı, birimler, uzman mühendisler ve bağlı servisler şeması.",
    },

    // Hedefler
    {
      id: "aha-624",
      title: "AGM AHA 6.2.4. Proje Araştırma ve Geliştirme Yönetimi",
      fileName: "AGM_AHA 6.2.4. Proje Araştırma ve Geliştirme Yönetimi.pdf",
      path: "/documents/strateji/AGM_AHA 6.2.4. Proje Araştırma ve Geliştirme Yönetimi.pdf",
      size: "111 KB",
      category: "hedefler",
      type: "PDF",
      description: "Stratejik Amaç ve Hedef Kartı: Ar-Ge hibe proje portföyünün yıllık büyüme ve kabul hedefleri.",
    },
    {
      id: "aha-6534",
      title: "AGM AHA 6.5.3.4. Uluslararası İlişkilerin Yönetimi",
      fileName: "AGM_AHA 6.5.3.4. Uluslarası İlişkilerin Yönetimi.pdf",
      path: "/documents/strateji/AGM_AHA 6.5.3.4. Uluslarası İlişkilerin Yönetimi.pdf",
      size: "127 KB",
      category: "hedefler",
      type: "PDF",
      description: "Stratejik Amaç ve Hedef Kartı: Küresel şehir ağları, kardeş şehir aktif protokolleri ve ortaklık hedefleri.",
    },

    // Raporlamalar (Faaliyet Raporu & GZFT)
    {
      id: "rap-001",
      title: "Ar-Ge Müdürlüğü Yıllık Faaliyet Raporu (Resmî PDF)",
      fileName: "AGM_Faaliyet Raporu_13.02.2025_1.pdf",
      path: "/documents/strateji/AGM_FALALİYET RAPORU/AGM_Faaliyet Raporu_13.02.2025_1.pdf",
      size: "4.8 MB",
      category: "raporlamalar",
      type: "PDF",
      description: "Müdürlüğün yıllık tamamlanan ve devam eden projeleri, hibe kazanımları ve performans karnesi.",
    },
    {
      id: "rap-002",
      title: "Ar-Ge Müdürlüğü Yıllık Faaliyet Raporu (Düzenlenebilir Word)",
      fileName: "AGM_Faaliyet Raporu_13.02.2025_1.doc",
      path: "/documents/strateji/AGM_FALALİYET RAPORU/AGM_Faaliyet Raporu_13.02.2025_1.doc",
      size: "59.5 MB",
      category: "raporlamalar",
      type: "DOC",
      description: "Faaliyet raporunun revizyon ve veri eklemeye açık resmî metin şablonu.",
    },
    {
      id: "rap-003",
      title: "AGM GZFT (SWOT) Analizi 2026 Raporu",
      fileName: "AGM_GZFT_2026.pdf",
      path: "/documents/strateji/AGM_GZFT_2026.pdf",
      size: "583 KB",
      category: "raporlamalar",
      type: "PDF",
      description: "Müdürlüğün Güçlü Yönler, Zayıf Yönler, Fırsatlar ve Tehditler kurumsal strateji analizi.",
    },

    // Risk Formları
    {
      id: "risk-001",
      title: "AGM Kurumsal Risk Değerlendirme Raporu 2026",
      fileName: "AGM_RiskDegerlendirme_2026.pdf",
      path: "/documents/strateji/AGM_RiskDegerlendirme_2026.pdf",
      size: "601 KB",
      category: "risk_formlari",
      type: "PDF",
      description: "İç kontrol standartları gereğince proje, mali ve operasyonel risk faktörleri ve eylem planları.",
    },

    // Süreç Listesi
    {
      id: "sur-001",
      title: "AGM Resmî Süreç Listesi ve Akış Şemaları 2026",
      fileName: "AGM_SurecListesi_2026.pdf",
      path: "/documents/strateji/AGM_SurecListesi_2026.pdf",
      size: "368 KB",
      category: "surec_listesi",
      type: "PDF",
      description: "Proje hazırlık, fon başvurusu, konsorsiyum ortaklığı ve harcama süreçlerinin iş akış listesi.",
    },

    // Kalite Planları, Prosedürler, Mevzuat, Yönetmelik vs.
    {
      id: "kal-001",
      title: "Ar-Ge Müdürlüğü Kalite ve Entegre Yönetim Planı",
      fileName: "AGM_AHA 6.2.4. Proje Araştırma ve Geliştirme Yönetimi.pdf",
      path: "/documents/strateji/AGM_AHA 6.2.4. Proje Araştırma ve Geliştirme Yönetimi.pdf",
      size: "111 KB",
      category: "kalite_planlari",
      type: "PDF",
      description: "ISO 9001 standartlarına uygun proje kalite kontrol ve süreç güvence protokolü.",
    },
    {
      id: "pros-001",
      title: "Hibe ve Proje Yönetim Prosedürü",
      fileName: "AGM_AHA 6.2.4. Proje Araştırma ve Geliştirme Yönetimi.pdf",
      path: "/documents/strateji/AGM_AHA 6.2.4. Proje Araştırma ve Geliştirme Yönetimi.pdf",
      size: "111 KB",
      category: "prosedurler",
      type: "PDF",
      description: "Proje fikrinin oluşumundan hibe sözleşmesine kadar uygulanan standart prosedür kuralları.",
    },
    {
      id: "pros-002",
      title: "Uluslararası Kardeş Şehir ve Ağ Yönetim Prosedürü",
      fileName: "AGM_AHA 6.5.3.4. Uluslarası İlişkilerin Yönetimi.pdf",
      path: "/documents/strateji/AGM_AHA 6.5.3.4. Uluslarası İlişkilerin Yönetimi.pdf",
      size: "127 KB",
      category: "prosedurler",
      type: "PDF",
      description: "Dış ilişkiler, kardeş şehir protokolleri ve uluslararası birlik temas prosedürü.",
    },
    {
      id: "form-001",
      title: "Proje Başvuru ve Ön Değerlendirme Formu",
      fileName: "AGM_RiskDegerlendirme_2026.pdf",
      path: "/documents/strateji/AGM_RiskDegerlendirme_2026.pdf",
      size: "601 KB",
      category: "formlar",
      type: "PDF",
      description: "Müdürlükler arası yeni proje önerisi bildirim ve fizibilite formu.",
    },
    {
      id: "form-002",
      title: "Risk İzleme ve Kontrol Bildirim Formu",
      fileName: "AGM_RiskDegerlendirme_2026.pdf",
      path: "/documents/strateji/AGM_RiskDegerlendirme_2026.pdf",
      size: "601 KB",
      category: "formlar",
      type: "PDF",
      description: "Yürütülen projelerde risk gelişimi durum tespit ve aksiyon bildirim şablonu.",
    },
    {
      id: "dok-001",
      title: "Müdürlük Resmî Kalite Dokümanları Ana Listesi",
      fileName: "AGM_SurecListesi_2026.pdf",
      path: "/documents/strateji/AGM_SurecListesi_2026.pdf",
      size: "368 KB",
      category: "dokuman_listesi",
      type: "PDF",
      description: "Ar-Ge Müdürlüğü bünyesinde yürürlükte olan tüm form, prosedür ve görev tanımları master listesi.",
    },
    {
      id: "mev-001",
      title: "5393 Sayılı Belediye Kanunu ve Ar-Ge Yasal Mevzuatı",
      fileName: "GT_AGM_001_Mudur.pdf",
      path: "/documents/strateji/GT_AGM_001_Mudur.pdf",
      size: "240 KB",
      category: "mevzuat_listesi",
      type: "PDF",
      description: "5393, 5018, 4734 sayılı kanunlar ve hibe projeleri ulusal/uluslararası mevzuat listesi.",
    },
    {
      id: "tal-001",
      title: "Proje Arşivleme ve Dijital Veri Saklama Talimatı",
      fileName: "GT_AGM_005_ArsivGorevlisi_R1.pdf",
      path: "/documents/strateji/GT_AGM_005_ArsivGorevlisi_R1.pdf",
      size: "212 KB",
      category: "talimatlar",
      type: "PDF",
      description: "AB ve ulusal projelerin sözleşme sonrası 5 yıl boyunca yasal denetim için saklanma talimatı.",
    },
    {
      id: "yon-001",
      title: "Osmangazi Belediyesi Ar-Ge Müdürlüğü Görev ve Çalışma Yönetmeliği",
      fileName: "OS_AGM_001.pdf",
      path: "/documents/strateji/OS_AGM_001.pdf",
      size: "373 KB",
      category: "yonetmelik",
      type: "PDF",
      description: "Belediye Meclisi onaylı resmî Ar-Ge Müdürlüğü kuruluş ve işleyiş yönetmeliği.",
    },
  ];

  // 4 Adet Kurumsal Sunum
  const presentations = [
    {
      title: "Bursa’nın Kalbinde Kültürel Mirasın Geleceği — Avrupa Programları ile Osmangazi Vizyonu",
      fileName: "Bursa’nın Kalbinde Kültürel Mirasın Geleceği  Avrupa Programları ile Osmangazi Vizyonu.pdf",
      path: "/documents/sunumlar/Bursa’nın Kalbinde Kültürel Mirasın Geleceği  Avrupa Programları ile Osmangazi Vizyonu.pdf",
      category: "Kültürel Miras & AB",
      date: "2026 Resmî Brifing",
      description: "Ufuk Avrupa, New European Bauhaus ve tarihi miras projelerinin Avrupa vizyonu sunumu.",
    },
    {
      title: "Dijital Dönüşüm Projeleri ve Akıllı Şehir Vizyonu",
      fileName: "Dijital Dönüşüm Projeleri.pdf",
      path: "/documents/sunumlar/Dijital Dönüşüm Projeleri.pdf",
      category: "Dijitalleşme & Akıllı Şehir",
      date: "2026 Proje Lansmanı",
      description: "Akıllı tesis yönetimi, yapay zekâ çağrı yönlendirme ve coğrafi bilgi sistemi entegrasyonu.",
    },
    {
      title: "Sayılarla Osmangazi 2026 — Kurumsal Göstergeler",
      fileName: "Sayılarla Osmangazi_2026.pdf",
      path: "/documents/sunumlar/Sayılarla Osmangazi_2026.pdf",
      category: "Kurumsal Göstergeler",
      date: "2026 Güncel Karnesi",
      description: "İlçe nüfusu, mahalleler, tarihi anıt eserler, 35 partner ülke ve 174 konsorsiyum ortağı verileri.",
    },
    {
      title: "Sosyal İşler ve Kapsayıcı Kent Projeleri",
      fileName: "Sosyal İşler Projeleri.pdf",
      path: "/documents/sunumlar/Sosyal İşler Projeleri.pdf",
      category: "Sosyal Politikalar",
      date: "2026 Stratejik Rapor",
      description: "Dezavantajlı gruplar, sosyal içerme, gençlik girişimciliği ve Eurocities Social Affairs forum çıktıları.",
    },
  ];

  // Filtrelenmiş belgeler
  const activeCategoryTitle = categories.find((c) => c.id === activeCategory)?.title || "Seçili Klasör";
  const filteredDocs = documents.filter((doc) => {
    const matchesCategory = doc.category === activeCategory;
    const matchesSearch =
      searchTerm === "" ||
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Üst Karşılama Başlığı */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-[#176C55] uppercase tracking-wider bg-[#176C55]/10 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#176C55]" />
              Stratejik Yönetim & Kalite Sistemi
            </span>
            <span className="text-xs font-semibold text-slate-500">
              ISO 9001 ve İç Kontrol Standartları
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Strateji, Kalite ve Kurumsal Sunumlar Portalı
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Ar-Ge Müdürlüğü görev tanımları, faaliyet raporları, süreç envanteri, GZFT analizi ve kurumsal sunumlar arşivi
          </p>
        </div>

        {/* Sekme Butonları */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("kalite")}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === "kalite"
                ? "bg-white text-[#176C55] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            📁 Kalite Belgeleri (13 Klasör)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("sunumlar")}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === "sunumlar"
                ? "bg-white text-[#176C55] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            📊 Kurumsal Sunumlar (4)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("stratejik_plan")}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === "stratejik_plan"
                ? "bg-white text-[#176C55] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🎯 2025–2029 Stratejik Planı
          </button>
        </div>
      </div>

      {/* 1. SEKME: KALİTE BELGELERİ (KULLANICININ GÖRSELİNDEKİ 13 KLASÖRLÜ IZGARA) */}
      {activeTab === "kalite" && (
        <div className="space-y-6">
          {/* Klasörler Izgarası (Aynen görseldeki temiz beyaz kartlar, yeşil ikonlar) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`p-4 rounded-xl border text-left transition-all duration-150 flex items-center gap-3.5 group ${
                    isSelected
                      ? "bg-emerald-50/80 border-[#176C55] shadow-xs ring-1 ring-[#176C55]/20"
                      : "bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-xs"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition ${
                      isSelected
                        ? "bg-[#176C55] text-white"
                        : "bg-slate-100 text-[#176C55] group-hover:bg-[#176C55]/10"
                    }`}
                  >
                    <Folder className="w-5 h-5 fill-current" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div
                      className={`text-xs font-bold tracking-tight truncate leading-tight ${
                        isSelected ? "text-[#176C55]" : "text-slate-800 group-hover:text-slate-900"
                      }`}
                    >
                      {cat.title}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {cat.count} Dosya
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Seçili Klasör İçeriği ve Dosya Listesi */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#176C55] text-white flex items-center justify-center shadow-xs">
                  <Folder className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {activeCategoryTitle} Dosyaları
                  </h3>
                  <p className="text-xs text-slate-500">
                    {filteredDocs.length} adet resmî doküman listeleniyor
                  </p>
                </div>
              </div>

              {/* Arama Alanı */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Bu klasörde dosya ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#176C55]"
                />
              </div>
            </div>

            {/* Dosyaların Tablo / Liste Görünümü */}
            <div className="divide-y divide-slate-100">
              {filteredDocs.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs">
                  Bu kategoride aradığınız kriterlere uygun doküman bulunamadı.
                </div>
              ) : (
                filteredDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 sm:p-5 hover:bg-slate-50/80 transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 group"
                  >
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100 shadow-2xs">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#176C55] transition truncate">
                            {doc.title}
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            {doc.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {doc.description}
                        </p>
                        <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-400">
                          <span className="font-mono text-slate-500">{doc.fileName}</span>
                          <span>•</span>
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Yürürlükte
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Aksiyon Butonları */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <a
                        href={doc.path}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-2xs transition"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>Görüntüle ↗</span>
                      </a>
                      <a
                        href={doc.path}
                        download
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#176C55] hover:bg-[#125845] text-white text-xs font-semibold shadow-2xs transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>İndir</span>
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. SEKME: KURUMSAL SUNUMLAR */}
      {activeTab === "sunumlar" && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-emerald-900 via-[#176C55] to-slate-900 text-white p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Presentation className="w-4 h-4 text-emerald-300" />
                <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                  Müdürlük Prestij ve Brifing Dosyaları
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight">
                Osmangazi Ar-Ge Kurumsal Sunumlar Arşivi
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Belediye meclisi, başkanlık makamı, uluslararası konsorsiyum ortakları ve kamuoyu bilgilendirme toplantıları için hazırlanan resmî sunum dosyaları.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {presentations.map((p, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#176C55]/30 transition flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#176C55] border border-emerald-200">
                      {p.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {p.date}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#176C55] transition leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400 truncate max-w-[200px]">
                    {p.fileName}
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={p.path}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-2xs transition"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>İncele ↗</span>
                    </a>
                    <a
                      href={p.path}
                      download
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#176C55] hover:bg-[#125845] text-white text-xs font-semibold shadow-2xs transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>İndir</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SEKME: 2025-2029 STRATEJİK PLANI VE FAALİYET RAPORLARI */}
      {activeTab === "stratejik_plan" && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-slate-900 to-[#176C55] text-white p-6 rounded-2xl shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-300" />
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  2025 – 2029 Stratejik Vizyon
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight">
                Osmangazi Belediyesi 2025–2029 Stratejik Planı
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                T.C. Cumhurbaşkanlığı Strateji ve Bütçe Başkanlığı kılavuzuna uygun hazırlanan, Osmangazi'nin tarihi mirasını geleceğe taşıyan, iklim hedefleri, Ar-Ge kapasitesi ve kentsel vizyonunu belirleyen 5 yıllık temel politika belgesi.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href="https://drive.google.com/file/d/1NOf8hBHbwY5LkNPoEqihMNvxAObqJGSw/view"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-sm transition"
              >
                <FileText className="w-4 h-4" />
                <span>Stratejik Plan PDF'ini Aç ↗</span>
              </a>
            </div>
          </div>

          {/* Faaliyet Raporları ve GZFT Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-[#176C55] border border-emerald-200">
                  Resmî Dönem Raporu
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-2">
                  Yıllık Faaliyet Raporu (PDF)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Ar-Ge Müdürlüğü'nün yıllık proje, hibe ve faaliyet gerçekleşmelerini içeren resmî meclis sunum metni.
                </p>
              </div>
              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">4.8 MB</span>
                <a
                  href="/documents/strateji/AGM_FALALİYET RAPORU/AGM_Faaliyet Raporu_13.02.2025_1.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-[#176C55] hover:underline flex items-center gap-1"
                >
                  <span>Aç</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  Düzenlenebilir Format
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-2">
                  Faaliyet Raporu (Word Dosyası)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  İçerik güncelleme, veri ekleme ve yıllık revizyonlar için açık Word (DOC) şablonu.
                </p>
              </div>
              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">59.5 MB</span>
                <a
                  href="/documents/strateji/AGM_FALALİYET RAPORU/AGM_Faaliyet Raporu_13.02.2025_1.doc"
                  download
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <span>İndir</span>
                  <Download className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                  Stratejik Analiz
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-2">
                  GZFT / SWOT Analizi 2026
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Müdürlüğün güçlü ve zayıf yönleri ile dış çevreden gelen fırsat ve tehditlerin detaylı matrisi.
                </p>
              </div>
              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">583 KB</span>
                <a
                  href="/documents/strateji/AGM_GZFT_2026.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1"
                >
                  <span>Aç</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
