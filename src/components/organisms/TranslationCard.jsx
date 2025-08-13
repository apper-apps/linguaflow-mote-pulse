import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import TextArea from "@/components/atoms/TextArea";
import Button from "@/components/atoms/Button";
import Label from "@/components/atoms/Label";
import ApperIcon from "@/components/ApperIcon";
import LanguageSelect from "@/components/molecules/LanguageSelect";
import CharacterCounter from "@/components/molecules/CharacterCounter";
import CopyButton from "@/components/molecules/CopyButton";
import SwapButton from "@/components/molecules/SwapButton";
import translationService from "@/services/api/translationService";

const TranslationCard = ({ onTranslationComplete }) => {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("hi");
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState("");

  const maxCharacters = 5000;
  const charCount = sourceText.length;

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast.error("Please enter text to translate");
      return;
    }

    if (sourceLang === targetLang) {
      toast.error("Please select different source and target languages");
      return;
    }

    if (charCount > maxCharacters) {
      toast.error(`Text exceeds maximum length of ${maxCharacters} characters`);
      return;
    }

    try {
      setIsTranslating(true);
      setError("");
      
      const result = await translationService.translate(
        sourceText.trim(),
        sourceLang,
        targetLang
      );
      
      setTranslatedText(result.translatedText);
      
      // Save to history
      await translationService.create({
        sourceText: sourceText.trim(),
        translatedText: result.translatedText,
        sourceLang,
        targetLang,
        charCount
      });

      if (onTranslationComplete) {
        onTranslationComplete(result);
      }

      toast.success("Translation completed!");
    } catch (err) {
      setError(err.message || "Translation failed. Please try again.");
      toast.error(err.message || "Translation failed");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSwapLanguages = () => {
    const tempLang = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(tempLang);
    
    // Also swap the text content
    if (translatedText) {
      setSourceText(translatedText);
      setTranslatedText(sourceText);
    }
    
    toast.info("Languages swapped!");
  };

  const clearSourceText = () => {
    setSourceText("");
    setTranslatedText("");
    setError("");
  };

  const clearTranslatedText = () => {
    setTranslatedText("");
  };

  // Auto-translate when source text changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (sourceText.trim() && sourceLang !== targetLang && !isTranslating) {
        // Auto-translate for demo purposes - can be made optional
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [sourceText, sourceLang, targetLang, isTranslating]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-main px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <ApperIcon name="Languages" className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-white">
              LinguaFlow
            </h1>
            <p className="text-white/80 text-sm">
              Instant multi-language translation
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Language Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <LanguageSelect
            label="From"
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            placeholder="Source language"
            excludeCode={targetLang}
          />
          
          <div className="flex justify-center">
            <SwapButton
              onSwap={handleSwapLanguages}
              disabled={isTranslating}
            />
          </div>

          <LanguageSelect
            label="To"
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            placeholder="Target language"
            excludeCode={sourceLang}
          />
        </div>

        {/* Source Text Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Enter text to translate</Label>
            <div className="flex items-center space-x-2">
              <CharacterCounter 
                count={charCount}
                maxCount={maxCharacters}
              />
              {sourceText && (
                <Button
                  onClick={clearSourceText}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-error"
                >
                  <ApperIcon name="X" className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
          
          <TextArea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Type or paste your text here..."
            size="lg"
            error={!!error}
            className="min-h-[120px]"
            disabled={isTranslating}
          />
        </div>

        {/* Translate Button */}
        <Button
          onClick={handleTranslate}
          variant="primary"
          size="lg"
          disabled={!sourceText.trim() || isTranslating || sourceLang === targetLang}
          className="w-full relative overflow-hidden"
        >
          {isTranslating ? (
            <>
              <ApperIcon name="Loader2" className="w-5 h-5 mr-2 animate-spin" />
              Translating...
            </>
          ) : (
            <>
              <ApperIcon name="ArrowRight" className="w-5 h-5 mr-2" />
              Translate
            </>
          )}
        </Button>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4"
          >
            <div className="flex items-center space-x-2">
              <ApperIcon name="AlertCircle" className="w-5 h-5 text-error flex-shrink-0" />
              <span className="text-error text-sm font-medium">{error}</span>
            </div>
          </motion.div>
        )}

        {/* Translated Text Output */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Translation</Label>
            <div className="flex items-center space-x-2">
              {translatedText && (
                <>
                  <CopyButton 
                    text={translatedText}
                    showLabel={true}
                    variant="ghost"
                  />
                  <Button
                    onClick={clearTranslatedText}
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-error"
                  >
                    <ApperIcon name="X" className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
          
          <TextArea
            value={translatedText}
            readOnly
            placeholder="Translated text will appear here..."
            size="lg"
            className="min-h-[120px] bg-gray-50 cursor-default"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default TranslationCard;