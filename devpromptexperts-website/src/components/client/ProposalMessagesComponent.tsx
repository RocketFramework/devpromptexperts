import { useState, useEffect, useRef } from 'react';
import { ProposalCommunicationsService } from '@/services/generated';
import { HiPaperAirplane, HiUser } from 'react-icons/hi';
import { ProposalCommunicationsWithSender } from '@/services/generated';

interface ProposalMessagesComponentProps {
  responseId: string;
  currentUserId: string; // We'll need to pass this down
  currentUserType: 'client' | 'consultant';
}

export default function ProposalMessagesComponent({
  responseId,
  currentUserId,
  currentUserType
}: ProposalMessagesComponentProps) {
  const [messages, setMessages] = useState<ProposalCommunicationsWithSender[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
    // In a real app, we'd set up a realtime subscription here
  }, [responseId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const data = await ProposalCommunicationsService.findByResponseIdWithSender(responseId);
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setIsSending(true);
      const message = await ProposalCommunicationsService.create({
        project_response_id: responseId,
        sender_id: currentUserId,
        message: newMessage,
        sender_type: currentUserType,
      });
      
      // Optimistically update UI
      setMessages([...messages, { ...message, sender: { full_name: 'You' } }]); // Simplified for now
      setNewMessage('');
      
      // Reload to get full details (like sender info if needed)
      loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4 text-gray-500">Loading messages...</div>;
  }

  return (
    <div className="flex flex-col h-[500px] bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === currentUserId;
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    isMe
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {!isMe && (
                      <span className="text-xs font-medium opacity-75">
                        {msg.sender?.full_name || 'User'}
                      </span>
                    )}
                    <span className={`text-xs ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                      {new Date(msg.created_at??'').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={isSending || !newMessage.trim()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <HiPaperAirplane className="h-5 w-5 rotate-90" />
          </button>
        </form>
      </div>
    </div>
  );
}
