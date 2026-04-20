<div align="center">

<img src="public/logo.jpeg" alt="LostLink Logo" width="220" />

# LostLink

### Kayıp Eşyayı Sahibiyle Buluşturan Platform

*Konum ve kategori bazlı akıllı eşleşme — AI olmadan, mantıkla.*

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%7C%20DB%20%7C%20Storage-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white)](https://leafletjs.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

[🌐 Canlı Demo](#) · [📖 Dokümanlar](#-kurulum) · [🐛 Sorun Bildir](https://github.com/Tahacan3636/LOSTLINK-APP/issues)

</div>

---

## 📌 Proje Hakkında

**LostLink**, kaybettiğimiz eşyalarımızı sahibine kavuşturmayı hedefleyen, topluluk tabanlı bir web platformudur. Kullanıcılar kayıp veya buldukları eşyaları ilan olarak paylaşır; sistem **aynı kategori + zıt durum + yakın konum** kurallarını işleterek olası eşleşmeleri otomatik önerir. **Yapay zekâ kullanılmaz** — tüm eşleşme mantığı açık, deterministik ve ders sunumunda adım adım açıklanabilir.

Bu proje, bir **Bilgisayar Mühendisliği — Yazılım Mühendisliği dersi** kapsamında; kullanıcı arayüzü tasarımı, REST tabanlı backend entegrasyonu, coğrafi veri işleme ve güvenli kimlik doğrulama konularını tek bir demo üzerinde pratikleştirmek için geliştirilmiştir.

---

## 📚 İçindekiler

- [✨ Özellikler](#-özellikler)
- [🛠 Teknoloji Yığını](#-teknoloji-yığını)
- [🧠 Eşleşme Algoritması](#-eşleşme-algoritması-ai-yok)
- [🏗 Mimari](#-mimari)
- [🚀 Kurulum](#-kurulum)
- [📁 Proje Yapısı](#-proje-yapısı)
- [🗄 Veritabanı Şeması](#-veritabanı-şeması)
- [🔒 Güvenlik](#-güvenlik)
- [🗺 Yol Haritası](#-yol-haritası)
- [👥 Takım](#-takım)
- [📜 Lisans](#-lisans)

---

## ✨ Özellikler

| Özellik | Açıklama |
| :-- | :-- |
| 🔐 **Kimlik Doğrulama** | Supabase Auth ile e-posta + şifre, otomatik oturum yönetimi |
| 📝 **İlan CRUD** | Başlık, açıklama, kategori, kayıp/bulundu durumu, foto, koordinat |
| 📸 **Fotoğraf Yükleme** | Supabase Storage — public bucket, RLS korumalı yazma |
| 🗺 **Harita Görünümü** | Leaflet + OpenStreetMap, durum bazlı renkli pin'ler |
| 🔍 **Gelişmiş Filtreleme** | Kategori, durum, metin arama, sıralama |
| 🎯 **Akıllı Eşleşme** | Haversine mesafe + kategori/durum eşleşme algoritması |
| ✉️ **İletişim** | İlan sahibine tek tık e-posta yönlendirme |
| ✅ **İlan Yönetimi** | "Sahibine ulaştı" işareti, silme, oturum tabanlı yetki |
| 📱 **Responsive** | Mobil, tablet ve masaüstü — her ekranda akıcı |

---

## 🛠 Teknoloji Yığını

**Frontend**
- [React 18](https://react.dev) — bileşen tabanlı UI
- [Vite](https://vitejs.dev) — ultra hızlı dev server ve build
- [React Router v6](https://reactrouter.com) — SPA rotalama
- [Tailwind CSS](https://tailwindcss.com) — utility-first tasarım sistemi

**Backend (BaaS)**
- [Supabase Auth](https://supabase.com/auth) — e-posta/şifre doğrulama
- [Supabase PostgreSQL](https://supabase.com/database) — ilişkisel DB + RLS
- [Supabase Storage](https://supabase.com/storage) — fotoğraf yükleme

**Harita & Coğrafi**
- [Leaflet](https://leafletjs.com) — hafif açık kaynak harita motoru
- [React Leaflet](https://react-leaflet.js.org) — React entegrasyonu
- [OpenStreetMap](https://www.openstreetmap.org) — ücretsiz harita verisi

---

## 🧠 Eşleşme Algoritması (AI YOK)

Bir kullanıcı **kayıp** ilan açtığında sistem şu mantığı çalıştırır:

```
1. candidates = items WHERE category = ilan.category
                       AND status   = "found"
                       AND is_recovered = false
                       AND id      != ilan.id

2. FOR EACH c IN candidates:
     c.distance = haversine(ilan.konum, c.konum)

3. SORT candidates BY distance ASC (konumsuzları sona at)
4. RETURN ilk 6 kayıt
```

### Haversine Formülü
İki koordinat arasındaki **büyük daire mesafesini** hesaplar:

<div align="center">

`d = 2R · arcsin( √( sin²(Δφ/2) + cos(φ₁)·cos(φ₂)·sin²(Δλ/2) ) )`

</div>

Kaynak kodu: [`src/lib/utils.js`](src/lib/utils.js) → `distanceKm()`

---

## 🏗 Mimari

```
┌──────────────────┐         ┌──────────────────┐
│  React Frontend  │◄──────►│  Supabase Cloud  │
│  (Vite + SPA)    │  HTTPS  │                  │
└──────────────────┘         │  ┌────────────┐  │
         │                   │  │   Auth     │  │
         │                   │  ├────────────┤  │
         ▼                   │  │ PostgreSQL │  │
  ┌────────────┐             │  ├────────────┤  │
  │  Leaflet   │             │  │  Storage   │  │
  │  + OSM     │             │  └────────────┘  │
  └────────────┘             └──────────────────┘
```

Frontend, Supabase JavaScript SDK üzerinden doğrudan BaaS katmanıyla konuşur — ayrı bir backend sunucu yoktur, RLS politikaları veritabanı seviyesinde yetkilendirmeyi garantiler.

---

## 🚀 Kurulum

### Gereksinimler
- **Node.js** ≥ 20.x
- **npm** ≥ 10.x
- **Git**
- Ücretsiz **Supabase** hesabı

### 1️⃣ Depoyu Klonla

```bash
git clone https://github.com/Tahacan3636/LOSTLINK-APP.git
cd LOSTLINK-APP
```

### 2️⃣ Bağımlılıkları Kur

```bash
npm install
```

### 3️⃣ Supabase Projesi Oluştur

1. [supabase.com](https://supabase.com) → **New project**
2. İsim: `lostlink`, bölge: **Frankfurt (eu-central-1)** (Türkiye'ye en yakın)
3. Güçlü bir DB şifresi belirle

### 4️⃣ Veritabanı Şemasını Yükle

Supabase Dashboard → **SQL Editor** → **New query** → [`supabase/schema.sql`](supabase/schema.sql) dosyasının tamamını yapıştır → **Run**.

Bu komut şunları oluşturur:
- `items` tablosu + index'ler
- Row-Level Security politikaları
- `item-photos` adlı public Storage bucket'ı
- Storage için yazma/silme policy'leri

### 5️⃣ `.env` Dosyasını Yapılandır

```bash
cp .env.example .env
```

Supabase Dashboard → **Settings → API** sayfasından değerleri kopyala:

```env
VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_xxxxxxxxxxxxxxxxxxxx
```

### 6️⃣ Geliştirme Kolaylığı (opsiyonel)

Supabase → **Authentication → Providers → Email** → **"Confirm email"** toggle'ını **kapat**. Bu, kayıt sonrası e-posta doğrulamasını atlar ve demo'yu hızlandırır.

### 7️⃣ Çalıştır

```bash
npm run dev
```

➜ Tarayıcıda [http://localhost:5173](http://localhost:5173)

---

## 📁 Proje Yapısı

```
LOSTLINK-APP/
├── public/
│   └── logo.jpeg                  # Logo + favicon
├── src/
│   ├── components/
│   │   ├── Navbar.jsx             # Üst menü + oturum durumu
│   │   ├── Logo.jsx               # Logo bileşeni (image + text variant)
│   │   ├── ItemCard.jsx           # İlan kartı
│   │   ├── Loader.jsx             # Yükleniyor spinner'ı
│   │   └── ProtectedRoute.jsx     # Auth gerektiren sayfalar için wrapper
│   ├── contexts/
│   │   └── AuthContext.jsx        # Oturum state yönetimi
│   ├── lib/
│   │   ├── supabase.js            # Supabase client instance
│   │   └── utils.js               # Kategoriler, Haversine, geolocation
│   ├── pages/
│   │   ├── Home.jsx               # Hero + feed + filtreler
│   │   ├── Login.jsx              # Giriş
│   │   ├── Register.jsx           # Kayıt
│   │   ├── CreateItem.jsx         # İlan oluşturma
│   │   ├── ItemDetail.jsx         # İlan detayı + eşleşmeler + harita
│   │   ├── MapView.jsx            # Tüm ilanlar harita görünümü
│   │   └── MyItems.jsx            # Kullanıcının kendi ilanları
│   ├── App.jsx                    # Router + layout
│   ├── main.jsx                   # Giriş noktası (Router + Auth provider)
│   └── index.css                  # Tailwind + logo uyumlu tema
├── supabase/
│   └── schema.sql                 # Tablo + RLS + Storage kurulum SQL'i
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js             # Özel brand paleti (logo tonları)
├── vite.config.js
└── README.md
```

---

## 🗄 Veritabanı Şeması

### `items` Tablosu

| Alan | Tip | Kısıt | Açıklama |
| :-- | :-- | :-- | :-- |
| `id` | `uuid` | PK, default `gen_random_uuid()` | Benzersiz ilan ID'si |
| `user_id` | `uuid` | FK → `auth.users`, on delete cascade | İlan sahibi |
| `title` | `text` | not null | İlan başlığı |
| `description` | `text` | not null | Detaylı açıklama |
| `category` | `text` | not null | telefon, canta, anahtar... |
| `status` | `text` | check in (`lost`, `found`) | İlan durumu |
| `image_url` | `text` | | Supabase Storage public URL |
| `latitude` | `double precision` | | Koordinat |
| `longitude` | `double precision` | | Koordinat |
| `location_text` | `text` | | Açıklayıcı konum |
| `contact_email` | `text` | | İletişim için |
| `is_recovered` | `boolean` | default `false` | Sahibine ulaştı işareti |
| `created_at` | `timestamptz` | default `now()` | Oluşturulma zamanı |

### İndeksler
- `items_created_at_idx` — feed sıralaması için
- `items_category_idx` — kategori filtresi için
- `items_status_idx` — durum filtresi için

---

## 🔒 Güvenlik

Tüm yetkilendirme **PostgreSQL Row-Level Security (RLS)** ile veritabanı seviyesinde uygulanır. Frontend'deki anon key **sadece** aşağıdaki operasyonları yapabilir:

| Operasyon | Koşul |
| :-- | :-- |
| SELECT | Herkes (herkesin görmesi için) |
| INSERT | `auth.uid() = user_id` (yalnız kendi adına) |
| UPDATE | `auth.uid() = user_id` (yalnız kendi ilanı) |
| DELETE | `auth.uid() = user_id` (yalnız kendi ilanı) |

**Storage** için benzer: herkes okuyabilir, yalnız kimliği doğrulanmış kullanıcı yazar, yalnız dosya sahibi siler.

Bu mimari, istemcinin aldattığı durumlarda bile veritabanının güvenli kalmasını garantiler.

---

## 🗺 Yol Haritası

Gelecek sürümler için düşünülen özellikler:

- [ ] **Gerçek zamanlı mesajlaşma** — Supabase Realtime + WebSocket
- [ ] **Push bildirim** — yakın konuma yeni ilan düştüğünde
- [ ] **PostGIS tabanlı coğrafi sorgular** — sunucu tarafında mesafe filtresi
- [ ] **Favorilere ekleme** — takip edilen ilanlar
- [ ] **Pagination + virtual scroll** — ölçeklenebilir liste
- [ ] **Admin paneli** — moderasyon, toplu işlemler
- [ ] **Çoklu dil** — TR/EN

---

## 👥 Takım

Bu proje aşağıdaki geliştiriciler tarafından **ortak** olarak hazırlanmıştır:

<table>
  <tr>
    <td align="center" width="50%">
      <a href="https://github.com/Tahacan3636">
        <img src="https://github.com/Tahacan3636.png" width="100" style="border-radius: 50%" alt="Muhammed Taha Can" />
      </a>
      <br>
      <strong>Muhammed Taha Can</strong>
      <br>
      <sub>Full-Stack Geliştirici</sub>
      <br>
      <a href="https://github.com/Tahacan3636">@Tahacan3636</a>
    </td>
    <td align="center" width="50%">
      <a href="https://github.com/laraaicdemir">
        <img src="https://github.com/laraaicdemir.png" width="100" style="border-radius: 50%" alt="Lara İçdemir" />
      </a>
      <br>
      <strong>Lara İçdemir</strong>
      <br>
      <sub>Full-Stack Geliştirici</sub>
      <br>
      <a href="https://github.com/laraaicdemir">@laraaicdemir</a>
    </td>
  </tr>
</table>

---

## 📜 Lisans

Bu proje [MIT Lisansı](LICENSE) ile lisanslanmıştır.

---

<div align="center">

### 🎓 Ders Projesi

**Bilgisayar Mühendisliği** — *Yazılım Mühendisliği* dersi için geliştirildi.

Geliştiriciler: [@Tahacan3636](https://github.com/Tahacan3636) · [@laraaicdemir](https://github.com/laraaicdemir)

</div>
