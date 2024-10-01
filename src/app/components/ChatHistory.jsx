import React from "react";
import styles from "../styles/ChatHistory.module.css";
import { Trash2 } from "lucide-react";

export default function ChatHistory({
  chatHistory,
  switchChat,
  currentChatId,
  startNewChat,
  deleteChat,
}) {
  return (
    <aside className={styles.sidebar}>
      <button onClick={startNewChat} className={styles.newChatButton}>
        New Chat
      </button>
      <ul className={styles.chatHistory}>
        {chatHistory.map((chat) => (
          <li
            key={chat.id}
            className={`${styles.chatHistoryItem} ${
              chat.id === currentChatId ? styles.active : ""
            }`}
          >
            <span onClick={() => switchChat(chat.id)}>{chat.summary}</span>
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
