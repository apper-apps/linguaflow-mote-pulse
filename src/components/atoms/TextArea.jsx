import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const TextArea = forwardRef(({
  variant = "default",
  size = "md",
  error = false,
  resize = "vertical",
  className = "",
  ...props
}, ref) => {
  const baseStyles = "w-full rounded-xl border font-body transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50";
  
  const variants = {
    default: error 
      ? "border-error bg-red-50 text-gray-900 placeholder-red-400 focus:border-error focus:ring-error/20"
      : "border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-primary/20 hover:border-gray-300",
    filled: error
      ? "border-error bg-red-50 text-gray-900 placeholder-red-400 focus:border-error focus:ring-error/20"
      : "border-transparent bg-gray-100 text-gray-900 placeholder-gray-500 focus:bg-white focus:border-primary focus:ring-primary/20 hover:bg-gray-50"
  };

  const sizes = {
    sm: "px-3 py-2 text-sm min-h-[80px]",
    md: "px-4 py-3 text-sm min-h-[120px]",
    lg: "px-5 py-4 text-base min-h-[160px]"
  };

  const resizeClasses = {
    none: "resize-none",
    vertical: "resize-y",
    horizontal: "resize-x",
    both: "resize"
  };

  return (
    <textarea
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], resizeClasses[resize], className)}
      {...props}
    />
  );
});

TextArea.displayName = "TextArea";

export default TextArea;