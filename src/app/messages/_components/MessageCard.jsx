import { Mail, Trash2 } from "lucide-react";

export const MessageCard = ({ 
    message, 
    isSelected, 
    onSelect, 
    onDelete 
  }) => {
    const { id, sender, subject, content, date, read, category } = message;
  
    const getCategoryIcon = () => {
      switch (category) {
        case 'interview': return <Star className="text-yellow-500" />;
        case 'opportunity': return <Mail className="text-blue-500" />;
        default: return <Mail className="text-gray-400" />;
      }
    };
  
    return (
      <div 
        className={`p-4 hover:bg-gray-50 cursor-pointer ${
          isSelected ? 'bg-blue-50' : ''
        } ${!read ? 'font-semibold' : ''}`}
        onClick={() => onSelect(message)}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {getCategoryIcon()}
            <h3 className="text-sm">{sender}</h3>
          </div>
          <span className="text-xs text-gray-400">
            {new Date(date).toLocaleDateString()}
          </span>
        </div>
        <p className="text-sm mt-1">{subject}</p>
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500 truncate">
            {content.substring(0, 60)}...
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
            className="text-gray-400 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };