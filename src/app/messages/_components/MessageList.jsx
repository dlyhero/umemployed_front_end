import { MessageCard } from './MessageCard';

export const MessageList = ({ 
  messages, 
  selectedId, 
  onSelect, 
  onDelete 
}) => {
  return (
    <div className="divide-y">
      {messages.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          No messages yet
        </div>
      ) : (
        messages.map((message) => (
          <MessageCard
            key={message.id}
            message={message}
            isSelected={selectedId === message.id}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
};