import React, { useState, useEffect } from 'react';
import { CarDetails, PredictionResult } from '../types';
import { BRANDS, BRAND_MODELS, MODEL_AVAILABLE_POWERS, MODEL_AVAILABLE_TORQUES, MODEL_AVAILABLE_FUELS, MODEL_AVAILABLE_TRANSMISSIONS, FUEL_TYPES, TRANSMISSION_TYPES } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

const PredictionPage: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<CarDetails>({
    brand: BRANDS[0] || 'Acura',
    model: BRAND_MODELS[BRANDS[0]]?.[0] || '',
    isNew: false,
    age: 3,
    mileage: 50000,
    fuelType: FUEL_TYPES[0].value,
    transmission: TRANSMISSION_TYPES[0].value,
    power: 200,
    torque: 300,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [availableTransmissions, setAvailableTransmissions] = useState<typeof TRANSMISSION_TYPES>([]);
  const [availableFuelTypes, setAvailableFuelTypes] = useState<typeof FUEL_TYPES>([]);
  const [availablePowers, setAvailablePowers] = useState<number[]>([]);
  const [availableTorques, setAvailableTorques] = useState<number[]>([]);
  const [powerRange] = useState({ min: 100, max: 1000, typical: 200 });
  const [torqueRange] = useState({ min: 50, max: 2000, typical: 300 });

  // Marka değiştiğinde modelleri güncelle
  useEffect(() => {
    if (formData.brand && BRAND_MODELS && BRAND_MODELS[formData.brand]) {
      const models = BRAND_MODELS[formData.brand];
      setAvailableModels(models);
      // Eğer seçili model yeni markanın modellerinde yoksa, ilk modeli seç
      if (models.length > 0 && !models.includes(formData.model)) {
        setFormData(prev => ({ ...prev, model: models[0] }));
      }
    }
  }, [formData.brand]);

  // Marka ve model değiştiğinde vites türlerini güncelle
  useEffect(() => {
    if (formData.brand && formData.model && MODEL_AVAILABLE_TRANSMISSIONS) {
      const modelKey = `${formData.brand}-${formData.model}`;
      
      // Veri setinden mevcut vites türlerini al
      if (MODEL_AVAILABLE_TRANSMISSIONS[modelKey]) {
        const allowedTransmissions = MODEL_AVAILABLE_TRANSMISSIONS[modelKey];
        
        // TRANSMISSION_TYPES array'inden filtrele
        const filteredTransmissions = TRANSMISSION_TYPES.filter(t => 
          allowedTransmissions.includes(t.value)
        );
        
        setAvailableTransmissions(filteredTransmissions);
        
        // Eğer seçili vites türü yeni listede yoksa, ilk seçeneği seç
        if (filteredTransmissions.length > 0 && !allowedTransmissions.includes(formData.transmission)) {
          setFormData(prev => ({ ...prev, transmission: filteredTransmissions[0].value }));
        }
      } else {
        // Model veri setinde yoksa, tüm türleri göster
        setAvailableTransmissions(TRANSMISSION_TYPES);
      }
    }
  }, [formData.brand, formData.model]);

  // Marka ve model değiştiğinde yakıt türlerini güncelle
  useEffect(() => {
    if (formData.brand && formData.model && MODEL_AVAILABLE_FUELS) {
      const modelKey = `${formData.brand}-${formData.model}`;
      
      // Veri setinden mevcut yakıt türlerini al
      if (MODEL_AVAILABLE_FUELS[modelKey]) {
        const allowedFuels = MODEL_AVAILABLE_FUELS[modelKey];
        
        // FUEL_TYPES array'inden filtrele
        const filteredFuels = FUEL_TYPES.filter(f => 
          allowedFuels.includes(f.value)
        );
        
        setAvailableFuelTypes(filteredFuels);
        
        // Eğer seçili yakıt türü yeni listede yoksa, ilk seçeneği seç
        if (filteredFuels.length > 0 && !allowedFuels.includes(formData.fuelType)) {
          setFormData(prev => ({ ...prev, fuelType: filteredFuels[0].value }));
        }
      } else {
        // Model veri setinde yoksa, tüm türleri göster
        setAvailableFuelTypes(FUEL_TYPES);
      }
    }
  }, [formData.brand, formData.model]);

  // Marka ve model değiştiğinde mevcut güç değerlerini güncelle
  useEffect(() => {
    if (formData.brand && formData.model && MODEL_AVAILABLE_POWERS) {
      const modelKey = `${formData.brand}-${formData.model}`;
      
      // Veri setinden mevcut güç değerlerini al
      if (MODEL_AVAILABLE_POWERS[modelKey]) {
        const powers = MODEL_AVAILABLE_POWERS[modelKey];
        setAvailablePowers(powers);
        
        // Eğer mevcut güç değeri listede yoksa, ilk değeri kullan
        if (powers.length > 0 && !powers.includes(formData.power)) {
          setFormData(prev => ({ ...prev, power: powers[0] }));
        }
      } else {
        // Model veri setinde yoksa, boş liste göster
        setAvailablePowers([]);
        // Varsayılan bir değer ata
        setFormData(prev => ({ ...prev, power: 200 }));
      }
    }
  }, [formData.brand, formData.model]);

  // Marka ve model değiştiğinde mevcut tork değerlerini güncelle
  useEffect(() => {
    if (formData.brand && formData.model && MODEL_AVAILABLE_TORQUES) {
      const modelKey = `${formData.brand}-${formData.model}`;
      
      // Veri setinden mevcut tork değerlerini al
      if (MODEL_AVAILABLE_TORQUES[modelKey]) {
        const torques = MODEL_AVAILABLE_TORQUES[modelKey];
        setAvailableTorques(torques);
        
        // Eğer mevcut tork değeri listede yoksa, ilk değeri kullan
        if (torques.length > 0 && !torques.includes(formData.torque)) {
          setFormData(prev => ({ ...prev, torque: torques[0] }));
        }
      } else {
        // Model veri setinde yoksa, boş liste göster
        setAvailableTorques([]);
        // Varsayılan bir değer ata
        setFormData(prev => ({ ...prev, torque: 300 }));
      }
    }
  }, [formData.brand, formData.model]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      // Sıfır araç seçildiğinde yaşı ve kilometreyi 0 yap
      // Sıfır araç kaldırıldığında yaş 1, kilometre 1000 yap
      if (name === 'isNew') {
        if (checked) {
          setFormData(prev => ({ ...prev, [name]: checked, age: 0, mileage: 0 }));
        } else {
          setFormData(prev => ({ ...prev, [name]: checked, age: 1, mileage: 1000 }));
        }
      } else {
        setFormData(prev => ({ ...prev, [name]: checked }));
      }
    } else if (name === 'power' || name === 'torque' || name === 'age' || name === 'mileage') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Veri setine göre optimize edilmiş fiyat hesaplama
  const calculatePrice = (details: CarDetails): PredictionResult => {
    let basePrice = 400000;
    
    // Marka değer katsayıları
    const brandMultipliers: { [key: string]: number } = {
      'Mercedes-Benz': 2.0, 'BMW': 1.9, 'Audi': 1.8, 'Porsche': 2.5,
      'Tesla': 2.2, 'Lexus': 1.7, 'Land Rover': 1.8, 'Ferrari': 3.0,
      'Lamborghini': 3.5, 'Rolls-Royce': 3.2, 'Bentley': 2.8, 'Maserati': 2.3,
      'McLaren': 2.7, 'Aston Martin': 2.4, 'Cadillac': 1.6, 'Genesis': 1.4,
      'Infiniti': 1.5, 'Acura': 1.4, 'Volvo': 1.5, 'Jaguar': 1.6,
      'Toyota': 1.3, 'Honda': 1.2, 'Hyundai': 1.1, 'Kia': 1.1,
      'Mazda': 1.1, 'Subaru': 1.2, 'Ford': 1.0, 'Chevrolet': 1.0,
      'Nissan': 1.0, 'Volkswagen': 1.2, 'Jeep': 1.1, 'Dodge': 1.0,
      'Ram': 1.1, 'GMC': 1.0, 'Buick': 0.9, 'Chrysler': 0.9,
      'Mitsubishi': 0.9, 'Fiat': 0.85, 'Alfa Romeo': 1.3, 'Mini': 1.1,
      'Lincoln': 1.3
    };
    
    basePrice *= brandMultipliers[details.brand] || 1.0;
    
    // Sıfır araç bonusu
    if (details.isNew) {
      basePrice *= 1.7;
    } else {
      // Yaş etkisi (kullanılmış araçlar için)
      const ageFactor = Math.max(0.3, 1 - (details.age * 0.09));
      basePrice *= ageFactor;
    }
    
    // Kilometre etkisi
    const kmFactor = Math.max(0.25, 1 - (details.mileage / 400000));
    basePrice *= kmFactor;
    
    // Yakıt türü etkisi
    const fuelMultipliers: { [key: string]: number } = {
      'Gasoline': 1.0,
      'Diesel': 1.05,
      'Hybrid': 1.25,
      'Flex Fuel Vehicle': 0.95,
      'Compressed Natural Gas': 0.85,
      'Biodiesel': 0.9
    };
    basePrice *= fuelMultipliers[details.fuelType] || 1.0;
    
    // Vites türü etkisi
    const transmissionMultipliers: { [key: string]: number } = {
      'A': 1.15,
      'M': 1.0,
      'CVT': 1.08,
      'Dual Clutch': 1.18
    };
    basePrice *= transmissionMultipliers[details.transmission] || 1.0;
    
    // Güç etkisi (HP)
    if (details.power >= 500) basePrice *= 1.5;
    else if (details.power >= 400) basePrice *= 1.35;
    else if (details.power >= 300) basePrice *= 1.25;
    else if (details.power >= 250) basePrice *= 1.18;
    else if (details.power >= 200) basePrice *= 1.1;
    else if (details.power >= 150) basePrice *= 1.05;
    
    // Tork etkisi (Nm)
    if (details.torque >= 600) basePrice *= 1.25;
    else if (details.torque >= 500) basePrice *= 1.2;
    else if (details.torque >= 400) basePrice *= 1.15;
    else if (details.torque >= 300) basePrice *= 1.08;
    
    // Nihai fiyatı yuvarla
    const finalPrice = Math.round(basePrice / 1000) * 1000;
    
    // Açıklama oluştur
    const currentYear = new Date().getFullYear();
    const yearCalculated = currentYear - details.age;
    const newStatus = details.isNew ? 'sıfır' : `${yearCalculated} model kullanılmış`;
    const transmissionLabel = TRANSMISSION_TYPES.find(t => t.value === details.transmission)?.label || details.transmission;
    const fuelLabel = FUEL_TYPES.find(f => f.value === details.fuelType)?.label || details.fuelType;
    
    const explanation = `${details.brand} ${details.model} (${newStatus}, ${details.mileage.toLocaleString('tr-TR')} km${details.age > 0 ? `, ${details.age} yaşında` : ''}) aracınızın tahmini değeri, güç (${details.power} HP), tork (${details.torque} Nm), yakıt türü (${fuelLabel}) ve vites tipi (${transmissionLabel}) özellikleri göz önünde bulundurularak hesaplanmıştır.`;
    
    return {
      price: finalPrice,
      currency: 'TRY',
      explanation
    };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      if (!formData.model.trim()) {
        throw new Error(t('prediction.errors.fillModel'));
      }
      
      // API'ye istek gönder
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t('prediction.errors.predictionFailed'));
      }

      const data = await response.json();
      
      // API response'u PredictionResult formatına dönüştür
      const prediction: PredictionResult = {
        estimatedPrice: data.predicted_price,
        minPrice: data.min_price,
        maxPrice: data.max_price,
        confidence: data.confidence,
        factors: [
          `${t('prediction.form.brand')}: ${formData.brand}`,
          `${t('prediction.form.model')}: ${formData.model}`,
          `${t('prediction.form.age')}: ${formData.age}`,
          `${t('prediction.form.mileage')}: ${formData.mileage.toLocaleString()}`,
          `${t('prediction.form.fuelType')}: ${formData.fuelType}`,
          `${t('prediction.form.transmission')}: ${formData.transmission}`,
          `${t('prediction.form.power')}: ${formData.power} HP`,
          `${t('prediction.form.torque')}: ${formData.torque} Nm`
        ]
      };
      
      setResult(prediction);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch')) {
          setError(t('prediction.errors.failedToFetch'));
        } else {
          setError(err.message);
        }
      } else {
        setError(t('prediction.errors.unknownError'));
      }
    } finally {
      setLoading(false);
    }
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(price);
  };

  const inputBaseClasses = "mt-1 block w-full py-3 text-base font-light text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors";
  const labelClasses = "block text-sm font-light text-gray-700";

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 sm:p-10 rounded-xl shadow-lg w-full max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-thin tracking-tight text-gray-900 sm:text-4xl">{t('prediction.title')}</h1>
            <p className="mt-3 text-lg font-light text-gray-500">{t('prediction.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="brand" className={labelClasses}>{t('prediction.form.brand')}</label>
                <select id="brand" name="brand" value={formData.brand} onChange={handleChange} className={`${inputBaseClasses} custom-select pl-4 pr-12`}>
                  {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              
              <div>
                <label htmlFor="model" className={labelClasses}>{t('prediction.form.model')}</label>
                <select 
                  id="model" 
                  name="model" 
                  value={formData.model} 
                  onChange={handleChange} 
                  required 
                  className={`${inputBaseClasses} custom-select pl-4 pr-12`}
                >
                  {availableModels.length === 0 && <option value="">Model seçin</option>}
                  {availableModels.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center pt-6">
                <input 
                  type="checkbox" 
                  id="isNew" 
                  name="isNew" 
                  checked={formData.isNew} 
                  onChange={handleChange} 
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isNew" className="ml-3 text-sm font-light text-gray-700">
                  {t('prediction.form.newCar')}
                </label>
              </div>

              <div>
                <label htmlFor="age" className={labelClasses}>{t('prediction.form.age')}</label>
                <input 
                  type="number" 
                  id="age" 
                  name="age" 
                  value={formData.age} 
                  onChange={handleChange} 
                  min={formData.isNew ? "0" : "1"} 
                  max="50"
                  disabled={formData.isNew}
                  required 
                  className={`${inputBaseClasses} px-4 ${formData.isNew ? 'bg-gray-200 cursor-not-allowed' : ''}`} 
                />
              </div>

              <div>
                <label htmlFor="mileage" className={labelClasses}>{t('prediction.form.mileage')}</label>
                <input 
                  type="number" 
                  id="mileage" 
                  name="mileage" 
                  value={formData.mileage} 
                  onChange={handleChange} 
                  placeholder="50000" 
                  min={formData.isNew ? "0" : "1000"}
                  disabled={formData.isNew}
                  required
                  className={`${inputBaseClasses} px-4 ${formData.isNew ? 'bg-gray-200 cursor-not-allowed' : ''}`} 
                />
              </div>

              <div>
                <label htmlFor="fuelType" className={labelClasses}>{t('prediction.form.fuelType')}</label>
                <select id="fuelType" name="fuelType" value={formData.fuelType} onChange={handleChange} className={`${inputBaseClasses} custom-select pl-4 pr-12`}>
                  {availableFuelTypes.length === 0 && <option value="">Model seçin</option>}
                  {availableFuelTypes.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="transmission" className={labelClasses}>{t('prediction.form.transmission')}</label>
                <select id="transmission" name="transmission" value={formData.transmission} onChange={handleChange} className={`${inputBaseClasses} custom-select pl-4 pr-12`}>
                  {availableTransmissions.length === 0 && <option value="">Model seçin</option>}
                  {availableTransmissions.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="power" className={labelClasses}>{t('prediction.form.power')}</label>
                {availablePowers.length > 0 ? (
                  <select 
                    id="power" 
                    name="power" 
                    value={formData.power} 
                    onChange={handleChange} 
                    required 
                    className={`${inputBaseClasses} custom-select pl-4 pr-12`}
                  >
                    {availablePowers.map(p => (
                      <option key={p} value={p}>{p} HP</option>
                    ))}
                  </select>
                ) : (
                  <input 
                    type="number" 
                    id="power" 
                    name="power" 
                    value={formData.power} 
                    onChange={handleChange} 
                    placeholder={`${powerRange.min}-${powerRange.max} HP`}
                    min={powerRange.min}
                    max={powerRange.max}
                    required 
                    className={`${inputBaseClasses} px-4`} 
                  />
                )}
              </div>

              <div>
                <label htmlFor="torque" className={labelClasses}>{t('prediction.form.torque')}</label>
                {availableTorques.length > 0 ? (
                  <select 
                    id="torque" 
                    name="torque" 
                    value={formData.torque} 
                    onChange={handleChange} 
                    required 
                    className={`${inputBaseClasses} custom-select pl-4 pr-12`}
                  >
                    {availableTorques.map(t => (
                      <option key={t} value={t}>{t} Nm</option>
                    ))}
                  </select>
                ) : (
                  <input 
                    type="number" 
                    id="torque" 
                    name="torque" 
                    value={formData.torque} 
                    onChange={handleChange} 
                    placeholder="300 Nm"
                    min="50"
                    max="2000"
                    required 
                    className={`${inputBaseClasses} px-4`} 
                  />
                )}
              </div>
            </div>

            <div className="mt-8">
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-light text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition duration-300"
              >
                {loading ? t('prediction.form.calculating') : t('prediction.form.submit')}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-100 text-red-700 font-light rounded-lg">
              {error}
            </div>
          )}
          
          {result && (
            <div className="mt-8 space-y-6 animate-fade-in">
              <div className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl text-center shadow-lg">
                <h3 className="text-xl font-light text-gray-700 mb-4">{t('prediction.result.estimated')}</h3>
                <p className="text-5xl font-thin text-blue-700 my-4">{formatPrice(result.estimatedPrice)}</p>
                <div className="flex justify-center items-center gap-4 text-gray-600 font-light mt-4">
                  <span className="px-4 py-2 bg-white rounded-lg shadow-sm">
                    Min: {formatPrice(result.minPrice)}
                  </span>
                  <span className="px-4 py-2 bg-white rounded-lg shadow-sm">
                    Max: {formatPrice(result.maxPrice)}
                  </span>
                </div>
              </div>
              
              <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                <h4 className="text-lg font-light text-gray-700 mb-3">{t('prediction.result.factors')}</h4>
                <ul className="space-y-2">
                  {result.factors.map((factor, idx) => (
                    <li key={idx} className="text-gray-600 font-light flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-gray-500 text-sm font-light text-center">
                {t('prediction.result.disclaimer')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictionPage;