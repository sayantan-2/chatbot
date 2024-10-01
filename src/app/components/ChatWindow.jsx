// ChatWindow.jsx
import { useRef, useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "../styles/ChatWindow.module.css";
import { Copy, Check } from "lucide-react";

export default function ChatWindow({ messages, isLoading }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className={styles.chatWindow}>
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`${styles.message} ${
            msg.role === "user" ? styles.userMessage : styles.assistantMessage
          }`}
        >
          {msg.role === "assistant" ? (
            <>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.content}
              </ReactMarkdown>
              <button
                className={styles.copyButton}
                onClick={() => handleCopy(msg.content, index)}
              >
                {copiedIndex === index ? (
                  <Check size={16} />
                ) : (
                  <Copy size={16} />
                )}
                {copiedIndex === index ? "Copied!" : "Copy"}
              </button>
            </>
          ) : (
            <span>{msg.content}</span>
          )}
        </div>
      ))}
      {isLoading && (
        <div className={styles.message}>Assistant is typing...</div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

// ChatWindow.module.css
/* ... (existing styles) ... */
