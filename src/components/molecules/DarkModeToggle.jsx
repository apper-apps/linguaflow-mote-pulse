import { useTheme } from '@/contexts/ThemeContext';
import { ApperIcon } from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const DarkModeToggle = ({ className = "" }) => {
  const { isDarkMode, toggleTheme, isLoading } = useTheme();

  if (isLoading) {
    return (
      <div className={cn(
        "w-14 h-7 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse",
        className
      )} />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative w-14 h-7 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50",
        isDarkMode 
          ? "bg-gradient-to-r from-indigo-500 to-purple-600" 
          : "bg-gradient-to-r from-gray-200 to-gray-300",
        className
      )}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      aria-pressed={isDarkMode}
    >
      {/* Toggle circle */}
      <div
        className={cn(
          "absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center",
          isDarkMode ? "translate-x-7" : "translate-x-0.5"
        )}
      >
        {/* Icon */}
        <ApperIcon
          name={isDarkMode ? "Moon" : "Sun"}
          size={14}
          className={cn(
            "transition-all duration-300",
            isDarkMode ? "text-indigo-600" : "text-yellow-500"
          )}
        />
      </div>
    </button>
  );
};

export default DarkModeToggle;