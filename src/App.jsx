import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@/contexts/ThemeContext";
import React from "react";
import TranslatorPage from "@/components/pages/TranslatorPage";
import languages from "@/services/mockData/languages.json";
import settings from "@/services/mockData/settings.json";
import translations from "@/services/mockData/translations.json";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 transition-theme">
        <Routes>
          <Route path="/" element={<TranslatorPage />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
theme="colored"
        />
        </div>
</BrowserRouter>
    </ThemeProvider>
  );
}

export default App;