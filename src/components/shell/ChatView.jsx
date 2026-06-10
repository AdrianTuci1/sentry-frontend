import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { Send, Plus, Trash2, MessageSquare, X } from 'lucide-react';

export function ChatView() {
  const {
    chatSessions,
    activeChatId,
    isChatPanelOpen,
    createChatSession,
    selectChat,
    deleteChatSession,
    addMessage,
  } = useAppStore();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const activeChat = chatSessions.find((c) => c.id === activeChatId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    if (!activeChatId) {
      createChatSession(input.trim().slice(0, 30));
    }
    addMessage(activeChatId || chatSessions[chatSessions.length - 1]?.id, {
      role: 'user',
      content: input.trim(),
    });
    setInput('');

    // Simulate response
    setTimeout(() => {
      addMessage(activeChatId || chatSessions[chatSessions.length - 1]?.id, {
        role: 'assistant',
        content: 'I received your message. This is a placeholder response.',
      });
    }, 1000);
  };

  return (
    <div className="h-full flex">
      {/* Sessions Sidebar */}
      {isChatPanelOpen && (
        <div className="w-60 border-r border-border bg-bg-secondary flex flex-col shrink-0">
          <div className="h-12 border-b border-border flex items-center justify-between px-3">
            <span className="text-sm font-medium text-text-primary">Chat Sessions</span>
            <button
              onClick={() => createChatSession()}
              className="p-1.5 rounded-md hover:bg-bg-hover text-text-muted transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-2">
            {chatSessions.length === 0 ? (
              <div className="px-3 py-8 text-center">
                <MessageSquare size={24} className="text-text-muted mx-auto mb-2" />
                <div className="text-xs text-text-muted">No sessions yet</div>
                <button
                  onClick={() => createChatSession()}
                  className="mt-3 text-xs text-accent hover:text-accent-hover"
                >
                  Start new chat
                </button>
              </div>
            ) : (
              chatSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => selectChat(session.id)}
                  className={`mx-2 px-3 py-2 rounded-md cursor-pointer group flex items-center justify-between ${
                    session.id === activeChatId
                      ? 'bg-bg-hover text-accent'
                      : 'text-text-secondary hover:bg-bg-hover'
                  }`}
                >
                  <div className="truncate text-sm">{session.title}</div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChatSession(session.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-bg-tertiary text-text-muted transition-opacity"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-bg-primary">
        {!activeChat ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare size={32} className="text-text-muted mx-auto mb-3" />
              <div className="text-text-secondary mb-2">Select or create a chat session</div>
              <button
                onClick={() => createChatSession()}
                className="px-4 py-2 bg-accent text-bg-primary rounded-md text-sm font-medium hover:bg-accent-hover transition-colors"
              >
                New Chat
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeChat.messages.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-text-muted text-sm">Start a conversation...</div>
                </div>
              )}
              {activeChat.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-lg text-sm ${
                      msg.role === 'user'
                        ? 'bg-accent text-bg-primary'
                        : 'bg-bg-secondary text-text-primary border border-border'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-border p-3">
              <div className="flex items-center gap-2 max-w-3xl mx-auto">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 bg-bg-secondary border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="p-2 bg-accent text-bg-primary rounded-md hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
