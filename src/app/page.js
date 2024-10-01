'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './page.module.css';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);

    const userMessage = { role: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          history: [...messages, userMessage],
        }),
      });

      if (!response.body) {
        throw new Error('No stream found');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let receivedText = '';

      const assistantMessage = { role: 'assistant', content: '' };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        receivedText += decoder.decode(value, { stream: true });

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1] = { role: 'assistant', content: receivedText };
          return updatedMessages;
        });
      }

      // Add the conversation to chat history
      setChatHistory((prevHistory) => [...prevHistory, { id: Date.now(), preview: input.slice(0, 30) + '...' }]);

    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { role: 'assistant', content: 'An error occurred while fetching the response.' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setInput('');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>AI Assistant</h1>
        <button className={styles.newChatButton} onClick={startNewChat}>
          New Chat
        </button>
      </header>
      <div className={styles.chatContainer}>
        <aside className={styles.sidebar}>
          <ul className={styles.chatHistory}>
            {chatHistory.map((chat) => (
              <li key={chat.id} className={styles.chatHistoryItem}>{chat.preview}</li>
            ))}
          </ul>
        </aside>
        <main className={styles.mainChat}>
          <div className={styles.chatWindow}>
            {messages.map((msg, index) => (
              <div key={index} className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.assistantMessage}`}>
                {msg.role === 'assistant' ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                ) : (
                  <span>{msg.content}</span>
                )}
              </div>
            ))}
            {isLoading && <div className={styles.message}>Assistant is typing...</div>}
            <div ref={messagesEndRef} />
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
        </main>
      </div>
    </div>
  );
}