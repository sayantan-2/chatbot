'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);

    // Add the user's message to the chat
    const userMessage = { role: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');

    try {
      // Make the API call with the user's message and chat history
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          history: [...messages, userMessage], // Include all messages, including the user's new message
        }),
      });

      if (!response.body) {
        throw new Error('No stream found');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let receivedText = '';

      // Add an empty assistant message first so it can be updated later with the streamed content
      const assistantMessage = { role: 'assistant', content: '' };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);

      // Read the response stream chunk by chunk
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        // Decode the incoming chunk of data
        receivedText += decoder.decode(value, { stream: true });

        // Update only the assistant's last message without removing previous messages
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1] = { role: 'assistant', content: receivedText }; // Update the last message (assistant's)
          return updatedMessages;
        });
      }

    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { role: 'assistant', content: 'An error occurred while fetching the response.' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <main className={styles.main}>
      <div className={styles.topLeftWatermark}>Version: 0.1.0 (Beta)</div>
      <div className={styles.header}>
        <h1 className={styles.title}>Chatbot</h1>
        <button className={styles.newChatButton} onClick={() => setMessages([])}>
          Start New Chat
        </button>
      </div>
      <div className={styles.chatWindow}>
        {messages.map((msg, index) => (
          <div key={index} className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.assistantMessage}`}>
            <span>{msg.content}</span>
          </div>
        ))}
        {isLoading && <div className={styles.loading}>Assistant is typing...</div>}
      </div>
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
          Send
        </button>
      </form>
      <div className={styles.watermark}>
        <a href="https://github.com/sayantan-2/chatbot" target="_blank" rel="noopener noreferrer">Sayantan</a>
      </div>
    </main>
  );
}
