import { useState } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const CopyButton = ({ 
  text, 
  variant = "ghost", 
  size = "sm",
  className = "",
  showLabel = false 
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text || !text.trim()) {
      toast.error("No text to copy");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Text copied to clipboard!");
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
      toast.error("Failed to copy text");
    }
  };

  return (
    <Button
      onClick={handleCopy}
      variant={variant}
      size={size}
      className={`transition-all duration-200 ${className}`}
      disabled={!text || !text.trim()}
    >
      <ApperIcon 
        name={copied ? "Check" : "Copy"} 
        className={`w-4 h-4 ${copied ? "text-success" : ""} ${showLabel ? "mr-2" : ""}`} 
      />
      {showLabel && (copied ? "Copied!" : "Copy")}
    </Button>
  );
};

export default CopyButton;