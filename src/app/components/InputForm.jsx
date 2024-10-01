// InputForm.jsx
import { useState } from "react";
import styles from "../styles/InputForm.module.css";
import { ArrowRight } from "lucide-react";

export default function InputForm({
  handleSubmit,
  input,
  setInput,
  isLoading,
}) {
  return (
    <form onSubmit={handleSubmit} className={styles.inputForm}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className={styles.input}
        placeholder="Type your message..."
        disabled={isLoading}
      />
      <button type="submit" className={styles.sendButton} disabled={isLoading}>
        <ArrowRight size={20} />
      </button>
    </form>
  );
}

// InputForm.module.css
