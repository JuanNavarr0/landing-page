// components/chatbot/GlobalChatbot.jsx
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import styles from './GlobalChatbot.module.css';
import { FiMessageSquare, FiSend, FiX } from 'react-icons/fi';
import { useChatbot } from '../context/ChatbotContext';

const GlobalChatbot = ({ initialBotMessage, onInitialMessageProcessed }) => {
  const { t } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]); // [viejo, ..., nuevo]
  const [inputValue, setInputValue] = useState('');
  const chatWindowRef = useRef(null);
  const messagesListRef = useRef(null); // Ref para la lista de mensajes

  const { setGlobalChatbotOpenState } = useChatbot();

  useEffect(() => {
    setGlobalChatbotOpenState(isOpen);
  }, [isOpen, setGlobalChatbotOpenState]);

  useEffect(() => {
    if (initialBotMessage && initialBotMessage.text) {
      setMessages(prevMessages => {
        if (prevMessages.length > 0 && prevMessages[prevMessages.length - 1]?.id === initialBotMessage.id) {
          return prevMessages;
        }
        return [...prevMessages, initialBotMessage];
      });
      setIsOpen(true);
      if (onInitialMessageProcessed) {
        onInitialMessageProcessed();
      }
    }
  }, [initialBotMessage, onInitialMessageProcessed]);

  // Scroll automático al fondo de la lista de mensajes
  useEffect(() => {
    if (isOpen && messagesListRef.current) {
      const { scrollHeight } = messagesListRef.current;
      messagesListRef.current.scrollTop = scrollHeight;
    }
  }, [messages, isOpen]); // Ejecutar cada vez que los mensajes cambien o se abra el chat

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatWindowRef.current && !chatWindowRef.current.contains(event.target)) {
        const openButton = document.querySelector(`.${styles.openButton}`);
        if (openButton && openButton.contains(event.target)) {
          return;
        }
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleChat = () => {
    const newOpenState = !isOpen;
    setIsOpen(newOpenState);

    if (newOpenState && messages.length === 0) {
      setMessages([{
        id: Date.now(),
        text: t('chatbot_generic_greeting', '¡Hola! ¿Cómo puedo ayudarte hoy?'),
        sender: 'bot',
      }]);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    const userMessage = { id: Date.now(), text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, text: t('chatbot_simulated_response', 'Gracias por tu pregunta...'), sender: 'bot' },
      ]);
    }, 1000);
  };

  return (
    <>
      {!isOpen && (
        <div className={styles.globalChatbotContainer}>
          <button onClick={toggleChat} className={styles.openButton} aria-label={t('chatbot_open_chat', 'Abrir chat')}>
            <FiMessageSquare size={28} />
          </button>
        </div>
      )}

      {isOpen && (
        <div ref={chatWindowRef} className={`${styles.globalChatbotContainer} ${styles.chatOpen}`}>
          <div className={styles.chatWindow}>
            <div className={`${styles.chatHeader}`}>
              <button onClick={toggleChat} className={styles.closeButton} aria-label={t('chatbot_close_chat', 'Cerrar chat')}>
                <FiX size={20} />
              </button>
            </div>
            <div ref={messagesListRef} className={styles.messagesList}>
              {/* Los mensajes se mapean en orden cronológico (viejo a nuevo) */}
              {messages.map((msg) => (
                <div key={msg.id} className={`${styles.message} ${styles[msg.sender]}`}>
                  <p>{msg.text}</p>
                </div>
              ))}
              {/* Ya no necesitamos el messagesEndRef aquí */}
            </div>
            <form onSubmit={handleSendMessage} className={styles.messageForm}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t('chatbot_input_placeholder')}
                className={styles.input}
                aria-label={t('chatbot_input_placeholder')}
              />
              <button type="submit" className={styles.sendButton} aria-label={t('chatbot_send_message')}>
                <FiSend size={20} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalChatbot;