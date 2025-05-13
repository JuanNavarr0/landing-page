// components/layout/Footer.jsx
import { useTranslation } from 'next-i18next';
import styles from './Footer.module.css'; // Importa los estilos del módulo

export default function Footer() {
  const { t } = useTranslation('common');
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.text}>
          &copy; {currentYear} NexoAI. {t('footer_rights_reserved')}
        </p>
        {/* <div className={styles.links}>
          <a href="/privacy" className={styles.link}>{t('footer_privacy')}</a>
          <a href="/terms" className={styles.link}>{t('footer_terms')}</a>
        </div> */}
      </div>
    </footer>
  );
}