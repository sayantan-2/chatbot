// ChatWindow.jsx
import { useRef, useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import styles from "../styles/ChatWindow.module.css";
import { Copy, Check } from "lucide-react";

const CodeBlock = ({ node, inline, className, children, ...props }) => {
  const [isCopied, setIsCopied] = useState(false);

  // Extract language from className if it exists
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";

  const getCodeString = (children) => {
    if (typeof children === "string") return children;
    if (Array.isArray(children)) {
      return children
        .map((child) => {
          if (typeof child === "string") return child;
          if (child?.props?.children)
            return getCodeString(child.props.children);
          return "";
        })
        .join("");
    }
    if (children?.props?.children)
      return getCodeString(children.props.children);
    return "";
  };

  const codeString = getCodeString(children);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code: ", err);
    }
  };

  // For inline code, use a simple code tag
  if (inline) {
    return (
      <code className={styles.inlineCode} {...props}>
        {children}
      </code>
    );
  }

  return (
    <div className={styles.codeBlockWrapper}>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: "1rem",
          borderRadius: "0.5rem",
        }}
        PreTag="div"
      >
        {codeString}
      </SyntaxHighlighter>
      <button
        className={`${styles.copyButton} ${styles.codeBlockCopyButton}`}
        onClick={handleCopyCode}
      >
        {isCopied ? <Check size={14} /> : <Copy size={14} />}
        {isCopied ? "Copied!" : "Copy Code"}
      </button>
    </div>
  );
};

export default function ChatWindow({ messages, isLoading }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className={styles.chatWindow}>
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`${styles.message} ${
            msg.role === "user" ? styles.userMessage : styles.assistantMessage
          }`}
        >
          {msg.role === "assistant" ? (
            <>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code: CodeBlock,
                }}
              >
                {msg.content}
              </ReactMarkdown>
              <button
                className={styles.copyButton}
                onClick={() => handleCopy(msg.content, index)}
              >
                {copiedIndex === index ? (
                  <Check size={16} />
                ) : (
                  <Copy size={16} />
                )}
                {copiedIndex === index ? "Copied!" : "Copy Full Response"}
              </button>
            </>
          ) : (
            <span>{msg.content}</span>
          )}
        </div>
      ))}
      {isLoading && (
        <div className={styles.message}>Assistant is typing...</div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
