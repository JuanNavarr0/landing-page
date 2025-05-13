// pages/index.jsx
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Hero from '../components/sections/Hero';
import Showcase from '../components/sections/Showcase';
import Contact from '../components/sections/Contact'; // Importa Contact

export default function Home() {
  const { t } = useTranslation('common');

  return (
    <>
      <Head>
        <title>NexoAI - {t('hero_title_line1')}</title>
        <meta name="description" content={t('hero_subtitle')} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Hero />
      <Showcase />
      <Contact /> {/* Añade Contact aquí */}

      {/* Aquí podrían ir más secciones como "Equipo", "Testimonios" etc. */}
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}