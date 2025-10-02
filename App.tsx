
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import PredictionPage from './components/PredictionPage';
import DebugPage from './components/DebugPage';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <Header />
        <ErrorBoundary>
          <main>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/tahmin" element={<PredictionPage />} />
              <Route path="/debug" element={<DebugPage />} />
            </Routes>
          </main>
        </ErrorBoundary>
        <Analytics />
      </div>
    </LanguageProvider>
  );
};

export default App;
