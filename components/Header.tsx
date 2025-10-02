import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Header: React.FC = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  // Check if we are on the landing page
  const isLandingPage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      // Set scrolled to true if user scrolls down more than 10px, otherwise false
      setScrolled(window.scrollY > 10);
    };

    // Add event listener only on the landing page
    if (isLandingPage) {
      window.addEventListener('scroll', handleScroll);
      // Initial check in case the page is reloaded scrolled down
      handleScroll();
    } else {
      // On other pages, the header is always "scrolled" style
      setScrolled(true);
    }

    // Cleanup function
    return () => {
      if (isLandingPage) {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isLandingPage]); // Rerun effect if the page changes

  // Determine header styles based on page and scroll position
  const isTransparentAtTop = isLandingPage && !scrolled;

  // On landing page when scrolled, apply a glass effect.
  // On other pages, apply a solid (semi-transparent white) effect.
  const scrolledClasses = isLandingPage 
    ? 'bg-black/20 backdrop-blur-md' // Glass effect for landing page
    : 'bg-white/80 backdrop-blur-sm shadow-sm'; // Solid effect for other pages

  const headerClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isTransparentAtTop ? 'bg-transparent shadow-none' : scrolledClasses
  }`;

  // Text should be white on landing page (top or scrolled), dark on other pages.
  const useWhiteText = isLandingPage;

  const logoClasses = `text-xl font-light tracking-wider transition-colors ${
    useWhiteText ? 'text-white' : 'text-gray-800'
  }`;
  
  const navLinkClasses = (path: string) => 
    `text-sm font-light transition-colors ${
      useWhiteText
        ? 'text-white hover:text-gray-200'
        : location.pathname === path 
          ? 'text-blue-500' 
          : 'text-gray-500 hover:text-gray-900'
    }`;

  return (
    <header className={headerClasses}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <Link to="/" className={logoClasses}>
              Velora
            </Link>
          </div>
          <nav className="hidden md:flex md:items-center md:space-x-8">
            <Link to="/" className={navLinkClasses('/')}>
              {t('header.home')}
            </Link>
            <Link to="/tahmin" className={navLinkClasses('/tahmin')}>
              {t('header.prediction')}
            </Link>
            <button
              onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
              className={`text-sm font-light transition-colors px-3 py-1 rounded border ${
                useWhiteText
                  ? 'text-white border-white/30 hover:bg-white/10'
                  : 'text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
              title={language === 'tr' ? 'Switch to English' : 'Türkçe\'ye Geç'}
            >
              {language === 'tr' ? '🇬🇧 EN' : '🇹🇷 TR'}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;