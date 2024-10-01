// ChatHistory.js
import styles from "../styles/ChatHistory.module.css";

export default function ChatHistory({
  chatHistory,
  switchChat,
  currentChatId,
  startNewChat,
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
            onClick={() => switchChat(chat.id)}
          >
            {chat.summary}
          </li>
        ))}
      </ul>
    </aside>
  );
}
