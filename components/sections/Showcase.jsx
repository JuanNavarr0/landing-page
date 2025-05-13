// components/sections/Showcase.jsx
import { useTranslation } from 'next-i18next';
import styles from './Showcase.module.css';
import { useState } from 'react';
import Link from 'next/link'; // Importante: Link de next/link

const showcaseItems = [
  {
    id: 1,
    titleKey: 'showcase_item1_title',
    descriptionKey: 'showcase_item1_desc',
    imageSrc: '/images/showcase/education.jpg',
  },
  {
    id: 2,
    titleKey: 'showcase_item2_title',
    descriptionKey: 'showcase_item2_desc',
    imageSrc: '/images/showcase/hospitality.jpg',
  },
  {
    id: 3,
    titleKey: 'showcase_item3_title',
    descriptionKey: 'showcase_item3_desc',
    imageSrc: '/images/showcase/b2b-support.jpg',
  },
];

export default function Showcase() {
  const { t } = useTranslation('common');
  const defaultActiveId = showcaseItems.length > 1 ? showcaseItems[1].id : (showcaseItems.length > 0 ? showcaseItems[0].id : null) ;
  const [activeCardId, setActiveCardId] = useState(defaultActiveId);

  return (
    <section className={styles.showcaseSection} id="showcase"> {/* ID para posible navegación interna en la home */}
      <div className={styles.container}>
        <h2 className={styles.title}>
          {t('showcase_title')}
        </h2>
        <div className={styles.grid}>
          {showcaseItems.map((item) => (
            <div
              key={item.id}
              className={`${styles.card} ${
                activeCardId === item.id ? styles.activeCard : styles.inactiveCard
              }`}
              onMouseEnter={() => setActiveCardId(item.id)}
            >
              <div
                className={styles.cardBackgroundImage}
                style={{ backgroundImage: `url(${item.imageSrc})` }}
              ></div>
              <div className={styles.cardOverlay}></div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>
                  {t(item.titleKey)}
                </h3>
                <p className={styles.cardDescription}>
                  {t(item.descriptionKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.moreButtonContainer}>
          {/* ESTE ES EL ENLACE QUE YA ESTÁ CORRECTO */}
          <Link href="/projects" legacyBehavior>
             <a className={styles.moreButton}>{t('showcase_more_button', 'Más')}</a>
          </Link>
        </div>
      </div>
    </section>
  );
}