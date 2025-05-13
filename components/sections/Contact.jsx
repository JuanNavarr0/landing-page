// components/sections/Contact.jsx
import { useTranslation } from 'next-i18next';
import styles from './Contact.module.css';
import { useState } from 'react';

export default function Contact() {
  const { t } = useTranslation('common');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section className={styles.contactSection} id="contact">
      <div className={styles.container}>
        <h2 className={styles.title}>{t('contact_title', 'Hablemos')}</h2>
        <p className={styles.subtitle}>
          {t('contact_subtitle', 'Estamos aquí para ayudarte a integrar la IA en tu negocio.')}
        </p>

        {/* MODIFICADO: El contentWrapper ahora solo contiene el formulario */}
        <div className={styles.contentWrapper}>
          <div className={styles.formColumn}> {/* Mantenemos formColumn por si tiene estilos específicos que queramos conservar */}
            {isSubmitted && (
              <p className={styles.successMessage}>{t('contact_success', '¡Mensaje enviado! Gracias.')}</p>
            )}
            <form onSubmit={handleSubmit} className={styles.contactForm}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>
                  {t('contact_label_name', 'Nombre')}
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={styles.input}
                  placeholder={t('contact_placeholder_name', 'Tu nombre completo')}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  {t('contact_label_email', 'Email')}
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={styles.input}
                  placeholder={t('contact_placeholder_email', 'tu@email.com')}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.label}>
                  {t('contact_label_message', 'Mensaje')}
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className={styles.textarea}
                  placeholder={t('contact_placeholder_message', 'Cuéntanos sobre tu proyecto...')}
                ></textarea>
              </div>
              <button type="submit" className={styles.submitButton}>
                {t('contact_button_send', 'Enviar Mensaje')}
              </button>
            </form>
          </div>
          {/* Columna del Chatbot Placeholder ELIMINADA */}
        </div>
        {/* Puedes añadir un texto alternativo de contacto aquí si lo deseas, fuera del grid */}
        <p className={styles.alternativeContact}>
            {t('contact_info_email_intro_alternative', 'Si lo prefieres, también puedes enviarnos un email directamente a:')}{' '}
            <a href="mailto:hola@nexoai.com">hola@nexoai.com</a>
        </p>
      </div>
    </section>
  );
}