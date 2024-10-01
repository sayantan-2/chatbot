// ChatWindow.js
import { useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "../styles/ChatWindow.module.css";

export default function ChatWindow({ messages, isLoading }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

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
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {msg.content}
            </ReactMarkdown>
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
