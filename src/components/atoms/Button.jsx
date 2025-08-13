import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "md", 
  disabled = false,
  className = "",
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-button text-white hover:shadow-lg hover:shadow-primary/25 focus:ring-primary/50 hover:scale-[1.02]",
    secondary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 focus:ring-gray-300 hover:scale-[1.01]",
    outline: "bg-transparent text-primary border border-primary hover:bg-primary hover:text-white focus:ring-primary/50 hover:scale-[1.01]",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300 hover:scale-[1.01]",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:shadow-lg hover:shadow-error/25 focus:ring-error/50 hover:scale-[1.02]",
    success: "bg-gradient-to-r from-success to-emerald-600 text-white hover:shadow-lg hover:shadow-success/25 focus:ring-success/50 hover:scale-[1.02]"
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  };

  return (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;