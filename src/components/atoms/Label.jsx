import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Label = forwardRef(({
  variant = "default",
  size = "md",
  required = false,
  className = "",
  children,
  ...props
}, ref) => {
  const baseStyles = "font-body font-medium text-gray-900 select-none";
  
  const variants = {
    default: "text-gray-900",
    muted: "text-gray-600",
    error: "text-error"
  };

  const sizes = {
    sm: "text-sm",
    md: "text-sm",
    lg: "text-base"
  };

  return (
    <label
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
      {required && <span className="text-error ml-1">*</span>}
    </label>
  );
});

Label.displayName = "Label";

export default Label;