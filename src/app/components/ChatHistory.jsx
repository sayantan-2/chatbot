// ChatHistory.js
import styles from "../styles/ChatHistory.module.css";

export default function ChatHistory({
  chatHistory,
  switchChat,
  currentChatId,
}) {
  console.log("ChatHistory props:", { chatHistory, currentChatId });
  return (
    <aside className={styles.sidebar}>
      <ul className={styles.chatHistory}>
        {chatHistory.length === 0 ? (
          <li>No chat history yet</li>
        ) : (
          chatHistory.map((chat) => (
            <li
              key={chat.id}
              className={`${styles.chatHistoryItem} ${
                chat.id === currentChatId ? styles.active : ""
              }`}
              onClick={() => switchChat(chat.id)}
            >
              {chat.summary}
            </li>
          ))
        )}
      </ul>
    </aside>
  );
}
