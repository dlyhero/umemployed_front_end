import { ArrowLeft } from "lucide-react";

export const MessageDetail = ({ message, onBack }) => {
    if (!message) return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-6">
          <h3 className="text-lg text-gray-500">
            Select a message to view
          </h3>
        </div>
      </div>
    );
  
    return (
      <div className="flex flex-col h-full">
        <div className="border-b p-4">
          {onBack && (
            <button onClick={onBack} className="md:hidden mr-2">
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <h2 className="text-xl font-bold">{message.subject}</h2>
          <div className="flex items-center mt-2">
            <span className="font-medium text-sm">From: {message.sender}</span>
            <span className="text-xs text-gray-500 ml-auto">
              {new Date(message.date).toLocaleString()}
            </span>
          </div>
        </div>
        <div className="flex-1 p-6 overflow-y-auto">
          <p className="whitespace-pre-line">{message.content}</p>
        </div>
      </div>
    );
  };