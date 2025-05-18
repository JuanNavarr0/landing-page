// components/layout/Layout.jsx
import Navbar from './Navbar';
import Footer from './Footer';
import styles from './Layout.module.css'; // Asegúrate que la ruta es correcta
import GlobalChatbot from '../chatbot/GlobalChatbot';
import { useChatbot } from '../context/ChatbotContext'; // Asegúrate que la ruta es correcta

export default function Layout({ children }) {
  const { initialBotMessage, clearInitialBotMessage, isChatbotOpen } = useChatbot();

  return (
    <div className={styles.layoutContainer}>
      <Navbar />
      <main className={styles.mainContent}>{children}</main>
      <Footer />
      
      {/* Overlay de Blur para toda la parte derecha de la página */}
      <div 
        className={`${styles.fullPageBlurOverlay} ${isChatbotOpen ? styles.active : ''}`}
      ></div>

      <GlobalChatbot 
        initialBotMessage={initialBotMessage} 
        onInitialMessageProcessed={clearInitialBotMessage}
      />
    </div>
  );
}