# IPLogger Dashboard

> Modern ve hızlı bir IP Logger dashboard uygulaması. Kullanıcılar kendi takip linklerini oluşturabilir ve logları gerçek zamanlı olarak görüntüleyebilir.  
> Tema: Karanlık, modern ve renkli UI (Brand renkleri: Indigo, Purple, Emerald).

---

## Özellikler

- Kullanıcı doğrulama ve session yönetimi.
- Logger oluşturma ve yönlendirme (Redirect URL) ekleme.
- Oluşturulan tracker URL’lerini görüntüleme.
- Gerçek zamanlı log takip (IP, cihaz, OS, browser, location, tarih).
- HTML ve React (TSX) gömme kodu desteği.
- Tek tıkla copy ve download (JSON olarak logları indirilebilir).
- Modern UI ile responsive tasarım.

---

## Teknolojiler

- Frontend: React + TypeScript + TailwindCSS
- UI Kit: [Lucide Icons](https://lucide.dev/)
- Backend: Node.js + Express + MongoDB (axios ile API çağrıları)
- Paketler: axios, react-router-dom

---

## Kurulum

1. Repo’yu klonla:  
```bash
git clone https://github.com/kullanici/iplogger-dashboard.git
cd iplogger-dashboard
````

2. Frontend bağımlılıklarını yükle:

```bash
npm install
```

3. `.env` BACKEND'deki env kısmını kendine göre editle.

```env
REACT_APP_API_URL=http://localhost:5000
```

4. Uygulamayı başlat:

```bash
npm start
```

5. Tarayıcıda aç:

```
http://localhost:3000
```

---

## Kullanım

1. Giriş yap (auth sayfasına yönlendirilir, giriş yoksa /auth).
2. Redirect URL alanına yönlendirmek istediğin URL’yi gir.
3. “Create Logger” butonuna bas.
4. Oluşturulan Tracker ID ve URL’yi dashboardda gör.
5. “Watch” butonu ile logları gerçek zamanlı izle.
6. EmbedSection ile HTML veya React bileşenini projenize göm.

---

## Dosya Yapısı

```
src/
├─ components/
│  ├─ EmbedSection.tsx   # HTML & TSX Embed kodları
│  └─ config.ts          # API URL ve genel ayarlar
├─ pages/
│  └─ Dashboard.tsx      # Ana dashboard sayfası
└─ App.tsx
```

---

## Gelecek Özellikler

* Logları JSON veya CSV olarak indirme.
* Kullanıcı rollerine göre dashboard yetkilendirme.
* Daha gelişmiş analiz ve istatistik paneli.
* Tema özelleştirme (light/dark mod).

---

## Lisans

MIT © 2025 IPLogger.io

---

> 💡 Not: Bu proje sadece eğitim ve test amaçlıdır. Gerçek ortamda kullanıcı izni olmadan IP kaydetmek ve takip etmek yasal değildir.