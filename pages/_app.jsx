// pages/_app.js
import '../styles/globals.css'; // Verifica que la ruta sea correcta
import { appWithTranslation } from 'next-i18next';
import nextI18NextConfig from '../next-i18next.config.js';
import Layout from '../components/layout/Layout'; // Importa el Layout
import { ChatbotProvider } from '../components/context/ChatbotContext'; // Asegúrate que la ruta sea correcta

function MyApp({ Component, pageProps }) {
  return (
    <ChatbotProvider> {/* Envuelve la aplicación con ChatbotProvider */}
      <Layout> {/* Layout ahora está DENTRO de ChatbotProvider */}
        <Component {...pageProps} />
      </Layout>
    </ChatbotProvider>
  );
}

export default appWithTranslation(MyApp, nextI18NextConfig);