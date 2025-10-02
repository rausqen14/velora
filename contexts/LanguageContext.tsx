import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'tr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('tr');

  useEffect(() => {
    // Load language from localStorage
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'tr' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translations
const translations = {
  tr: {
    header: {
      title: 'Velora',
      home: 'Ana Sayfa',
      prediction: 'Fiyat Tahmini'
    },
    landing: {
      hero: {
        title: 'Arabanızın Değerini',
        subtitle: 'Anında Öğrenin',
        description: 'Akıllı algoritma ile güvenilir araba fiyat tahmini',
        cta: 'Fiyat Tahmini Yap'
      },
      howItWorks: {
        title: 'Nasıl Çalışır?',
        subtitle: '3 basit adımda arabanızın değerini öğrenin',
        step1: {
          title: 'Araç Bilgilerini Girin',
          description: 'Marka, model, yıl, kilometre ve diğer özelliklerini belirtin.'
        },
        step2: {
          title: 'Akıllı Analiz',
          description: 'Gelişmiş algoritma verilerinizi analiz eder ve piyasa değerini hesaplar.'
        },
        step3: {
          title: 'Sonucu Alın',
          description: 'Anında güvenilir fiyat tahmini ve detaylı rapor alın.'
        }
      }
    },
    prediction: {
      title: 'Araba Fiyatını Hesapla',
      subtitle: 'Aracınızın bilgilerini girin ve akıllı algoritmanın piyasa değerini anında tahmin etmesini sağlayın.',
      form: {
        brand: 'Marka',
        model: 'Model',
        age: 'Araç Yaşı (Yıl)',
        newCar: 'Sıfır Araç',
        mileage: 'Kilometre',
        fuelType: 'Yakıt Türü',
        transmission: 'Vites Türü',
        power: 'Güç (HP)',
        torque: 'Tork (Nm)',
        submit: 'Fiyat Tahmini Al',
        calculating: 'Hesaplanıyor...'
      },
      fuelTypes: {
        gasoline: 'Benzin',
        diesel: 'Dizel',
        electric: 'Elektrik',
        hybrid: 'Hibrit',
        other: 'Diğer'
      },
      transmissionTypes: {
        automatic: 'Otomatik',
        manual: 'Manuel',
        semiAutomatic: 'Yarı Otomatik'
      },
      result: {
        title: 'Tahmin Edilen Fiyat',
        estimated: 'Tahmini Piyasa Değeri',
        range: 'Fiyat Aralığı',
        confidence: 'Güven Seviyesi',
        confidenceLevels: {
          high: 'Yüksek',
          medium: 'Orta',
          low: 'Düşük'
        },
        factors: 'Değerlendirme Faktörleri',
        disclaimer: 'Bu tahmin, XGBoost makine öğrenmesi modeli ile hesaplanmıştır. Gerçek piyasa değeri değişiklik gösterebilir. Fiyatlar USD cinsindendir.'
      },
      errors: {
        fillModel: 'Lütfen bir model girin.',
        predictionFailed: 'Tahmin yapılırken bir hata oluştu.',
        unknownError: 'Bilinmeyen bir hata oluştu.',
        failedToFetch: 'Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin.'
      }
    }
  },
  en: {
    header: {
      title: 'Velora',
      home: 'Home',
      prediction: 'Price Prediction'
    },
    landing: {
      hero: {
        title: 'Learn Your Car\'s Value',
        subtitle: 'Instantly',
        description: 'Reliable car price estimation with smart algorithm',
        cta: 'Get Price Estimate'
      },
      howItWorks: {
        title: 'How It Works?',
        subtitle: 'Learn your car\'s value in 3 simple steps',
        step1: {
          title: 'Enter Vehicle Information',
          description: 'Specify the brand, model, year, mileage and other features.'
        },
        step2: {
          title: 'Smart Analysis',
          description: 'Advanced algorithm analyzes your data and calculates market value.'
        },
        step3: {
          title: 'Get Results',
          description: 'Get instant reliable price estimate and detailed report.'
        }
      }
    },
    prediction: {
      title: 'Calculate Car Price',
      subtitle: 'Enter your vehicle information and let the smart algorithm estimate the market value instantly.',
      form: {
        brand: 'Brand',
        model: 'Model',
        age: 'Vehicle Age (Years)',
        newCar: 'New Car',
        mileage: 'Mileage',
        fuelType: 'Fuel Type',
        transmission: 'Transmission Type',
        power: 'Power (HP)',
        torque: 'Torque (Nm)',
        submit: 'Get Price Estimate',
        calculating: 'Calculating...'
      },
      fuelTypes: {
        gasoline: 'Gasoline',
        diesel: 'Diesel',
        electric: 'Electric',
        hybrid: 'Hybrid',
        other: 'Other'
      },
      transmissionTypes: {
        automatic: 'Automatic',
        manual: 'Manual',
        semiAutomatic: 'Semi-Automatic'
      },
      result: {
        title: 'Estimated Price',
        estimated: 'Estimated Market Value',
        range: 'Price Range',
        confidence: 'Confidence Level',
        confidenceLevels: {
          high: 'High',
          medium: 'Medium',
          low: 'Low'
        },
        factors: 'Evaluation Factors',
        disclaimer: 'This prediction is calculated using XGBoost machine learning model. Actual market value may vary. Prices are in USD.'
      },
      errors: {
        fillModel: 'Please enter a model.',
        predictionFailed: 'An error occurred during prediction.',
        unknownError: 'An unknown error occurred.',
        failedToFetch: 'Could not connect to server. Please try again later.'
      }
    }
  }
};
