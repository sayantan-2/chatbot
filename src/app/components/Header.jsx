// Header.js
import styles from "../styles/Header.module.css";

export default function Header({ startNewChat }) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>AI Assistant</h1>
      <button className={styles.newChatButton} onClick={startNewChat}>
        New Chat
      </button>
    </header>
  );
}
