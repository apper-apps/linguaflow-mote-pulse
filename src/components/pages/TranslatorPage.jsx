import { useState } from "react";
import { motion } from "framer-motion";
import TranslationCard from "@/components/organisms/TranslationCard";
import TranslationHistory from "@/components/organisms/TranslationHistory";

const TranslatorPage = () => {
  const [historyRefresh, setHistoryRefresh] = useState(0);

  const handleTranslationComplete = (translation) => {
    // Trigger history refresh
    setHistoryRefresh(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4">
            LinguaFlow
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Break down language barriers with instant, accurate translations between 15+ global languages including major Indian languages.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Translation Interface */}
          <div className="lg:col-span-2">
            <TranslationCard 
              onTranslationComplete={handleTranslationComplete}
            />
          </div>

          {/* Translation History Sidebar */}
          <div className="lg:col-span-1">
            <TranslationHistory 
              refreshTrigger={historyRefresh}
            />
          </div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="font-display font-semibold text-lg text-gray-900 mb-2">
              Lightning Fast
            </h3>
            <p className="text-gray-600 text-sm">
              Get instant translations with our optimized API integration and smart caching.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🌍</span>
            </div>
            <h3 className="font-display font-semibold text-lg text-gray-900 mb-2">
              Global Reach
            </h3>
            <p className="text-gray-600 text-sm">
              Support for 15+ languages including Hindi, Marathi, Tamil, Telugu, and more.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="font-display font-semibold text-lg text-gray-900 mb-2">
              Precise Results
            </h3>
            <p className="text-gray-600 text-sm">
              Advanced algorithms ensure contextually accurate translations every time.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TranslatorPage;