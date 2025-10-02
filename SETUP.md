# 🚗 Car Price Prediction - Setup Guide

## ✅ Backend (Python Flask) Çalışıyor!

Backend **http://localhost:5000** adresinde çalışıyor.

### Backend Durumu
- ✅ Model yüklendi (XGBoost, R²=0.9388)
- ✅ 67 özellik aktif
- ✅ Flask API hazır
- ✅ CORS aktif

---

## 🚀 Kullanım

### 1. Backend (Zaten Çalışıyor)
Backend şu anda arka planda çalışıyor. Tekrar başlatmak isterseniz:

```bash
cd backend
python app.py
```

### 2. Frontend (Vite Dev Server)
Şu anda **http://localhost:3000** veya **http://localhost:3001** adresinde çalışıyor.

---

## 🧪 Test Etme

### Manuel Test
1. Ana sayfaya gidin: http://localhost:3000
2. **"Fiyat Tahmini Yap"** butonuna tıklayın
3. Formu doldurun:
   - **Marka**: Toyota
   - **Model**: Camry
   - **Araç Yaşı**: 5
   - **Kilometre**: 50000
   - **Yakıt Türü**: Gasoline
   - **Vites Türü**: A (Otomatik)
   - **Güç**: 200 HP
   - **Tork**: 250 Nm
4. **"Fiyat Tahmini Al"** butonuna tıklayın

### Beklenen Sonuç
- ✅ Fiyat: **~$19,000 - $20,000**
- ✅ Confidence: **high**
- ✅ Min-Max aralığı gösterilecek

---

## 🔧 API Endpoints

### Health Check
```bash
curl http://localhost:5000/health
```

### Fiyat Tahmini
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "brand": "Toyota",
    "model": "Camry",
    "isNew": false,
    "age": 5,
    "mileage": 50000,
    "fuelType": "Gasoline",
    "transmission": "A",
    "power": 200,
    "torque": 250
  }'
```

### Model Bilgileri
```bash
curl http://localhost:5000/model-info
```

---

## 📊 Model Detayları

- **Algorithm**: XGBoost Gradient Boosting
- **Performance**: R² = 0.9388, MAPE = 8.94%
- **Training Data**: 1,816,407 arabalar
- **Features**: 67 (numeric + categorical)
- **Brands**: 67 farklı marka
- **Models**: 958 farklı model
- **Price Range**: $4,000 - $129,535
- **Currency**: USD

---

## 🎯 Özellikler

### ✅ Tamamlanan
1. ✅ **Gerçek ML Modeli**: XGBoost ile eğitilmiş
2. ✅ **Python Backend**: Flask API
3. ✅ **Preprocessing Pipeline**: 
   - Log transform (mileage, price)
   - Target encoding (model names)
   - One-hot encoding (brand, fuel, transmission)
4. ✅ **Frontend Integration**: React + TypeScript
5. ✅ **Dinamik Form**: Veri setine dayalı seçenekler
6. ✅ **USD Fiyatlandırma**: Fiyatlar dolar cinsinden

### 🔄 Preprocessing Detayları
- **is_new**: Sıfır araç (0/1)
- **age**: Araç yaşı
- **mileage**: Log(kilometre)
- **power**: Güç (HP)
- **torque**: Tork (Nm)
- **model_name**: Target encoded (958 model)
- **brand**: One-hot encoded (67 marka)
- **fuel_type**: One-hot encoded (5 tür)
- **transmission**: One-hot encoded (3 tür)

---

## 🐛 Sorun Giderme

### Backend çalışmıyor
```bash
cd backend
python app.py
```

### Frontend çalışmıyor
```bash
npm run dev
```

### CORS Hatası
Backend'de zaten CORS aktif. Eğer sorun yaşıyorsanız, backend'i yeniden başlatın.

### Model Yükleme Hatası
Model dosyası çok büyük (99.8 MB). İlk yükleme 10-15 saniye sürebilir.

---

## 📝 Notlar

- **Fiyatlar USD cinsinden**: Model Amerika veri setiyle eğitilmiş
- **Confidence Levels**: 
  - **high**: Model veri setinde mevcut
  - **medium**: Model veri setinde yok (global mean kullanıldı)
- **Tahmin Aralığı**: ±10% (MAPE'e dayalı)

---

## 🎨 UI/UX Özellikleri

- ✅ Modern, minimalist tasarım
- ✅ Light-weight Inter font
- ✅ Glassmorphism efektleri
- ✅ Dinamik form validasyonu
- ✅ Loading states ve animasyonlar
- ✅ Error boundary ile hata yönetimi
- ✅ Responsive design

---

**🚀 Hazırsınız! Artık gerçek fiyat tahminleri yapabilirsiniz!**

