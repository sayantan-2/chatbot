// Header.jsx
import styles from "../styles/Header.module.css";
import { Menu } from "lucide-react";

export default function Header({ toggleSidebar }) {
  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <button className={styles.menuButton} onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
      </div>
      <h1 className={styles.title}>Chat App</h1>
      <div className={styles.rightSection}></div>
    </header>
  );
}

// Header.module.css
