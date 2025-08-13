const CharacterCounter = ({ 
  count = 0, 
  maxCount = 5000, 
  className = "" 
}) => {
  const percentage = (count / maxCount) * 100;
  const isNearLimit = percentage >= 80;
  const isOverLimit = count > maxCount;

  return (
    <div className={`flex items-center space-x-2 text-sm ${className}`}>
      <span className={`font-medium ${
        isOverLimit ? "text-error" : 
        isNearLimit ? "text-warning" : 
        "text-gray-600"
      }`}>
        {count.toLocaleString()}
      </span>
      <span className="text-gray-400">/</span>
      <span className="text-gray-500">
        {maxCount.toLocaleString()}
      </span>
      
      {/* Progress bar */}
      <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-200 ${
            isOverLimit ? "bg-error" :
            isNearLimit ? "bg-warning" :
            "bg-gradient-to-r from-primary to-secondary"
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default CharacterCounter;