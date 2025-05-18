// pages/projects.jsx
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from '../styles/Projects.module.css'; // CSS principal de la página
import cardStyles from '../styles/ProjectCardAdditions.module.css'; // CSS para los nuevos elementos en la tarjeta
import Link from 'next/link';
import Image from 'next/image';
import { useChatbot } from '../components/context/ChatbotContext'; // Hook para usar el ChatbotContext (ajusta la ruta si es necesario)
import { FiChevronsRight } from "react-icons/fi"; // Icono para el botón

// Asegúrate de que tus projectSectionsData estén definidos como antes,
// y añade una nueva propiedad 'introMessageKey' a cada objeto de sección.
const projectSectionsData = [
  {
    id: 'education',
    titleKey: 'project1_title',
    descriptionKey: 'projects_section_education_desc',
    introMessageKey: 'project_intro_education', // Clave para el mensaje introductorio del chatbot
    collageItems: [
      { id: 'edu1', type: 'image', src: '/images/projects/education/edu-project-1.jpg', alt: 'Proyecto IA en Educación 1', link: '/projects/education-detail-1' },
      { id: 'edu2', type: 'image', src: '/images/projects/education/edu-project-2.jpg', alt: 'Proyecto IA en Educación 2' },
      { id: 'edu3', type: 'link', titleKey: 'project_detail_generic_link', link: '/projects/education-detail-3', text: 'Ver detalle del proyecto Alpha' },
      { id: 'edu4', type: 'image', src: '/images/projects/education/edu-project-3.jpg', alt: 'Proyecto IA en Educación 3' },
    ],
  },
  {
    id: 'hospitality',
    titleKey: 'project2_title',
    descriptionKey: 'projects_section_hospitality_desc',
    introMessageKey: 'project_intro_hospitality',
    collageItems: [
      { id: 'hosp1', type: 'image', src: '/images/projects/hospitality/hosp-project-1.jpg', alt: 'Proyecto IA en Hotelería 1' },
      { id: 'hosp2', type: 'link', titleKey: 'project_detail_generic_link', link: '/projects/hospitality-detail-1', text: 'Conocer más sobre Beta' },
      { id: 'hosp3', type: 'image', src: '/images/projects/hospitality/hosp-project-2.jpg', alt: 'Proyecto IA en Hotelería 2', link: '/projects/hospitality-detail-2' },
    ],
  },
  {
    id: 'b2b',
    titleKey: 'project3_title',
    descriptionKey: 'projects_section_b2b_desc',
    introMessageKey: 'project_intro_b2b',
    collageItems: [
      { id: 'b2b1', type: 'image', src: '/images/projects/b2b/b2b-project-1.jpg', alt: 'Proyecto IA B2B 1', link: '/projects/b2b-detail-1' },
      { id: 'b2b2', type: 'image', src: '/images/projects/b2b/b2b-project-2.jpg', alt: 'Proyecto IA B2B 2' },
      { id: 'b2b3', type: 'link', titleKey: 'project_detail_generic_link', link: '/projects/b2b-detail-2', text: 'Estudio de caso Gamma' },
      { id: 'b2b4', type: 'image', src: '/images/projects/b2b/b2b-project-3.jpg', alt: 'Proyecto IA B2B 3' },
      { id: 'b2b5', type: 'image', src: '/images/projects/b2b/b2b-project-4.jpg', alt: 'Proyecto IA B2B 4', link: '/projects/b2b-detail-3' },
    ],
  },
];

export default function ProjectsPage() {
  const { t } = useTranslation('common');
  const { triggerChatbot } = useChatbot(); 

  const handleCuriosityClick = (projectTitleKey, projectIntroKey, projectId) => {
    const projectName = t(projectTitleKey);
    const introMessageText = t(projectIntroKey, `Me gustaría saber más sobre el proyecto: ${projectName}.`);
    triggerChatbot(introMessageText, projectId); 
  };

  return (
    <>
      <Head>
        {/* Asegúrate de que el contenido de la etiqueta title sea un solo string */}
        <title>{`${t('projects_page_title', 'Nuestros Proyectos')} - NexoAI`}</title>
        <meta name="description" content={t('projects_page_meta_desc', 'Explora proyectos innovadores de IA entregados por NexoAI.')} />
      </Head>

      <main className={styles.projectsPage}>
        <header className={styles.pageHeader}>
          <h1>{t('projects_page_main_title', 'Nuestro Trabajo y Casos de Estudio')}</h1>
          <p>{t('projects_page_intro_desc', 'En NexoAI, ...crecer.')}</p>
        </header>

        <div className={styles.sectionsContainer}>
          {projectSectionsData.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className={styles.projectSectionCard}
            >
              <div className={styles.sectionDescriptionContainer}>
                <h2>{t(section.titleKey)}</h2>
                <p>{t(section.descriptionKey)}</p>
              </div>
              <div className={styles.collageContainer}>
                {section.collageItems.map((item) => (
                  <div key={item.id} className={`${styles.collageItem} ${styles[item.id] || ''}`}>
                    {item.link ? (
                      <Link href={item.link} legacyBehavior>
                        <a className={styles.collageLink}>
                          {item.type === 'image' && item.src && (
                            <Image 
                              src={item.src} 
                              alt={item.alt || t(item.titleKey) || ''} 
                              width={300}
                              height={200}
                              objectFit="cover" 
                              className={styles.collageImage} 
                            />
                          )}
                          {item.type === 'link' && (
                             <div className={styles.linkCardContent}>
                               {t(item.titleKey, item.text || 'Saber Más')}
                             </div>
                          )}
                          {item.type === 'image' && item.src && (
                            <div className={styles.imageOverlay}>
                                <span className={styles.imageOverlayText}>{item.alt || t(item.titleKey) || ''}</span>
                            </div>
                          )}
                        </a>
                      </Link>
                    ) : (
                      item.type === 'image' && item.src && (
                        <div className={styles.collageImageContainer}>
                          <Image 
                            src={item.src} 
                            alt={item.alt || ''} 
                            width={300}
                            height={200}
                            objectFit="cover" 
                            className={styles.collageImage} 
                          />
                          <div className={styles.imageOverlay}>
                            <span className={styles.imageOverlayText}>{item.alt || ''}</span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ))}
              </div>

              <div className={cardStyles.curiositySection}>
                <p className={cardStyles.curiosityText}>{t('project_card_curiosity_text', '¿Tienes curiosidad?')}</p>
                <button
                  onClick={() => handleCuriosityClick(section.titleKey, section.introMessageKey, section.id)}
                  className={cardStyles.curiosityButton}
                  aria-label={`${t('project_card_ask_chatbot_aria', 'Preguntar al chatbot sobre')} ${t(section.titleKey)}`}
                >
                  <FiChevronsRight size={24} />
                  <span>{t('project_card_ask_button', 'Preguntar al Asistente')}</span>
                </button>
              </div>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}

export async function getStaticProps({ locale }) {
  const requiredKeys = [
    'projects_page_title', 'projects_page_meta_desc', 'projects_page_main_title',
    'projects_page_intro_desc', 'project1_title', 'project2_title', 'project3_title',
    'projects_section_education_desc', 'projects_section_hospitality_desc',
    'projects_section_b2b_desc', 'project_detail_generic_link',
    'chatbot_name', 'chatbot_open_chat', 'chatbot_close_chat', 
    'chatbot_input_placeholder', 'chatbot_send_message', 'chatbot_simulated_response',
    'chatbot_generic_greeting', 
    'project_card_curiosity_text', 'project_card_ask_button', 'project_card_ask_chatbot_aria',
    'project_intro_education', 'project_intro_hospitality', 'project_intro_b2b',
    // Añade aquí cualquier otra clave que necesites precargar para la traducción
  ];
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'], null, requiredKeys)),
    },
  };
}
