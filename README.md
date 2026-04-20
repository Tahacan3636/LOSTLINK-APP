# LostLink — Kayıp Eşya Platformu

<p align="center">
  <img src="public/logo.jpeg" alt="LostLink" width="220" />
</p>

> Yazılım Mühendisliği dersi için geliştirilmiş, **yapay zekâ kullanmadan** konum + kategori tabanlı eşleşme yapan kayıp eşya platformu.

---

## ✨ Özellikler

- 🔐 **Kullanıcı sistemi** — Supabase Auth ile e-posta + şifre
- 📝 **İlan ekleme** — başlık, açıklama, kategori, kayıp/bulundu, foto, konum
- 🗂 **Filtreleme** — kategori, durum, arama, sıralama
- 🗺 **Harita görünümü** — Leaflet + OpenStreetMap ile tüm ilanlar pin olarak
- 🤝 **Kural tabanlı eşleşme** — aynı kategori + karşıt durum + yakın konum (Haversine)
- ✉️ **İletişim** — ilan sahibine doğrudan e-posta ile ulaşma
- ✅ **İlan yönetimi** — "Sahibine ulaştı" işaretleme, silme
- 📱 **Responsive** — mobil uyumlu

---

## 🏗️ Teknoloji

| Katman | Teknoloji |
|---|---|
| Frontend | React 18 + Vite + React Router |
| Stil | Tailwind CSS |
| Backend | Supabase (Auth + PostgreSQL + Storage) |
| Harita | Leaflet + React Leaflet |

---

## 🚀 Kurulum

### 1) Depoyu klonla

```bash
git clone https://github.com/Tahacan3636/lostlink.git
cd lostlink
```

### 2) Bağımlılıkları kur

```bash
npm install
```

### 3) Supabase projesi oluştur

1. [supabase.com](https://supabase.com) üzerinde ücretsiz hesap aç
2. **New project** → proje oluştur
3. **Settings → API** sayfasından `Project URL` ve `anon public` key'i kopyala

### 4) Veritabanı şemasını kur

Supabase **SQL Editor** → *New query* → `supabase/schema.sql` dosyasının içeriğini yapıştır → **Run**.

Bu şu kaynakları oluşturur:
- `items` tablosu
- Row-Level Security politikaları (herkes okur, yalnız sahibi yazar)
- `item-photos` adlı public Storage bucket'ı

### 5) `.env` dosyasını oluştur

Kökteki `.env.example` dosyasını `.env` olarak kopyala ve değerleri doldur:

```bash
cp .env.example .env
```

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

> **NOT:** Supabase > **Authentication → Providers → Email**'de geliştirme kolaylığı için "Confirm email" seçeneğini kapatabilirsin. Aksi halde kayıttan sonra e-posta doğrulaması beklenir.

### 6) Geliştirme sunucusunu başlat

```bash
npm run dev
```

→ [http://localhost:5173](http://localhost:5173)

---

## 📁 Proje Yapısı

```
src/
├── components/        Ortak bileşenler (Navbar, ItemCard, Logo, Loader, ProtectedRoute)
├── contexts/          React Context'ler (AuthContext)
├── lib/               Yardımcılar (supabase client, utils)
├── pages/             Sayfalar
│   ├── Home.jsx         Hero + stats + filtre + feed
│   ├── Login.jsx        Giriş
│   ├── Register.jsx     Kayıt
│   ├── CreateItem.jsx   İlan ekleme (foto + konum)
│   ├── ItemDetail.jsx   İlan detayı + harita + eşleşmeler
│   ├── MapView.jsx      Tüm ilanlar haritada
│   └── MyItems.jsx      Kullanıcının ilanları + yönetim
├── App.jsx            Router
├── main.jsx           Giriş noktası
└── index.css          Tailwind + tema

supabase/
└── schema.sql         Tablo + RLS + Storage kurulumu
```

---

## 🧠 Eşleşme Mantığı (AI YOK)

Bir **kayıp** ilan açıldığında, sistem aynı kategorideki **bulundu** ilanları getirir. Konum bilgisi varsa Haversine formülü ile mesafeye göre sıralar:

```js
distance = 2R · arcsin(√(sin²(Δφ/2) + cos(φ₁)·cos(φ₂)·sin²(Δλ/2)))
```

`src/lib/utils.js` içindeki `distanceKm(lat1, lon1, lat2, lon2)` bu hesabı yapar.

---

## 🗄️ Veritabanı Şeması

**items**
| Alan | Tip | Açıklama |
|---|---|---|
| id | uuid (PK) | Otomatik |
| user_id | uuid (FK → auth.users) | İlan sahibi |
| title | text | İlan başlığı |
| description | text | Detay |
| category | text | telefon, canta, anahtar... |
| status | text | `lost` / `found` |
| image_url | text | Supabase Storage URL'i |
| latitude, longitude | double | Konum |
| location_text | text | Açıklayıcı konum |
| contact_email | text | İletişim e-postası |
| is_recovered | bool | Sahibine ulaştı mı |
| created_at | timestamptz | Oluşturulma zamanı |

---

## 📦 npm Scripts

| Komut | Açıklama |
|---|---|
| `npm run dev` | Geliştirme sunucusu (Vite) |
| `npm run build` | Production build (dist/) |
| `npm run preview` | Build'i lokal olarak önizle |

---

## 🎓 Ders Sunumu İçin Özet

1. **Problem:** Kayıp eşyaların sahibini bulmak zor; mevcut çözümlerin çoğu manuel grup/forum.
2. **Çözüm:** Kullanıcıların ilan paylaştığı ve **konum + kategori** eşleşmesiyle potansiyel sahipleri/bulanları otomatik öneren bir web platformu.
3. **AI kullanmadan** eşleşme: Haversine mesafe + kategori eşitliği + zıt durum (lost↔found).
4. **Mimari:** React tabanlı SPA + Supabase (BaaS) — kimlik doğrulama, DB, dosya depolama hep oradan.
5. **Güvenlik:** Supabase Row-Level Security; sadece ilan sahibi kendi ilanını düzenleyebilir.

---

## 📝 Lisans

Ders projesi — eğitim amaçlı.
