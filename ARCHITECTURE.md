# OSMANGAZİ AR-GE 360 — Mimari Belge

## Genel Mimari

Uygulama, Next.js App Router tabanlı modüler bir monolitik yapıda tasarlanmıştır. Sunucu taraflı render (SSR) ve Server Components ile veri erişimi sağlanır; istemci tarafı etkileşimler Client Components ile yönetilir.

## Katmanlı Mimari

```
┌─────────────────────────────────┐
│  Sunum Katmanı (Presentation)  │  React Server/Client Components
├─────────────────────────────────┤
│  Eylem Katmanı (Actions)       │  Next.js Server Actions + Zod
├─────────────────────────────────┤
│  İş Mantığı (Business Logic)   │  Yetki kontrolü, iş kuralları
├─────────────────────────────────┤
│  Veri Erişim Katmanı (DAL)     │  Prisma ORM
├─────────────────────────────────┤
│  Veritabanı (Database)         │  SQLite (Dev) / PostgreSQL (Prod)
└─────────────────────────────────┘
```

## Dizin Yapısı

### `src/app/` — Yönlendirme ve Sayfalar
- `(auth)/` — Kimlik doğrulama sayfaları (login). Layout'suz, tam ekran.
- `(dashboard)/` — Korumalı dashboard alanı. Sidebar + Header layout'u.
  - `page.tsx` — Ana gösterge paneli.
  - `projeler/` — Proje listesi, ekleme, düzenleme, detay.

### `src/components/` — Bileşenler
- `ui/` — shadcn/ui temel bileşenleri (Button, Card, Input, Table, Badge, Dialog, Select, vb.).
- `layout/` — Sidebar, Header, Breadcrumb, ThemeProvider.
- `dashboard/` — MetricCard, ProjectCategoryChart, ApplicationStatusChart.
- `projects/` — ProjectCard, ProjectForm, ProjectFilterBar.

### `src/lib/` — Altyapı Kütüphaneleri
- `prisma.ts` — Singleton Prisma Client (hot-reload korumalı).
- `auth.ts` — iron-session ile oturum yönetimi, bcryptjs ile şifre doğrulama.
- `permissions.ts` — Rol bazlı yetki kontrol matrisi.
- `validations.ts` — Zod şemaları (proje, kullanıcı, başvuru).
- `utils.ts` — Türkçe tarih formatı (Intl.DateTimeFormat), para birimi formatı, slug üretici.

### `src/actions/` — Server Actions
Her modül için ayrı action dosyası. Tüm action'lar:
1. Oturum kontrolü yapar.
2. Rol/yetki kontrolü yapar.
3. Zod ile girdi doğrulaması yapar.
4. Prisma ile veritabanı işlemi gerçekleştirir.
5. AuditLog kaydı oluşturur.

## Kimlik Doğrulama Stratejisi

**Neden Custom Auth?**
- KVKK uyumluluğu: Üçüncü parti servise veri gönderilmez.
- Tam kontrol: Oturum süresi, şifre politikası, denetim kaydı.
- iron-session: HttpOnly, Secure, SameSite cookie ile imzalı/şifreli oturum.
- bcryptjs: Parola hash'leme (salt round: 12).

**Oturum Akışı:**
1. Kullanıcı e-posta + şifre gönderir.
2. Server Action'da bcrypt ile doğrulama yapılır.
3. Başarılıysa iron-session cookie'si oluşturulur.
4. Her korumalı sayfa/action'da cookie okunur ve yetki kontrol edilir.
5. Başarısız girişler ve yetkisiz erişimler AuditLog'a yazılır.

## RBAC (Rol Tabanlı Erişim Kontrolü)

| İşlem | Sistem Yöneticisi | Müdür | Personel | Salt Okunur |
|---|:---:|:---:|:---:|:---:|
| Dashboard görüntüleme | ✅ | ✅ | ✅ | ✅ |
| Proje listeleme | ✅ | ✅ | ✅ | ✅ |
| Proje oluşturma | ✅ | ✅ | ✅ | ❌ |
| Proje düzenleme | ✅ | ✅ | ✅ | ❌ |
| Proje arşivleme | ✅ | ✅ | ❌ | ❌ |
| Kullanıcı yönetimi | ✅ | ❌ | ❌ | ❌ |
| Denetim kaydı görüntüleme | ✅ | ✅ | ❌ | ❌ |

## Bilinen SQLite Kısıtlamaları (Geliştirme Ortamı)

| Kısıtlama | Çözüm | PostgreSQL'de |
|---|---|---|
| UUID desteği yok | `cuid()` kullanılıyor | `uuid()` kullanılabilir |
| JSON tipi yok | String olarak saklanıp parse ediliyor | Native JSONB |
| Full-text search yok | `contains` filtresi | `tsvector` + `tsquery` |
| Eş zamanlı yazma sınırlı | Tek kullanıcı geliştirme | Connection pooling |

**PostgreSQL'e Geçiş:** `.env` dosyasında `DATABASE_URL` değiştirilir, `schema.prisma`'da `provider = "postgresql"` yapılır, `npx prisma db push` çalıştırılır.

## Tasarım Sistemi

### Renk Paleti
- Ana renk (Primary): `#176C55` — Koyu yeşil
- İkincil renk (Secondary): `#839B24` — Zeytin yeşili
- Arka plan: `#F7F9F8` — Açık gri
- Kartlar: `#FFFFFF` — Beyaz
- Metin: `#1A1A2E` — Koyu antrasit
- Başarı: `#22C55E`
- Uyarı: `#F59E0B`
- Hata: `#EF4444`

### Tipografi
- Başlıklar: Inter (700, 600)
- Gövde metni: Inter (400, 500)
- Monospace: JetBrains Mono (kod blokları)

### Responsive Kesme Noktaları
- Mobil: < 768px (Sidebar gizli, hamburger menü)
- Tablet: 768px – 1024px (Sidebar daraltılmış)
- Masaüstü: > 1024px (Sidebar tam genişlik)
