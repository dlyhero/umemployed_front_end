import { Send } from "lucide-react";
import { useState } from "react";

export const MessageComposer = ({ onSend }) => {
    const [message, setMessage] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (message.trim()) {
        onSend(message);
        setMessage('');
      }
    };
  
    return (
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border rounded-full px-4 py-2"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="p-2 bg-blue-500 text-white rounded-full"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    );
  };