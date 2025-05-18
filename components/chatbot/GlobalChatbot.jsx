// components/chatbot/GlobalChatbot.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'next-i18next';
import styles from './GlobalChatbot.module.css';
import { FiMessageSquare, FiSend, FiX, FiLoader } from 'react-icons/fi';
import { useChatbot } from '../context/ChatbotContext';

// Constantes de ancho ahora locales a este componente
const MIN_CHAT_WIDTH = 300;
const MAX_CHAT_WIDTH = 800;
const DEFAULT_CHAT_WIDTH = 370;

const GlobalChatbot = ({ initialBotMessage: initialBotMessageFromProps, onInitialMessageProcessed }) => {
  const { t } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [chatWidth, setChatWidth] = useState(DEFAULT_CHAT_WIDTH); 
  
  const chatWindowRef = useRef(null);
  const messagesListRef = useRef(null);
  const resizeHandleRef = useRef(null); 
  const isResizingRef = useRef(false); 
  const initialMouseXRef = useRef(0); 
  const initialChatWidthOnResizeRef = useRef(0);

  const { 
    setGlobalChatbotOpenState, 
    initialBotMessage: contextInitialMessage, 
    clearInitialBotMessage: clearContextInitialMessage,
  } = useChatbot();
  
  useEffect(() => {
    const savedWidth = localStorage.getItem('chatbotWidth');
    if (savedWidth) {
      const parsedWidth = parseInt(savedWidth, 10);
      if (!isNaN(parsedWidth) && parsedWidth >= MIN_CHAT_WIDTH && parsedWidth <= MAX_CHAT_WIDTH) {
        setChatWidth(parsedWidth);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatbotWidth', chatWidth.toString());
  }, [chatWidth]);

  const handleMouseDownResize = useCallback((e) => {
    e.preventDefault(); 
    isResizingRef.current = true;
    initialMouseXRef.current = e.clientX;
    initialChatWidthOnResizeRef.current = chatWindowRef.current.offsetWidth;
    document.addEventListener('mousemove', handleMouseMoveResize);
    document.addEventListener('mouseup', handleMouseUpResize);
    document.body.style.cursor = 'ew-resize'; 
  }, []); 

  const handleMouseMoveResize = useCallback((e) => {
    if (!isResizingRef.current) return;
    const dx = e.clientX - initialMouseXRef.current;
    let newWidth = initialChatWidthOnResizeRef.current - dx; 

    if (newWidth < MIN_CHAT_WIDTH) newWidth = MIN_CHAT_WIDTH;
    if (newWidth > MAX_CHAT_WIDTH) newWidth = MAX_CHAT_WIDTH;
    
    setChatWidth(newWidth); 
  }, []); 

  const handleMouseUpResize = useCallback(() => {
    if (!isResizingRef.current) return;
    isResizingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMoveResize);
    document.removeEventListener('mouseup', handleMouseUpResize);
    document.body.style.cursor = 'default';
  }, [handleMouseMoveResize]); 

  useEffect(() => {
    return () => {
      if (isResizingRef.current) { 
        document.removeEventListener('mousemove', handleMouseMoveResize);
        document.removeEventListener('mouseup', handleMouseUpResize);
        document.body.style.cursor = 'default';
      }
    };
  }, [handleMouseMoveResize, handleMouseUpResize]);

  useEffect(() => {
    setGlobalChatbotOpenState(isOpen);
  }, [isOpen, setGlobalChatbotOpenState]);
  
  const callHandleSendMessageRef = useRef(callHandleSendMessage); // Ref to store callHandleSendMessage

  useEffect(() => {
    callHandleSendMessageRef.current = callHandleSendMessage; // Update ref on every render
  },[callHandleSendMessage]);


  useEffect(() => {
    const messageToProcess = contextInitialMessage || initialBotMessageFromProps; 
    if (messageToProcess && messageToProcess.text) {
      setIsOpen(true); 
      if (messageToProcess.sender === 'user') { 
        setMessages(prevMessages => {
          const isAlreadyPresent = prevMessages.some(msg => msg.id === messageToProcess.id && msg.sender === 'user');
          if (isAlreadyPresent) return prevMessages;
          return [...prevMessages, { ...messageToProcess, sender: 'user' }];
        });
        // Use the ref to call the latest version of callHandleSendMessage
        callHandleSendMessageRef.current(null, messageToProcess.text, messageToProcess.projectId);
      } else { 
         setMessages(prevMessages => {
           if (prevMessages.length > 0 && prevMessages[prevMessages.length - 1]?.id === messageToProcess.id) {
             return prevMessages;
           }
           return [...prevMessages, messageToProcess]; 
         });
      }
      if (contextInitialMessage && clearContextInitialMessage) {
        clearContextInitialMessage();
      }
      if (initialBotMessageFromProps && onInitialMessageProcessed) {
        onInitialMessageProcessed();
      }
    }
  }, [contextInitialMessage, initialBotMessageFromProps, clearContextInitialMessage, onInitialMessageProcessed]);

  useEffect(() => {
    if (isOpen && messagesListRef.current) {
      messagesListRef.current.scrollTop = messagesListRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatWindowRef.current && !chatWindowRef.current.contains(event.target) &&
          resizeHandleRef.current && !resizeHandleRef.current.contains(event.target)) {
        const openButton = document.querySelector(`.${styles.openButton}`);
        if (openButton && openButton.contains(event.target)) return;
        if(!isResizingRef.current) setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    else document.removeEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleChat = () => {
    const newOpenState = !isOpen;
    setIsOpen(newOpenState);
    if (newOpenState && messages.length === 0) {
      setMessages([{
        id: `bot-greeting-${Date.now()}`,
        text: t('chatbot_generic_greeting', '¡Hola! ¿Cómo puedo ayudarte hoy?'),
        sender: 'bot',
      }]);
    }
  };
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  function callHandleSendMessage (e, directMessageText = null, directProjectId = null) {
    // This function is defined here but its logic is wrapped in useCallback below
    // to be assigned to callHandleSendMessageRef.current
    (async () => {
        if (e) e.preventDefault();
        setError(null);
        const messageText = directMessageText || inputValue;
        if (messageText.trim() === '') return;
        const userMessage = {
            id: `user-${Date.now()}`,
            text: messageText,
            sender: 'user',
            projectId: directProjectId
        };
        let currentMessagesState = messages;
        if (!directMessageText) {
            currentMessagesState = [...messages, userMessage];
            setMessages(currentMessagesState);
        }
        setInputValue('');
        setIsLoading(true);
        const apiMessages = currentMessagesState.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text,
        }));
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: apiMessages, projectId: userMessage.projectId || null }),
            });
            setIsLoading(false);
            if (!response.ok) {
                let errorData;
                try { errorData = await response.json(); }
                catch (parseError) { throw new Error(`Error ${response.status}: ${response.statusText}. No se pudo obtener detalle del error.`); }
                throw new Error(errorData.error || `Error: ${response.status}`);
            }
            const data = await response.json();
            let botResponseText = data.reply;
            let isHardCtaMessage = false;
            if (data.status === "soft_cta" && data.ctaMessage) {
                botResponseText += `\n\n*${data.ctaMessage}*`;
            } else if (data.status === "hard_cta") {
                isHardCtaMessage = true;
            }
            const botResponseMessage = {
                id: `bot-${Date.now()}`,
                text: botResponseText,
                sender: 'bot',
                isHardCta: isHardCtaMessage,
                isError: false
            };
            setMessages(prev => [...prev, botResponseMessage]);
            if (isHardCtaMessage) {
                console.log("Límite de mensajes (hard CTA) alcanzado. Redirigiendo a #contact...");
                // Scroll a la sección de contacto
                window.location.hash = '#contact';
            }
        } catch (err) {
            setIsLoading(false);
            const errorMessageText = err.message || t('chatbot_error_fallback', 'Lo siento, no pude procesar tu mensaje.');
            setError(errorMessageText);
            setMessages(prev => [
                ...prev,
                { id: `error-${Date.now()}`, text: errorMessageText, sender: 'bot', isError: true, isHardCta: false },
            ]);
        }
    })();
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedCallHandleSendMessage = useCallback(callHandleSendMessage, [inputValue, messages, t]);


  useEffect(() => {
    callHandleSendMessageRef.current = memoizedCallHandleSendMessage;
  }, [memoizedCallHandleSendMessage]);


  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
  const isInputDisabled = isLoading || (lastMessage && lastMessage.isHardCta);
  const placeholderText = (lastMessage && lastMessage.isHardCta)
    ? t('chatbot_hard_cta_placeholder', 'Por favor, contacta por email.')
    : t('chatbot_input_placeholder');

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
        <div className={`${styles.globalChatbotContainer} ${styles.chatOpen}`}>
          <div 
            ref={chatWindowRef} 
            className={styles.chatWindow}
            style={{ width: `${chatWidth}px` }} 
          >
            <div 
              ref={resizeHandleRef}
              className={styles.resizeHandle}
              onMouseDown={handleMouseDownResize}
              title={t('chatbot_resize_tooltip', 'Arrastra para cambiar tamaño')}
            >
              <div className={styles.resizeHandleInnerBar}></div>
              <div className={styles.resizeHandleInnerBar}></div>
            </div>
            <div className={`${styles.chatHeader}`}>
              <button onClick={toggleChat} className={styles.closeButton} aria-label={t('chatbot_close_chat', 'Cerrar chat')}>
                <FiX size={20} />
              </button>
            </div>
            <div ref={messagesListRef} className={styles.messagesList}>
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`${styles.message} ${styles[msg.sender]} ${msg.isError ? styles.error : ''} ${msg.isHardCta ? styles.hardCtaMessage : ''}`}
                >
                  <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                </div>
              ))}
              {isLoading && (
                <div className={`${styles.message} ${styles.bot} ${styles.loadingMessage}`}>
                  <FiLoader className={styles.loadingIcon} size={20} />
                </div>
              )}
            </div>
            <form onSubmit={memoizedCallHandleSendMessage} className={styles.messageForm}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={placeholderText}
                className={styles.input}
                aria-label={placeholderText}
                disabled={isInputDisabled} 
              />
              <button 
                type="submit" 
                className={styles.sendButton} 
                aria-label={t('chatbot_send_message')}
                disabled={isInputDisabled || inputValue.trim() === ''} 
              >
                {isLoading ? <FiLoader className={styles.loadingIconInButton} size={20} /> : <FiSend size={20} />}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalChatbot;
