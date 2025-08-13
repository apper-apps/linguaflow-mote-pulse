import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data available",
  description = "There's nothing to show right now.",
  actionLabel,
  onAction,
  icon = "FileText"
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
        <ApperIcon name={icon} className="w-8 h-8 text-gray-400" />
      </div>
      
      <div className="space-y-2">
        <h3 className="font-display font-semibold text-lg text-gray-900">
          {title}
        </h3>
        <p className="text-gray-600 text-sm max-w-sm">
          {description}
        </p>
      </div>

      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          variant="primary"
          size="md"
          className="mt-4"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;