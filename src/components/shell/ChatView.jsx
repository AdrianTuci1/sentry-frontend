import { useState, useEffect, useRef } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { Send, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import "@/styles/chat.css";

export function ChatView() {
  const {
    chatSessions,
    activeChatId,
    createChatSession,
    addMessage,
  } = useAppStore();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const activeChat = chatSessions.find((chat) => chat.id === activeChatId);
  const messages = activeChat?.messages || [];

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    let currentChatId = activeChatId;

    // 1. Create a session on-the-fly if none exists
    if (!currentChatId) {
      const newSession = createChatSession(text.slice(0, 30));
      currentChatId = newSession.id;
    } else if (messages.length === 0) {
      // Rename session title from default to first query
      useAppStore.setState((state) => ({
        chatSessions: state.chatSessions.map((chat) =>
          chat.id === currentChatId ? { ...chat, title: text.slice(0, 30) } : chat
        ),
      }));
    }

    // 2. Add user message
    addMessage(currentChatId, {
      role: "user",
      content: text,
    });
    setInput("");

    // 3. Simulate assistant response
    setTimeout(() => {
      let reply = "Polly wants a cracker! I'm scanning Sentry telemetry, but your query seems unique. Could you clarify?";
      const lowerText = text.toLowerCase();

      if (lowerText.includes("onboarding") || lowerText.includes("started")) {
        reply = "Looking at your getting started checklist, you have configured your organization profile, but you still need to link database telemetry streams and activate ML threat filters. Click 'Onboarding' in the sidebar to review.";
      } else if (lowerText.includes("latency") || lowerText.includes("slow")) {
        reply = "Telemetry shows a high latency spike (420ms) on Payments API node `10.0.0.8`. Gateway timeouts are being reported. Check database cache layers.";
      } else if (lowerText.includes("error") || lowerText.includes("outage") || lowerText.includes("fail")) {
        reply = "Critical warning flag on Payments API (IP: `10.0.0.8`). Connection attempts from client terminals are timing out. I recommend triggering a database re-analysis in Settings.";
      } else if (lowerText.includes("user") || lowerText.includes("access")) {
        reply = "Currently, there are three users with access to your workspace. Admin `admin@efferd.io` has full permissions. You can configure individual read/write thresholds in Settings.";
      } else if (lowerText.includes("integration") || lowerText.includes("connect")) {
        reply = "Observability hub has 3 connected integrations (PostgreSQL, Kafka, S3 bucket). S3 bucket is reporting a connection sync failure. You can configure data pipelines in Integrations tab.";
      }

      addMessage(currentChatId, {
        role: "assistant",
        content: reply,
      });
    }, 800);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className={cn("chat-main-wrapper", hasMessages ? "chat-active-mode" : "chat-empty-mode")}>
      {hasMessages ? (
        /* Conversation Mode */
        <div className="chat-active-container">
          <div className="chat-messages-container">
            {messages.map((message) => {
              const isUser = message.role === "user";
              return (
                <div key={message.id} className={cn("chat-message-row", isUser ? "user" : "assistant")}>
                  <div className={cn("chat-message-avatar", isUser ? "user" : "assistant")}>
                    {isUser ? <User size={16} /> : <Sparkles size={16} className="text-accent" />}
                  </div>
                  <div className="chat-message-content-wrapper">
                    <span className="chat-message-sender-name">
                      {isUser ? "You" : "Parrot AI"}
                    </span>
                    <div className={cn("chat-message-bubble", isUser ? "user" : "assistant")}>
                      {message.content}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-active-input-footer">
            <div className="chat-centered-composer-wrapper pill-composer">
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && handleSend()}
                placeholder="Ask Parrot..."
                className="chat-centered-text-input"
              />
            </div>
          </div>
        </div>
      ) : (
        /* Empty Prompt Composer Mode */
        <div className="chat-centered-container">
          <div className="chat-centered-composer-wrapper pill-composer">
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && handleSend()}
              placeholder="Ask Parrot..."
              className="chat-centered-text-input"
            />
          </div>
        </div>
      )}
    </div>
  );
}
