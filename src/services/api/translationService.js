import translationsData from "@/services/mockData/translations.json";

let translations = [...translationsData];

const translationService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...translations];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const translation = translations.find(trans => trans.Id === parseInt(id));
    return translation ? { ...translation } : null;
  },

  create: async (translationData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = translations.length > 0 ? Math.max(...translations.map(t => t.Id)) + 1 : 1;
    const newTranslation = {
      Id: newId,
      timestamp: Date.now(),
      ...translationData
    };
    translations.push(newTranslation);
    return { ...newTranslation };
  },

  translate: async (sourceText, sourceLang, targetLang) => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay

    try {
      // Mock translation responses for demonstration
      const mockTranslations = {
        "hello|en|hi": "नमस्ते",
        "hello|en|es": "Hola",
        "hello|en|fr": "Bonjour",
        "good morning|en|hi": "सुप्रभात",
        "good morning|en|es": "Buenos días",
        "good morning|en|fr": "Bonjour",
        "thank you|en|hi": "धन्यवाद",
        "thank you|en|es": "Gracias",
        "thank you|en|fr": "Merci",
        "how are you|en|hi": "आप कैसे हैं",
        "how are you|en|es": "¿Cómo estás?",
        "how are you|en|fr": "Comment allez-vous?",
        "welcome|en|hi": "स्वागत है",
        "welcome|en|es": "Bienvenido",
        "welcome|en|fr": "Bienvenue"
      };

      const key = `${sourceText.toLowerCase()}|${sourceLang}|${targetLang}`;
      const mockResult = mockTranslations[key];

      if (mockResult) {
        return {
          translatedText: mockResult,
          sourceText,
          sourceLang,
          targetLang,
          charCount: sourceText.length
        };
      }

      // For other text, return a simulated translation
      const simulatedTranslation = `[${targetLang.toUpperCase()}] ${sourceText}`;
      
      return {
        translatedText: simulatedTranslation,
        sourceText,
        sourceLang,
        targetLang,
        charCount: sourceText.length
      };
    } catch (error) {
      throw new Error("Translation failed. Please try again.");
    }
  },

  getRecentTranslations: async (limit = 10) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    return [...translations]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = translations.findIndex(trans => trans.Id === parseInt(id));
    if (index > -1) {
      const deleted = translations.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  },

  clearHistory: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    translations = [];
    return true;
  }
};

export default translationService;