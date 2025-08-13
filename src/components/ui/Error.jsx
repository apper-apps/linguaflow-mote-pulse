import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  showRetry = true 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
        <ApperIcon name="AlertCircle" className="w-8 h-8 text-error" />
      </div>
      
      <div className="space-y-2">
        <h3 className="font-display font-semibold text-lg text-gray-900">
          Oops! Something went wrong
        </h3>
        <p className="text-gray-600 text-sm max-w-sm">
          {message}
        </p>
      </div>

      {showRetry && onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="md"
          className="mt-4"
        >
          <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;