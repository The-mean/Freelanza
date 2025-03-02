# Freelanza API

Freelanza platformu için RESTful API. Bu API, Node.js, Express, TypeScript ve PostgreSQL kullanılarak geliştirilmiştir ve Prisma ORM ile veri tabanı yönetimini sağlar.

## Özellikler

- JWT tabanlı kullanıcı kimlik doğrulama
- Kullanıcı profil yönetimi (Freelancer ve İşveren)
- İş ilanları yönetimi
- Teklif verme sistemi
- Sözleşme ve ödeme yönetimi
- Değerlendirme ve yorum sistemi
- OpenAPI (Swagger) dokümantasyonu

## Kurulum

### Gereksinimler

- Node.js 16+
- PostgreSQL 12+
- npm veya yarn

### Adımlar

1. Repo'yu klonlayın:
```bash
git clone https://github.com/your-username/freelanza.git
cd freelanza/backend
```

2. Bağımlılıkları yükleyin:
```bash
npm install
# veya
yarn install
```

3. `.env` dosyasını oluşturun:
```bash
cp .env.example .env
```

4. `.env` dosyasını düzenleyin:
```
# Gerekli ayarlarınızı yapın (veritabanı bağlantısı, JWT anahtarları, vb.)
```

5. Veritabanı migrasyonlarını çalıştırın:
```bash
npm run prisma:migrate
# veya
yarn prisma:migrate
```

6. Uygulamayı başlatın:
```bash
# Geliştirme modunda
npm run dev
# veya
yarn dev

# Üretim modunda
npm run build
npm start
# veya
yarn build
yarn start
```

## API Dokümantasyonu

Uygulamayı çalıştırdıktan sonra, aşağıdaki URL'de API dokümantasyonuna erişebilirsiniz:

```
http://localhost:5000/api-docs
```

## Temel API Endpoint'leri

### Kimlik Doğrulama

- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `POST /api/auth/refresh-token` - Access token yenileme
- `POST /api/auth/logout` - Çıkış yapma
- `POST /api/auth/forgot-password` - Şifre sıfırlama e-postası
- `POST /api/auth/reset-password` - Şifre sıfırlama

### Kullanıcılar ve Profiller

- `GET /api/users/me` - Mevcut kullanıcı bilgileri
- `PUT /api/users/me` - Kullanıcı bilgilerini güncelleme
- `GET /api/profiles/:id` - Profil detaylarını görüntüleme
- `PUT /api/profiles/me` - Profil güncelleme
- `POST /api/profiles/me/portfolio` - Portfolyo öğesi ekleme

### İş İlanları

- `GET /api/jobs` - İş ilanlarını listeleme
- `POST /api/jobs` - İş ilanı oluşturma
- `GET /api/jobs/:id` - İş ilanı detayları
- `PUT /api/jobs/:id` - İş ilanı güncelleme
- `DELETE /api/jobs/:id` - İş ilanı silme

### Teklifler

- `GET /api/jobs/:id/proposals` - İş ilanına gelen teklifleri listele
- `POST /api/jobs/:id/proposals` - İş ilanına teklif ver
- `GET /api/proposals/:id` - Teklif detayları
- `PUT /api/proposals/:id` - Teklif güncelleme
- `DELETE /api/proposals/:id` - Teklif silme

### Ödeme

- `POST /api/payments/escrow` - Güvenli ödeme oluşturma
- `POST /api/payments/escrow/:id/release` - Güvenli ödemeyi serbest bırakma
- `GET /api/payments/history` - Ödeme geçmişi

### Yorumlar ve Puanlar

- `POST /api/reviews` - Yorum ve puan gönderme
- `GET /api/users/:id/reviews` - Kullanıcı yorumlarını görüntüleme

## Geliştirme

### Klasör Yapısı

```
src/
├── controllers/    # Controller fonksiyonları
├── middleware/     # Middleware'ler
├── routes/         # API rotaları
├── services/       # İş mantığı ve harici servisler
├── utils/          # Yardımcı fonksiyonlar ve araçlar
├── types/          # TypeScript tipleri
└── index.ts        # Uygulama giriş noktası
```

### Veritabanı Şeması

Veritabanı şeması `prisma/schema.prisma` dosyasında tanımlanmıştır. Şemayı görselleştirmek için Prisma Studio'yu kullanabilirsiniz:

```bash
npm run prisma:studio
# veya
yarn prisma:studio
```

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakın.

## İletişim

Sorularınız veya önerileriniz için: [info@freelanza.com](mailto:info@freelanza.com) 