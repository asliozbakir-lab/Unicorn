# OSMANGAZİ AR-GE 360 — Güvenlik Notları

## 1. Kimlik Doğrulama
- **Yöntem:** Custom session-based authentication (iron-session).
- **Parola Hash:** bcryptjs (salt round: 12).
- **Oturum Cookie:** HttpOnly, Secure, SameSite=Lax, imzalı ve şifreli.
- **Oturum Süresi:** 24 saat (yapılandırılabilir).
- **Neden NextAuth/Auth.js kullanılmadı:** KVKK uyumluluğu gereği üçüncü parti servise veri gönderilmemektedir. Tam kontrol ve denetlenebilirlik sağlanmaktadır.

## 2. Yetkilendirme (RBAC)
- **Roller:** Sistem Yöneticisi, Müdür, Personel, Salt Okunur.
- **Uygulama Noktası:** Yalnızca arayüzde değil, her Server Action ve API Route içinde sunucu tarafında yetki kontrolü yapılır.
- **Yetki Matrisi:** `src/lib/permissions.ts` dosyasında merkezi olarak tanımlanır.

## 3. Veri Doğrulama
- Tüm kullanıcı girdileri Zod şemalarıyla hem istemci hem sunucu tarafında doğrulanır.
- SQL Injection koruması Prisma ORM'in parametrize sorguları ile sağlanır.

## 4. Denetim ve Kayıt
- Tüm CRUD işlemleri, giriş/çıkış, başarısız giriş denemeleri ve yetkisiz erişim girişimleri `AuditLog` tablosuna kaydedilir.
- Kayıtlar: kullanıcı ID, işlem türü, varlık, eski/yeni değer, IP adresi, zaman damgası.

## 5. Veri Koruma (KVKK / GDPR Uyumu)
- Hassas iletişim bilgileri (telefon, kişisel e-posta) yalnızca yetkili rollere görünür.
- Demo ortamında gerçek kişisel veri kullanılmaz; yalnızca kamuya açık veya sentetik veriler.
- Silme işlemleri mantıksal (soft-delete) olarak gerçekleştirilir; fiziksel silme yapılmaz.
- Denetim geçmişi değiştirilemez (immutable).

## 6. Ortam Güvenliği
- Gizli anahtarlar (AUTH_SECRET, DATABASE_URL) yalnızca `.env` dosyasında saklanır.
- `.env` dosyası `.gitignore`'a eklenmiştir.
- `.env.example` dosyası şablon olarak paylaşılır; içinde gerçek değer bulunmaz.

## 7. Belge Güvenliği
- Yüklenen belgeler yalnızca yetkili kullanıcılara sunulur.
- Dosya yolları doğrudan kullanıcıya açılmaz; sunucu tarafında erişim kontrolü uygulanır.

## 8. Gelecek İyileştirmeler
- [ ] Rate limiting (brute-force koruması).
- [ ] CSRF token doğrulaması.
- [ ] İki faktörlü doğrulama (2FA).
- [ ] Otomatik oturum zaman aşımı uyarısı.
- [ ] Penetrasyon testi ve güvenlik taraması.
