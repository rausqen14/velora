# 🚀 Deployment Rehberi

Bu rehber, projeyi **Render** (Backend) ve **Vercel** (Frontend) üzerinde yayınlamak için adım adım talimatları içerir.

---

## 📋 Ön Hazırlık

### 1. GitHub Deposu Oluşturun
Projenizi GitHub'a yükleyin:

```bash
# Git deposunu başlatın (henüz başlatmadıysanız)
git init

# Tüm dosyaları ekleyin
git add .

# İlk commit'i yapın
git commit -m "Initial commit for deployment"

# GitHub'da yeni bir repo oluşturun ve bağlayın
git remote add origin https://github.com/KULLANICI_ADINIZ/REPO_ADINIZ.git
git branch -M main
git push -u origin main
```

---

## 🐍 BACKEND - Render Deployment

### Adım 1: Render Hesabı Oluşturun
1. [render.com](https://render.com) adresine gidin
2. GitHub hesabınızla giriş yapın

### Adım 2: Yeni Web Service Oluşturun
1. Dashboard'da **"New +"** butonuna tıklayın
2. **"Web Service"** seçin
3. GitHub reponuzu seçin veya bağlayın

### Adım 3: Ayarları Yapılandırın
Aşağıdaki ayarları girin:

- **Name**: `car-price-backend` (veya istediğiniz isim)
- **Region**: En yakın bölge (örn: Frankfurt, Oregon)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn app:app`

### Adım 4: Environment Variables (Opsiyonel)
Gerekirse environment variable ekleyin:
- `PYTHON_VERSION`: `3.11.0`

### Adım 5: Instance Type
- **Free** planı seçin (başlangıç için yeterli)

### Adım 6: Deploy Edin
1. **"Create Web Service"** butonuna tıklayın
2. Deployment loglarını izleyin (~5-10 dakika sürebilir)
3. Deploy tamamlandığında URL'nizi alacaksınız:
   - Örnek: `https://car-price-backend.onrender.com`

### Adım 7: Backend URL'yi Kaydedin
Bu URL'yi frontend deployment'ta kullanacağız.

⚠️ **ÖNEMLİ NOT**: Render free plan'da uygulama 15 dakika inaktif kaldıktan sonra uyur. İlk istek 30-60 saniye sürebilir.

---

## ⚡ FRONTEND - Vercel Deployment

### Adım 1: Vercel Hesabı Oluşturun
1. [vercel.com](https://vercel.com) adresine gidin
2. GitHub hesabınızla giriş yapın

### Adım 2: Yeni Proje Oluşturun
1. **"Add New..."** → **"Project"** seçin
2. GitHub reponuzu seçin
3. **"Import"** butonuna tıklayın

### Adım 3: Proje Ayarları
Vercel otomatik olarak Vite projesini algılayacak:

- **Framework Preset**: `Vite`
- **Root Directory**: `./` (ana klasör)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Adım 4: Environment Variables Ekleyin
**Environment Variables** bölümüne şunu ekleyin:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://car-price-backend.onrender.com` |

⚠️ **ÖNEMLİ**: Render'dan aldığınız backend URL'yi buraya yapıştırın!

### Adım 5: Deploy Edin
1. **"Deploy"** butonuna tıklayın
2. Build loglarını izleyin (~2-3 dakika)
3. Deploy tamamlandığında URL'nizi alacaksınız:
   - Örnek: `https://car-price-app.vercel.app`

---

## 🔧 CORS Ayarları (Backend)

Frontend URL'nizi aldıktan sonra backend'de CORS ayarlarını güncelleyin:

1. `backend/app.py` dosyasını açın
2. Şu satırı bulun:
```python
"https://your-app-name.vercel.app"  # Replace with your actual Vercel URL
```

3. Vercel URL'nizi yapıştırın:
```python
"https://car-price-app.vercel.app"  # Kendi URL'nizi yazın
```

4. Değişiklikleri commit ve push edin:
```bash
git add backend/app.py
git commit -m "Update CORS for Vercel URL"
git push
```

Render otomatik olarak yeniden deploy edecek.

---

## ✅ Test Edin

### Backend Test
```bash
curl https://car-price-backend.onrender.com/health
```

Beklenen yanıt:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "features_count": 67
}
```

### Frontend Test
1. Vercel URL'nizi tarayıcıda açın
2. **"Fiyat Tahmini Yap"** butonuna tıklayın
3. Formu doldurup test edin

---

## 🔄 Güncelleme ve Yeniden Deploy

### Kod Değişikliklerini Deploy Etme

**Backend için:**
```bash
git add backend/
git commit -m "Backend güncelleme"
git push
```
Render otomatik olarak yeniden deploy eder.

**Frontend için:**
```bash
git add .
git commit -m "Frontend güncelleme"
git push
```
Vercel otomatik olarak yeniden deploy eder.

---

## 🐛 Sorun Giderme

### Backend Sorunları

**Problem**: Model yükleme hatası
- **Çözüm**: Render loglarını kontrol edin. Model dosyaları Git'te olduğundan emin olun.

**Problem**: "Service Unavailable" hatası
- **Çözüm**: Free plan'da uygulama uyumuş olabilir. İlk istek 30-60 saniye bekleyin.

**Problem**: CORS hatası
- **Çözüm**: `backend/app.py`'deki CORS ayarlarında Vercel URL'nizi eklediğinizden emin olun.

### Frontend Sorunları

**Problem**: API çağrısı başarısız
- **Çözüm**: Vercel'de `VITE_API_URL` environment variable'ının doğru ayarlandığından emin olun.

**Problem**: Build hatası
- **Çözüm**: Lokalde `npm run build` çalıştırıp hataları görün.

### Environment Variable Değişikliği
Environment variable'ı güncellediyseniz:
1. Vercel Dashboard → Settings → Environment Variables
2. Değişikliği yapın
3. Deployments sekmesine gidin
4. Son deployment'ın yanındaki **"..."** → **"Redeploy"** tıklayın

---

## 💡 İpuçları

1. **Custom Domain**: Vercel ve Render'da kendi domain'inizi bağlayabilirsiniz
2. **Analytics**: Vercel otomatik analytics sunar
3. **Monitoring**: Render'da logs ve metrics mevcuttur
4. **Database**: Gelecekte veritabanı eklemek isterseniz Render PostgreSQL kullanabilirsiniz
5. **Upgrade**: Daha iyi performans için Free plan'dan Pro plan'a geçebilirsiniz

---

## 📊 Deployment Checklist

### Backend (Render)
- [ ] GitHub reposu oluşturuldu
- [ ] Render hesabı oluşturuldu
- [ ] Web service yapılandırıldı
- [ ] Build başarılı oldu
- [ ] `/health` endpoint çalışıyor
- [ ] Backend URL kaydedildi

### Frontend (Vercel)
- [ ] Vercel hesabı oluşturuldu
- [ ] Proje import edildi
- [ ] `VITE_API_URL` environment variable eklendi
- [ ] Build başarılı oldu
- [ ] UI açılıyor
- [ ] API çağrıları çalışıyor

### Son Kontroller
- [ ] CORS ayarları güncellendi
- [ ] Fiyat tahmini end-to-end test edildi
- [ ] Her iki URL bookmark edildi
- [ ] Deployment dökümanı okundu

---

## 🎉 Tebrikler!

Projeniz şimdi canlıda! 🚀

**Backend**: https://car-price-backend.onrender.com
**Frontend**: https://car-price-app.vercel.app

Sorularınız için GitHub Issues kullanabilirsiniz.

