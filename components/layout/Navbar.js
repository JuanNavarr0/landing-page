// components/layout/Navbar.jsx
import Link from 'next/link';
import Image from 'next/image'; // ¡Importa el componente Image!
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import styles from './Navbar.module.css';
import { useState, useEffect, useRef } from 'react';
import { MdLanguage } from 'react-icons/md';

export default function Navbar() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [isScrolled, setIsScrolled] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setLangMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [langMenuRef]);

  const changeLanguage = (locale) => {
    router.push(router.pathname, router.asPath, { locale });
    setLangMenuOpen(false);
  };

  const navLinks = [
      { nameKey: 'nav_home', href: '/' },
      // MODIFICACIÓN AQUÍ: Cambiar href a /projects
      { nameKey: 'nav_projects', href: '/projects' },
      { nameKey: 'nav_contact', href: '/#contact' },
  ];

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <Link href="/" className={styles.logo}>
              <Image
                src="/nexoai.jpg"
                alt="SoluX AI Logo"
                width={30}
                height={30}
                className={styles.logoImage}
              />
              <span>Solux</span>
          </Link>
        </div>

        <div className={styles.navLinksContainer}>
           {navLinks.map((link) => (
               <Link key={link.nameKey} href={link.href} className={styles.navLink}>
                   {t(link.nameKey)}
               </Link>
           ))}
        </div>

        <div className={styles.langButtonContainer} ref={langMenuRef}>
          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className={styles.langIcon}
            aria-label={t('change_language')}
          >
            <MdLanguage className={styles.langIconSvg} />
          </button>
          {langMenuOpen && (
            <div className={styles.langMenu}>
              <button
                onClick={() => changeLanguage('en')}
                className={`${styles.langMenuItem} ${
                  router.locale === 'en' ? styles.langMenuItemActive : ''
                }`}
              >
                English
              </button>
              <button
                onClick={() => changeLanguage('es')}
                className={`${styles.langMenuItem} ${
                  router.locale === 'es' ? styles.langMenuItemActive : ''
                }`}
              >
                Español
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}