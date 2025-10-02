# 🚀 Hızlı Deployment Rehberi

## 📝 Özet

Bu projeyi 3 ana adımda yayınlayabilirsiniz:

---

## 1️⃣ GitHub'a Yükleyin

```bash
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/KULLANICI_ADINIZ/REPO_ADINIZ.git
git branch -M main
git push -u origin main
```

---

## 2️⃣ Backend - Render

1. **render.com** → Giriş yap (GitHub ile)
2. **New +** → **Web Service**
3. Reponuzu seçin
4. Ayarlar:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Plan**: Free
5. **Create Web Service**
6. URL'yi kaydet (örn: `https://car-price-backend.onrender.com`)

---

## 3️⃣ Frontend - Vercel

1. **vercel.com** → Giriş yap (GitHub ile)
2. **Add New** → **Project**
3. Reponuzu seçin ve import et
4. **Environment Variables** ekle:
   ```
   VITE_API_URL = https://car-price-backend.onrender.com
   ```
   (Render'dan aldığınız URL'yi yapıştırın)
5. **Deploy**
6. URL'yi kaydet (örn: `https://car-price-app.vercel.app`)

---

## 4️⃣ CORS'u Güncelle

1. `backend/app.py` dosyasında bu satırı bulun:
   ```python
   "https://your-app-name.vercel.app"
   ```

2. Vercel URL'nizi yazın:
   ```python
   "https://car-price-app.vercel.app"
   ```

3. Commit ve push:
   ```bash
   git add backend/app.py
   git commit -m "Update CORS"
   git push
   ```

---

## ✅ Test Edin

**Backend:**
```bash
curl https://BACKEND_URL/health
```

**Frontend:**
Tarayıcıda Vercel URL'nizi açın ve fiyat tahmini yapın.

---

## ⚡ Notlar

- **İlk yükleme**: Render free plan'da ilk istek 30-60 saniye sürebilir
- **Güncelleme**: Git push yapınca otomatik deploy olur
- **Detaylı rehber**: `DEPLOYMENT.md` dosyasına bakın

---

**Başarılar! 🎉**

