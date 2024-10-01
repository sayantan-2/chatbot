// Home.js
'use client';

import { useState, useEffect } from 'react';
import Header from './components/Header';
import ChatHistory from './components/ChatHistory';
import ChatWindow from './components/ChatWindow';
import InputForm from './components/InputForm';
import styles from './page.module.css';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [provider, setProvider] = useState('groq');

  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    const savedCurrentChatId = localStorage.getItem('currentChatId');
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory);
      setChatHistory(parsedHistory);
      if (savedCurrentChatId) {
        setCurrentChatId(savedCurrentChatId);
        const selectedChat = parsedHistory.find(chat => chat.id === savedCurrentChatId);
        if (selectedChat) {
          setMessages(selectedChat.messages);
        }
      } else if (parsedHistory.length > 0) {
        // If no current chat id is saved, default to the most recent chat
        const mostRecentChat = parsedHistory[parsedHistory.length - 1];
        setCurrentChatId(mostRecentChat.id);
        setMessages(mostRecentChat.messages);
      }
    } else {
      // If no history at all, start a new chat
      startNewChat();
    }
  }, []);

  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  useEffect(() => {
    if (currentChatId) {
      localStorage.setItem('currentChatId', currentChatId);
    }
  }, [currentChatId]);

  const startNewChat = () => {
    const newChatId = Date.now().toString();
    const newChat = { id: newChatId, summary: 'New Chat', messages: [] };
    setCurrentChatId(newChatId);
    setMessages([]);
    setInput('');
    setChatHistory(prevHistory => [...prevHistory, newChat]);
  };

  const updateChatHistory = (chatId, updatedMessages) => {
    setChatHistory(prevHistory =>
      prevHistory.map(chat =>
        chat.id === chatId
          ? { ...chat, messages: updatedMessages, summary: generateSummary(updatedMessages) }
          : chat
      )
    );
  };

  const generateSummary = (messages) => {
    const firstUserMessage = messages.find(msg => msg.role === 'user');
    if (firstUserMessage) {
      return firstUserMessage.content.split(' ').slice(0, 5).join(' ') + '...';
    }
    return 'New Chat';
  };

  const switchChat = (chatId) => {
    setCurrentChatId(chatId);
    const selectedChat = chatHistory.find(chat => chat.id === chatId);
    if (selectedChat) {
      setMessages(selectedChat.messages);
    }
  };

  const deleteChat = (chatId) => {
    setChatHistory(prevHistory => prevHistory.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) {
      const remainingChats = chatHistory.filter(chat => chat.id !== chatId);
      if (remainingChats.length > 0) {
        const latestChat = remainingChats[remainingChats.length - 1];
        setCurrentChatId(latestChat.id);
        setMessages(latestChat.messages);
      } else {
        startNewChat();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');

    // Ensure we're updating the correct chat in history
    updateChatHistory(currentChatId, updatedMessages);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          history: updatedMessages,
          provider,
        }),
      });

      if (!response.body) {
        throw new Error('No stream found');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let receivedText = '';

      const assistantMessage = { role: 'assistant', content: '' };
      updatedMessages.push(assistantMessage);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        receivedText += decoder.decode(value, { stream: true });

        updatedMessages[updatedMessages.length - 1] = { role: 'assistant', content: receivedText };
        setMessages([...updatedMessages]);

        // Update chat history with each chunk of the response
        updateChatHistory(currentChatId, updatedMessages);
      }

    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { role: 'assistant', content: 'An error occurred while fetching the response.' };
      const updatedMessagesWithError = [...updatedMessages, errorMessage];
      setMessages(updatedMessagesWithError);
      updateChatHistory(currentChatId, updatedMessagesWithError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Header startNewChat={startNewChat} />
      <div className={styles.chatContainer}>
        <ChatHistory
          chatHistory={chatHistory}
          switchChat={switchChat}
          currentChatId={currentChatId}
          startNewChat={startNewChat}
          deleteChat={deleteChat}
        />
        <main className={styles.mainChat}>
          <ChatWindow messages={messages} isLoading={isLoading} />
          <InputForm
            handleSubmit={handleSubmit}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
            provider={provider}
            setProvider={setProvider}
          />
        </main>
      </div>
    </div>
  );
}