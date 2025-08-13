import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import CopyButton from "@/components/molecules/CopyButton";
import translationService from "@/services/api/translationService";
import languageService from "@/services/api/languageService";

const TranslationHistory = ({ refreshTrigger }) => {
  const [translations, setTranslations] = useState([]);
  const [languages, setLanguages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [historyData, languageData] = await Promise.all([
        translationService.getRecentTranslations(10),
        languageService.getAll()
      ]);
      
      setTranslations(historyData);
      
      // Create language lookup map
      const langMap = {};
      languageData.forEach(lang => {
        langMap[lang.code] = lang;
      });
      setLanguages(langMap);
    } catch (err) {
      setError(err.message || "Failed to load translation history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [refreshTrigger]);

  const handleClearHistory = async () => {
    try {
      await translationService.clearHistory();
      setTranslations([]);
      toast.success("Translation history cleared");
    } catch (err) {
      toast.error("Failed to clear history");
    }
  };

  const handleDeleteTranslation = async (id) => {
    try {
      await translationService.delete(id);
      setTranslations(prev => prev.filter(t => t.Id !== id));
      toast.success("Translation removed from history");
    } catch (err) {
      toast.error("Failed to delete translation");
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 h-fit"
      >
        <div className="p-6">
          <Loading text="Loading history..." />
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 h-fit"
      >
        <div className="p-6">
          <Error message={error} onRetry={loadHistory} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 h-fit"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center">
            <ApperIcon name="History" className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg text-gray-900">
              Recent Translations
            </h2>
            <p className="text-sm text-gray-500">
              {translations.length} {translations.length === 1 ? "item" : "items"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {translations.length > 0 && (
            <Button
              onClick={handleClearHistory}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-error"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </Button>
          )}
          
          <Button
            onClick={() => setIsCollapsed(!isCollapsed)}
            variant="ghost"
            size="sm"
            className="text-gray-500"
          >
            <ApperIcon 
              name={isCollapsed ? "ChevronDown" : "ChevronUp"} 
              className="w-4 h-4" 
            />
          </Button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="max-h-[600px] overflow-y-auto history-scroll">
              {translations.length === 0 ? (
                <div className="p-6">
                  <Empty
                    title="No translations yet"
                    description="Your recent translations will appear here."
                    icon="Languages"
                  />
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {translations.map((translation, index) => (
                    <motion.div
                      key={translation.Id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100 hover:border-gray-200 transition-all duration-200"
                    >
                      {/* Language Pair */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2 text-xs font-medium">
                          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            {languages[translation.sourceLang]?.flag} {languages[translation.sourceLang]?.name}
                          </span>
                          <ApperIcon name="ArrowRight" className="w-3 h-3 text-gray-400" />
                          <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                            {languages[translation.targetLang]?.flag} {languages[translation.targetLang]?.name}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <CopyButton 
                            text={translation.translatedText}
                            variant="ghost"
                            size="sm"
                          />
                          <Button
                            onClick={() => handleDeleteTranslation(translation.Id)}
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-error"
                          >
                            <ApperIcon name="X" className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Source Text */}
                      <div className="space-y-2">
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {translation.sourceText}
                        </p>
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                        <p className="text-sm text-gray-900 font-medium line-clamp-2">
                          {translation.translatedText}
                        </p>
                      </div>
                      
                      {/* Metadata */}
                      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                        <span>
                          {translation.charCount} characters
                        </span>
                        <span>
                          {formatDistanceToNow(new Date(translation.timestamp), { addSuffix: true })}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TranslationHistory;