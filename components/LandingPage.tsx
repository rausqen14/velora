import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import Step from './Step';

const LandingPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-start justify-center text-center text-white">
        <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('/background.jpg')` }}></div>
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60"></div>
        <div className="relative z-10 p-4 mt-32">
          <h1 className="text-5xl md:text-7xl font-thin tracking-tight drop-shadow-lg">
            {t('landing.hero.title')}
            <span className="block text-white" style={{ fontWeight: 100, letterSpacing: '0.05em' }}>{t('landing.hero.subtitle')}</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-200 drop-shadow-md">
            {t('landing.hero.description')}
          </p>
          <div className="mt-4 flex justify-center">
            <Link 
              to="/tahmin" 
              className="px-8 py-3 bg-white/20 border border-white/30 font-semibold text-white hover:bg-white/30 transition-all duration-300"
            >
              {t('landing.hero.cta')}
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-thin tracking-tight text-gray-900 sm:text-5xl">{t('landing.howItWorks.title')}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg font-light text-gray-500">{t('landing.howItWorks.subtitle')}</p>
          <div className="mt-16 grid gap-16 md:grid-cols-3">
            <Step 
              number={1}
              title={t('landing.howItWorks.step1.title')}
              description={t('landing.howItWorks.step1.description')}
            />
            <Step 
              number={2}
              title={t('landing.howItWorks.step2.title')}
              description={t('landing.howItWorks.step2.description')}
            />
            <Step 
              number={3}
              title={t('landing.howItWorks.step3.title')}
              description={t('landing.howItWorks.step3.description')}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;