import { useState } from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const SwapButton = ({ onSwap, disabled = false, className = "" }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSwap = () => {
    if (disabled || isAnimating) return;
    
    setIsAnimating(true);
    onSwap();
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  return (
    <Button
      onClick={handleSwap}
      variant="ghost"
      size="md"
      disabled={disabled}
      className={`p-3 rounded-full border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all duration-200 ${className}`}
    >
      <ApperIcon 
        name="ArrowUpDown" 
        className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${
          isAnimating ? "rotate-180" : ""
        }`} 
      />
    </Button>
  );
};

export default SwapButton;