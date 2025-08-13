import languagesData from "@/services/mockData/languages.json";

const languageService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...languagesData];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const language = languagesData.find(lang => lang.Id === parseInt(id));
    return language ? { ...language } : null;
  },

  getByCode: async (code) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const language = languagesData.find(lang => lang.code === code);
    return language ? { ...language } : null;
  },

  getPopularLanguages: async () => {
    await new Promise(resolve => setTimeout(resolve, 250));
    const popularCodes = ["en", "hi", "es", "fr", "de", "zh"];
    return languagesData.filter(lang => popularCodes.includes(lang.code));
  },

  searchLanguages: async (query) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const lowerQuery = query.toLowerCase();
    return languagesData.filter(lang => 
      lang.name.toLowerCase().includes(lowerQuery) ||
      lang.nativeName.toLowerCase().includes(lowerQuery) ||
      lang.code.toLowerCase().includes(lowerQuery)
    );
  }
};

export default languageService;