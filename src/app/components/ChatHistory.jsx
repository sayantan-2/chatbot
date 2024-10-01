// ChatHistory.jsx
import React from "react";
import styles from "../styles/ChatHistory.module.css";
import { Trash2 } from "lucide-react";

export default function ChatHistory({
  chatHistory,
  switchChat,
  currentChatId,
  startNewChat,
  deleteChat,
  provider,
  setProvider,
}) {
  const handleChatClick = (chatId) => {
    switchChat(chatId);
  };

  return (
    <aside className={styles.sidebar}>
      <button onClick={startNewChat} className={styles.newChatButton}>
        New Chat
      </button>
      <select
        value={provider}
        onChange={(e) => setProvider(e.target.value)}
        className={styles.providerDropdown}
      >
        <option value="groq">Groq</option>
        <option value="gemini" disabled>
          🔒 Gemini
        </option>
        <option value="openai" disabled>
          🔒 OpenAI
        </option>
        <option value="anthropic" disabled>
          🔒 Anthropic
        </option>
      </select>
      <ul className={styles.chatHistory}>
        {chatHistory.map((chat) => (
          <li
            key={chat.id}
            className={`${styles.chatHistoryItem} ${
              chat.id === currentChatId ? styles.active : ""
            }`}
            onClick={() => handleChatClick(chat.id)}
          >
            <span>{chat.summary}</span>
            <button
              className={styles.deleteButton}
              onClick={(e) => {
                e.stopPropagation();
                deleteChat(chat.id);
              }}
            >
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
