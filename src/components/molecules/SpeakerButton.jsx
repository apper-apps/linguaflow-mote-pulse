import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const SpeakerButton = ({ 
  text, 
  showLabel = false, 
  variant = "ghost", 
  size = "sm",
  className = "" 
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const speechRef = useRef(null);
  const timeoutRef = useRef(null);

  // Check if speech synthesis is supported
  const isSpeechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    if (!isSpeechSupported) return;

    const handleSpeechEnd = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setShowVolumeControl(false);
      speechRef.current = null;
    };

    const handleSpeechError = (event) => {
      console.error('Speech synthesis error:', event.error);
      toast.error('Speech synthesis error occurred');
      handleSpeechEnd();
    };

    // Cleanup on component unmount
    return () => {
      if (speechRef.current) {
        window.speechSynthesis.cancel();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isSpeechSupported]);

  const handleSpeak = () => {
    if (!isSpeechSupported) {
      toast.error('Speech synthesis is not supported in this browser');
      return;
    }

    if (!text || text.trim() === '') {
      toast.warning('No text to speak');
      return;
    }

    try {
      // If currently speaking, pause/resume
      if (isSpeaking) {
        if (isPaused) {
          window.speechSynthesis.resume();
          setIsPaused(false);
          toast.info('Speech resumed');
        } else {
          window.speechSynthesis.pause();
          setIsPaused(true);
          toast.info('Speech paused');
        }
        return;
      }

      // Cancel any existing speech
      window.speechSynthesis.cancel();

      // Create new speech utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = volume;
      utterance.rate = 0.9; // Slightly slower for better comprehension
      utterance.pitch = 1;

      // Set up event listeners
      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
        setShowVolumeControl(true);
        toast.success('Starting speech');
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        setShowVolumeControl(false);
        speechRef.current = null;
        toast.info('Speech completed');
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        toast.error('Speech synthesis error occurred');
        setIsSpeaking(false);
        setIsPaused(false);
        setShowVolumeControl(false);
        speechRef.current = null;
      };

      utterance.onpause = () => {
        setIsPaused(true);
      };

      utterance.onresume = () => {
        setIsPaused(false);
      };

      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);

    } catch (error) {
      console.error('Error starting speech synthesis:', error);
      toast.error('Failed to start speech synthesis');
    }
  };

  const handleStop = () => {
    if (window.speechSynthesis && speechRef.current) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      setShowVolumeControl(false);
      speechRef.current = null;
      toast.info('Speech stopped');
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    // Apply volume to current speech if active
    if (speechRef.current && isSpeaking) {
      speechRef.current.volume = newVolume;
    }
  };

  const hideVolumeControl = () => {
    if (!isSpeaking) {
      // Delay hiding to allow for interaction
      timeoutRef.current = setTimeout(() => {
        setShowVolumeControl(false);
      }, 2000);
    }
  };

  const showVolumeControlHandler = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowVolumeControl(true);
  };

  if (!isSpeechSupported) {
    return null; // Don't render if not supported
  }

  return (
    <div className="relative flex items-center space-x-2">
      <div className="flex items-center space-x-1">
        <Button
          onClick={handleSpeak}
          variant={variant}
          size={size}
          className={cn(
            "text-gray-500 hover:text-primary transition-colors",
            isSpeaking && !isPaused && "text-primary animate-pulse",
            isPaused && "text-warning",
            className
          )}
          onMouseEnter={showVolumeControlHandler}
          onMouseLeave={hideVolumeControl}
        >
          <ApperIcon 
            name={
              isSpeaking && !isPaused 
                ? "Pause" 
                : isPaused 
                  ? "Play" 
                  : "Volume2"
            } 
            className="w-4 h-4" 
          />
          {showLabel && (
            <span className="ml-1">
              {isSpeaking && !isPaused 
                ? "Pause" 
                : isPaused 
                  ? "Resume" 
                  : "Speak"
              }
            </span>
          )}
        </Button>

        {isSpeaking && (
          <Button
            onClick={handleStop}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-error"
          >
            <ApperIcon name="Square" className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Volume Control */}
      {showVolumeControl && (
        <div 
          className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50 min-w-[200px]"
          onMouseEnter={() => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
          }}
          onMouseLeave={hideVolumeControl}
        >
          <div className="flex items-center space-x-2">
            <ApperIcon name="VolumeX" className="w-4 h-4 text-gray-400" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <ApperIcon name="Volume2" className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-xs text-gray-500 text-center mt-1">
            Volume: {Math.round(volume * 100)}%
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeakerButton;