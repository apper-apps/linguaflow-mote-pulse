import settingsData from "@/services/mockData/settings.json";

let settings = { ...settingsData };

const settingsService = {
  get: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { ...settings };
  },

  update: async (newSettings) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    settings = { ...settings, ...newSettings };
    return { ...settings };
  },

  reset: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    settings = { ...settingsData };
    return { ...settings };
  },

  updateSetting: async (key, value) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    settings[key] = value;
    return { ...settings };
  }
};

export default settingsService;