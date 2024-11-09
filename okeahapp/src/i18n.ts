import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'fr', // Langue par défaut
    lng: 'fr', // Initialiser la langue par défaut
    supportedLngs: ['en', 'fr'], // Langues supportées
    debug: true, // Active le mode debug
    interpolation: {
      escapeValue: false, // React s'occupe déjà de l'échappement
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json'
    }
  });

export default i18n;