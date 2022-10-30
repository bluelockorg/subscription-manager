import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import en from "./assets/_locales/en.json";
import es from "./assets/_locales/es.json";
import fr from "./assets/_locales/fr.json";
import ja from "./assets/_locales/ja.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translations: en },
      ja: { translations: ja },
      fr: { translations: fr },
      es: { translations: es },
    },
    fallbackLng: "en",
    debug: true,

    ns: ["translations"],
    defaultNS: "translations",

    keySeparator: false,

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
