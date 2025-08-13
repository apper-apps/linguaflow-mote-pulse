import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import CharacterCounter from "@/components/molecules/CharacterCounter";
import SwapButton from "@/components/molecules/SwapButton";
import CopyButton from "@/components/molecules/CopyButton";
import SpeakerButton from "@/components/molecules/SpeakerButton";
import LanguageSelect from "@/components/molecules/LanguageSelect";
import Button from "@/components/atoms/Button";
import Label from "@/components/atoms/Label";
import TextArea from "@/components/atoms/TextArea";
import translationService from "@/services/api/translationService";
import languageService from '@/services/api/languageService';
const TranslationCard = ({ onTranslationComplete }) => {
const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("hi");
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState("");
const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [detectedLanguage, setDetectedLanguage] = useState(null);

  // Language detection effect
  useEffect(() => {
    let timeoutId;

    const detectLanguage = async () => {
      if (sourceText && sourceText.trim().length >= 3) {
        try {
          const detected = await languageService.detectLanguage(sourceText);
          setDetectedLanguage(detected);
        } catch (error) {
          console.error('Language detection failed:', error);
          setDetectedLanguage(null);
        }
      } else {
        setDetectedLanguage(null);
      }
    };

    // Debounce language detection
    if (sourceText) {
      timeoutId = setTimeout(detectLanguage, 500);
    } else {
      setDetectedLanguage(null);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [sourceText]);
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
// Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = sourceLang;
      
      recognitionInstance.onstart = () => {
        setIsRecording(true);
        toast.info("Listening... Please speak now");
      };
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSourceText(prev => prev ? `${prev} ${transcript}` : transcript);
        toast.success("Voice input captured successfully");
      };
      
      recognitionInstance.onerror = (event) => {
        setIsRecording(false);
        if (event.error === 'not-allowed') {
          toast.error("Microphone access denied. Please enable microphone permissions.");
        } else if (event.error === 'no-speech') {
          toast.warning("No speech detected. Please try again.");
        } else {
          toast.error(`Speech recognition error: ${event.error}`);
        }
      };
      
      recognitionInstance.onend = () => {
        setIsRecording(false);
      };
      
setRecognition(recognitionInstance);
    }

    // Cleanup previous recognition when language changes
    return () => {
      if (recognition) {
        try {
          if (recognition.state !== 'inactive') {
            recognition.stop();
          }
          recognition.onresult = null;
          recognition.onerror = null;
          recognition.onend = null;
        } catch (error) {
          console.warn('Error cleaning up speech recognition:', error);
        }
      }
    };
  }, [sourceLang]);

  // Cleanup recognition on component unmount
  useEffect(() => {
    return () => {
      if (recognition) {
        try {
          if (recognition.state !== 'inactive') {
            recognition.stop();
          }
          recognition.onresult = null;
          recognition.onerror = null;
          recognition.onend = null;
        } catch (error) {
          console.warn('Error cleaning up speech recognition on unmount:', error);
        }
      }
    };
  }, [recognition]);

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
<div className="flex items-center justify-between">
              <CharacterCounter 
                count={charCount}
                maxCount={maxCharacters}
              />
              <div className="flex items-center space-x-2">
                {/* Voice Input Button */}
                {recognition && (
                  <Button
                    onClick={() => {
                      if (isRecording) {
                        recognition.stop();
                      } else {
                        recognition.start();
                      }
                    }}
                    variant="ghost"
                    size="sm"
                    disabled={isTranslating}
                    className={`text-gray-500 hover:text-primary transition-all duration-200 ${
                      isRecording ? 'voice-recording text-primary' : ''
                    }`}
                    title={isRecording ? "Stop recording" : "Start voice input"}
                  >
                    <ApperIcon 
                      name={isRecording ? "MicOff" : "Mic"} 
                      className={`w-4 h-4 ${isRecording ? 'animate-pulse' : ''}`} 
                    />
                  </Button>
                )}
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
          </div>
{/* Language Detection Indicator */}
          {detectedLanguage && sourceText.trim() && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center space-x-2 mb-3 px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{detectedLanguage.flag}</span>
                <span className="text-sm font-medium text-blue-700">
                  Detected: {detectedLanguage.name}
                </span>
                <ApperIcon name="Eye" size={14} className="text-blue-500" />
              </div>
            </motion.div>
          )}

          <TextArea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Type, paste, or use voice input..."
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
                  <SpeakerButton
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