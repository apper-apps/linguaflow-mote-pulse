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
  },

  detectLanguage: async (text) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (!text || text.trim().length < 3) return null;
    
    const cleanText = text.toLowerCase().trim();
    
    // Simple pattern-based detection for common languages
    const patterns = {
      'hi': /[\u0900-\u097F]|(?:है|हैं|और|का|की|के|में|से|को|पर|या|यह|वह|एक|दो)/,
      'mr': /[\u0900-\u097F]|(?:आहे|आहेत|आणि|चा|ची|चे|मध्ये|पासून|ला|वर|किंवा|हा|तो|एक|दोन)/,
      'ta': /[\u0B80-\u0BFF]|(?:இருக்கிறது|உள்ளது|மற்றும்|ஒரு|இரண்டு|என்று|இது|அது)/,
      'te': /[\u0C00-\u0C7F]|(?:ఉంది|ఉన్నాయి|మరియు|ఒక|రెండు|అని|ఇది|అది)/,
      'ur': /[\u0600-\u06FF]|(?:ہے|ہیں|اور|کا|کی|کے|میں|سے|کو|پر|یا|یہ|وہ|ایک|دو)/,
      'ar': /[\u0600-\u06FF]|(?:هو|هي|في|من|إلى|على|أو|هذا|ذلك|واحد|اثنان)/,
      'fr': /(?:le|la|les|un|une|des|et|ou|est|sont|dans|pour|avec|sur|par|de|du|ce|cette|il|elle)/,
      'es': /(?:el|la|los|las|un|una|y|o|es|son|en|para|con|por|de|del|este|esta|él|ella)/,
      'de': /(?:der|die|das|ein|eine|und|oder|ist|sind|in|für|mit|auf|von|dem|dieser|diese|er|sie)/,
      'pt': /(?:o|a|os|as|um|uma|e|ou|é|são|em|para|com|por|de|do|este|esta|ele|ela)/,
      'it': /(?:il|la|lo|gli|le|un|una|e|o|è|sono|in|per|con|su|di|del|questo|questa|lui|lei)/,
      'ru': /[\u0400-\u04FF]|(?:это|что|как|где|когда|почему|кто|или|но|если|так|да|нет)/,
      'zh': /[\u4e00-\u9fff]|(?:这|那|是|的|和|或|在|有|了|会|能|要|不|很|也|都)/,
      'ja': /[\u3040-\u309F\u30A0-\u30FF\u4e00-\u9fff]|(?:です|である|ます|った|この|その|あの|どの)/,
      'ko': /[\uAC00-\uD7AF]|(?:이다|있다|없다|하다|되다|오다|가다|보다|주다|받다|먹다|마시다)/
    };
    
    for (const [code, pattern] of Object.entries(patterns)) {
      if (pattern.test(cleanText)) {
        return languagesData.find(lang => lang.code === code) || null;
      }
    }
    
    // Default to English if no pattern matches
    return languagesData.find(lang => lang.code === 'en');
  }
};