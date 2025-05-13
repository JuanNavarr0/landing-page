// components/sections/Hero.jsx
import { useTranslation } from 'next-i18next';
import styles from './Hero.module.css';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RequestDemoModal from '../modals/RequestDemoModal'; // Importar el modal

export default function Hero() {
  const { t, i18n } = useTranslation('common');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false); // Estado para el modal

  const dynamicWordsKeys = ['business', 'life', 'idea', 'project'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const titleRef = useRef(null); 

  useEffect(() => {
    const wordChangeInterval = 4500;
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % dynamicWordsKeys.length);
    }, wordChangeInterval);
    return () => clearInterval(interval);
  }, []);

  const wordVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 },
  };

  const transitionConfig = {
    duration: 1.0,
    ease: [0.22, 1, 0.36, 1],
  };

  // --- LÓGICA PARA RESALTAR "IA"/"AI" (RESTAURADA) ---
  const titleLine1Text = t('hero_title_line1');
  let part1 = titleLine1Text; 
  let highlightedWord = "";
  let part2 = "";

  const keywordToHighlight = i18n.language === 'es' ? "IA" : "AI";
  const regex = new RegExp(`^(.*?)(${keywordToHighlight})(.*)$`, 'i'); 
  const match = titleLine1Text.match(regex);

  if (match) {
    part1 = match[1]; 
    highlightedWord = match[2]; 
    part2 = match[3]; 
  }
  // --- FIN DE LÓGICA PARA RESALTAR "IA"/"AI" ---

  return (
    <> {/* Envuelve en Fragment para poder tener el modal como hermano */}
      <section className={styles.heroSection} id="hero">
        <div className={styles.container}>
          <motion.h1
            ref={titleRef}
            className={styles.title}
          >
            {/* Renderizamos las partes del título CON EL RESALTADO */}
            {part1}
            {highlightedWord && (
              <span className={styles.highlightedText}>{highlightedWord}</span>
            )}
            {part2}
            <br />
            {t('hero_title_line2_prefix')}
            <AnimatePresence mode="wait">
              <motion.span
                key={currentWordIndex}
                className={styles.dynamicWord}
                variants={wordVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={transitionConfig}
              >
                {t(`hero_word_${dynamicWordsKeys[currentWordIndex]}`)}
              </motion.span>
            </AnimatePresence>
          </motion.h1>

          <p className={styles.subtitle}>
            {t('hero_subtitle')}
          </p>
          <div className={styles.buttonGroup}>
            {/* Botón "Contact Us" como enlace de ancla */}
            <a href="/#contact" className={`${styles.button} ${styles.buttonPrimary}`}>
              {t('hero_cta_contact')}
            </a>
            {/* Botón "Request Demo" abre el modal */}
            <button
              className={`${styles.button} ${styles.buttonSecondary}`}
              onClick={() => setIsDemoModalOpen(true)}
            >
              {t('hero_cta_demo')}
            </button>
          </div>
        </div>
      </section>

      {/* Renderizar el Modal */}
      <RequestDemoModal 
        isOpen={isDemoModalOpen} 
        onClose={() => setIsDemoModalOpen(false)} 
      />
    </>
  );
}