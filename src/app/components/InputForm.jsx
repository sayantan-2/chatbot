// InputForm.js
import { useState } from "react";
import styles from "../styles/InputForm.module.css";

export default function InputForm({
  handleSubmit,
  input,
  setInput,
  isLoading,
  provider,
  setProvider,
}) {
  return (
    <form onSubmit={handleSubmit} className={styles.inputForm}>
      <select
        value={provider}
        onChange={(e) => setProvider(e.target.value)}
        className={styles.providerDropdown}
        disabled={isLoading}
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
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className={styles.input}
        placeholder="Type your message..."
        disabled={isLoading}
      />
      <button type="submit" className={styles.sendButton} disabled={isLoading}>
        Send
      </button>
    </form>
  );
}
