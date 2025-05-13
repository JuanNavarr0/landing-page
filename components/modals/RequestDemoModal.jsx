// components/modals/RequestDemoModal.jsx
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import styles from './RequestDemoModal.module.css'; // Crearemos este CSS
import { FiX } from 'react-icons/fi';

export default function RequestDemoModal({ isOpen, onClose }) {
  const { t } = useTranslation('common');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '', // Campo opcional: nombre de la empresa
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setIsSubmitted(false);

    try {
      // Aquí es donde harías la llamada a tu API endpoint
      // Por ejemplo:
      const response = await fetch('/api/request-demo', { // Necesitarás crear este endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', company: '' });
      } else {
        const result = await response.json();
        setError(result.message || t('error_submitting_demo_request', 'Error al enviar la solicitud. Inténtalo de nuevo.'));
      }
    } catch (err) {
      console.error('Request Demo submission error:', err);
      setError(t('error_submitting_demo_request_network', 'Error de red. Por favor, comprueba tu conexión.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label={t('close_modal', 'Cerrar')}>
          <FiX size={24} />
        </button>
        <h3 className={styles.modalTitle}>{t('request_demo_title', 'Solicitar una Demo')}</h3>
        
        {isSubmitted ? (
          <p className={styles.successMessage}>{t('demo_request_success', '¡Solicitud enviada! Nos pondremos en contacto pronto.')}</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <p className={styles.modalSubtitle}>{t('request_demo_subtitle', 'Déjanos tus datos y te contactaremos para agendar una demostración personalizada.')}</p>
            <div className={styles.formGroup}>
              <label htmlFor="demo_name">{t('contact_label_name', 'Nombre')}</label>
              <input
                type="text"
                id="demo_name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder={t('contact_placeholder_name', 'Tu nombre completo')}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="demo_email">{t('contact_label_email', 'Email')}</label>
              <input
                type="email"
                id="demo_email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder={t('contact_placeholder_email', 'tu@email.com')}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="demo_company">{t('request_demo_label_company', 'Empresa (Opcional)')}</label>
              <input
                type="text"
                id="demo_company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className={styles.input}
                placeholder={t('request_demo_placeholder_company', 'Nombre de tu empresa')}
              />
            </div>
            {error && <p className={styles.errorMessage}>{error}</p>}
            <button type="submit" className={styles.submitButtonModal} disabled={isLoading}>
              {isLoading ? t('sending', 'Enviando...') : t('request_demo_cta_button', 'Solicitar Demo')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}