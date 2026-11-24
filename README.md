# OSMANGAZİ AR-GE 360

**Osmangazi Belediyesi Araştırma ve Geliştirme Müdürlüğü Dijital Yönetim Portalı**

---

## Proje Hakkında

OSMANGAZİ AR-GE 360, Osmangazi Belediyesi Araştırma ve Geliştirme Müdürlüğü'nün ulusal ve uluslararası projelerini, hibe ve fon başvurularını, ortaklarını, faaliyetlerini, toplantılarını, görevlerini, belgelerini ve yönetim raporlarını tek bir dijital platformda yönetmesini sağlayan kurumsal bir web uygulamasıdır.

## Teknoloji Yığını

| Teknoloji | Kullanım |
|---|---|
| Next.js (App Router) | Uygulama çatısı |
| TypeScript | Tip güvenliği |
| Tailwind CSS | Stil ve tasarım sistemi |
| shadcn/ui | UI bileşen kütüphanesi |
| Prisma ORM | Veritabanı erişimi |
| SQLite (Dev) / PostgreSQL (Prod) | Veritabanı |
| Recharts | Grafik ve veri görselleştirme |
| Lucide Icons | İkon seti |
| Zod | Veri doğrulama |
| iron-session | Oturum yönetimi |
| bcryptjs | Parola hash'leme |

## Kurulum

### Ön Gereksinimler
- Node.js 20+ (LTS)
- npm 10+

### Adımlar

```bash
# 1. Bağımlılıkları yükle
npm install

# 2. Ortam değişkenlerini ayarla
cp .env.example .env

# 3. Veritabanını oluştur ve tohum verileri yükle
npx prisma db push
npx prisma db seed

# 4. Geliştirme sunucusunu başlat
npm run dev
```

Uygulama varsayılan olarak `http://localhost:3000` adresinde çalışır.

## Demo Hesaplar

| Kullanıcı | E-Posta | Şifre | Rol |
|---|---|---|---|
| Sistem Yöneticisi | `admin@osmangazi.bel.tr` | `Osmangazi360!` | Sistem Yöneticisi |
| Serkan Cebeci | `serkan.cebeci@osmangazi.bel.tr` | `Osmangazi360!` | Müdür |
| Aslı Ökten | `asli.okten@osmangazi.bel.tr` | `Osmangazi360!` | Personel |
| İpek Çınar | `ipek.cinar@osmangazi.bel.tr` | `Osmangazi360!` | Personel |
| Berkay Salman | `berkay.salman@osmangazi.bel.tr` | `Osmangazi360!` | Personel |
| Ece Elçi | `ece.elci@osmangazi.bel.tr` | `Osmangazi360!` | Personel |
| Ersel Turan | `ersel.turan@osmangazi.bel.tr` | `Osmangazi360!` | Personel |
| Denetçi | `denetim@osmangazi.bel.tr` | `Osmangazi360!` | Salt Okunur |

> **Uyarı:** İlk girişte şifrenizi değiştirmeniz önerilir.

## Ortam Değişkenleri

`.env.example` dosyasını `.env` olarak kopyalayıp düzenleyin:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="en-az-32-karakter-uzunlugunda-guclu-bir-anahtar"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Proje Yapısı

```
├── prisma/           # Veritabanı şeması ve tohum verileri
├── src/
│   ├── app/          # Next.js App Router sayfaları
│   ├── components/   # Yeniden kullanılabilir bileşenler
│   ├── lib/          # Yardımcı kütüphaneler (auth, prisma, utils)
│   ├── actions/      # Server Actions
│   └── types/        # TypeScript tip tanımları
```

## Lisans

Bu yazılım Osmangazi Belediyesi için geliştirilmiştir. Tüm hakları saklıdır.
