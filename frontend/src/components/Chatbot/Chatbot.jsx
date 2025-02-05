import { useState } from "react";
import axios from "axios";
import styles from "./chatbot.module.css"; // Import CSS module
import { BsChatDots } from "react-icons/bs"; // Import chat icon

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false); // Controls chat visibility

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { text: input, sender: "user" };
    setMessages([...messages, newMessage]);

    try {
      const response = await axios.post("http://127.0.0.1:8000/chatbot/", {
        message: input,
      });

      const botMessage = { text: response.data.response, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { text: "Error: Unable to fetch response.", sender: "bot" };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setInput("");
  };

  return (
    <>
      {/* Chatbot Icon */}
      <div className={styles.chatbotIcon} onClick={() => setIsOpen(!isOpen)}>
        <BsChatDots size={30} />
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className={styles.chatContainer}>
          <div className={styles.chatHeader}>
            <span>Chatbot</span>
            <button onClick={() => setIsOpen(false)} className={styles.closeButton}>×</button>
          </div>
          <div className={styles.chatbox}>
            {messages.map((msg, index) => (
              <div key={index} className={msg.sender === "user" ? styles.userMessage : styles.botMessage}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className={styles.inputArea}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className={styles.inputField}
            />
            <button onClick={sendMessage} className={styles.sendButton}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
