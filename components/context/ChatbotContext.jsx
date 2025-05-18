// contexts/ChatbotContext.jsx
import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

const ChatbotContext = createContext(undefined);

// Constantes para el ancho del chatbot que pueden ser útiles globalmente
export const MIN_CHAT_WIDTH_CONST = 300;
export const MAX_CHAT_WIDTH_CONST = 800;
export const DEFAULT_CHAT_WIDTH_CONST = 370; // Ancho inicial por defecto

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};

export const ChatbotProvider = ({ children }) => {
  const [initialBotMessage, setInitialBotMessage] = useState(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  // Estado para el ancho del chatbot, inicializado con el valor por defecto
  const [chatWidth, setChatWidth] = useState(DEFAULT_CHAT_WIDTH_CONST);

  const triggerChatbot = useCallback((messageText, projectId = null) => {
    setInitialBotMessage({
      id: `user-init-${Date.now()}`, // Asegurar ID único
      text: messageText,
      sender: 'user', // El mensaje desencadenado por el botón es una acción del usuario
      projectId: projectId
    });
    setIsChatbotOpen(true);
  }, []);

  const clearInitialBotMessage = useCallback(() => {
    setInitialBotMessage(null);
  }, []);

  const setGlobalChatbotOpenState = useCallback((isOpen) => {
    setIsChatbotOpen(isOpen);
    if (!isOpen) {
      clearInitialBotMessage();
    }
  }, [clearInitialBotMessage]);

  // Función para actualizar el ancho del chatbot desde GlobalChatbot
  // y que Layout.jsx pueda leerlo para ajustar el blur.
  const setGlobalChatbotWidth = useCallback((newWidth) => {
    let validatedWidth = parseInt(newWidth, 10); // Asegurarse de que es un número
    if (isNaN(validatedWidth)) {
        validatedWidth = DEFAULT_CHAT_WIDTH_CONST;
    }
    
    validatedWidth = Math.max(MIN_CHAT_WIDTH_CONST, validatedWidth);
    validatedWidth = Math.min(MAX_CHAT_WIDTH_CONST, validatedWidth);
    
    setChatWidth(validatedWidth);
    // Guardar en localStorage directamente aquí cuando se actualiza desde el contexto
    localStorage.setItem('chatbotWidth', validatedWidth.toString());
  }, []); // Vacío para que la referencia de la función sea estable

  // Cargar el ancho desde localStorage una vez al montar el Provider
  useEffect(() => {
    const savedWidth = localStorage.getItem('chatbotWidth');
    if (savedWidth) {
      const parsedWidth = parseInt(savedWidth, 10);
      // Usamos la función validadora para asegurar que esté en los límites
      // y para actualizar el estado y localStorage si es necesario
      if (!isNaN(parsedWidth)) {
        setGlobalChatbotWidth(parsedWidth); // Esto validará y guardará en localStorage también
      }
    }
  }, [setGlobalChatbotWidth]); // setGlobalChatbotWidth es estable gracias a useCallback

  return (
    <ChatbotContext.Provider value={{
      triggerChatbot,
      initialBotMessage,
      clearInitialBotMessage,
      isChatbotOpen,
      setGlobalChatbotOpenState,
      chatWidth, // Exponer el ancho actual
      setGlobalChatbotWidth // Exponer la función para actualizar el ancho
    }}>
      {children}
    </ChatbotContext.Provider>
  );
};
