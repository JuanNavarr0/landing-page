// contexts/ChatbotContext.jsx
import React, { createContext, useState, useContext, useCallback } from 'react';

const ChatbotContext = createContext(undefined);

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};

export const ChatbotProvider = ({ children }) => {
  const [initialBotMessage, setInitialBotMessage] = useState(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false); // Estado para saber si está abierto

  const triggerChatbot = useCallback((messageText, projectId = null) => {
    setInitialBotMessage({
      id: Date.now(),
      text: messageText,
      sender: 'bot',
      projectId: projectId
    });
    setIsChatbotOpen(true); // Cuando se dispara por un trigger, se asume que se abre
  }, []);

  const clearInitialBotMessage = useCallback(() => {
    setInitialBotMessage(null);
  }, []);

  // Nueva función para que GlobalChatbot notifique al contexto su estado de apertura
  const setGlobalChatbotOpenState = useCallback((isOpen) => {
    setIsChatbotOpen(isOpen);
    if (!isOpen) {
      // Si el chatbot se cierra manualmente, también limpiamos el mensaje inicial
      // para que no se dispare de nuevo si se abre manualmente.
      clearInitialBotMessage();
    }
  }, [clearInitialBotMessage]);

  return (
    <ChatbotContext.Provider value={{ 
      triggerChatbot, 
      initialBotMessage, 
      clearInitialBotMessage,
      isChatbotOpen, // Exponemos el estado
      setGlobalChatbotOpenState // Exponemos la función para actualizarlo
    }}>
      {children}
    </ChatbotContext.Provider>
  );
};