import { MessageComposer } from "./MessageComposer";
import { MessageDetail } from "./MessageDetails";
import { MessageList } from "./MessageList";


export const MessagesLayout = ({ 
  messages, 
  selectedMessage, 
  onSelect, 
  onDelete, 
  onSend 
}) => {
  return (
    <div className="flex flex-col h-full bg-gray-50 container mx-auto">
      <header className="bg-blue-500 text-white p-4">
        <h1 className="text-2xl font-bold">Messages</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop View */}
        <div className="hidden md:flex w-1/3 border-r bg-white">
          <MessageList 
            messages={messages}
            selectedId={selectedMessage?.id}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        </div>
        
        <div className="hidden md:flex flex-col flex-1 bg-white">
          <MessageDetail message={selectedMessage} />
          {selectedMessage && <MessageComposer onSend={onSend} />}
        </div>

        {/* Mobile View */}
        <div className="md:hidden w-full">
          {selectedMessage ? (
            <>
              <MessageDetail
                message={selectedMessage} 
                onBack={() => onSelect(null)} 
              />
              <MessageComposer onSend={onSend} />
            </>
          ) : (
            <MessageList 
              messages={messages}
              selectedId={null}
              onSelect={onSelect}
              onDelete={onDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
};