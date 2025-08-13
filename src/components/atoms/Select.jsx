import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Select = forwardRef(({
  variant = "default",
  size = "md",
  error = false,
  placeholder = "Select an option",
  children,
  className = "",
  ...props
}, ref) => {
  const baseStyles = "w-full rounded-xl border font-body transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 appearance-none bg-no-repeat bg-right pr-10";
  
  const variants = {
    default: error 
      ? "border-error bg-red-50 text-gray-900 focus:border-error focus:ring-error/20"
      : "border-gray-200 bg-white text-gray-900 focus:border-primary focus:ring-primary/20 hover:border-gray-300",
    filled: error
      ? "border-error bg-red-50 text-gray-900 focus:border-error focus:ring-error/20"
      : "border-transparent bg-gray-100 text-gray-900 focus:bg-white focus:border-primary focus:ring-primary/20 hover:bg-gray-50"
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-sm",
    lg: "px-5 py-4 text-base"
  };

  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <ApperIcon name="ChevronDown" className="w-4 h-4 text-gray-400" />
      </div>
    </div>
  );
});

Select.displayName = "Select";

export default Select;