import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import TranslationRo from "./locales/ro/translation.json";
import TranslationRu from "./locales/ru/translation.json";
import TranslationEn from "./locales/en/translation.json";
import LanguageDetector from "i18next-browser-languagedetector";
// don't want to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init

const Languages = ["ro", "ru", "en"];
const resources = {
  ro: {
    translation: TranslationRo,
  },
  ru: {
    translation: TranslationRu,
  },
  en: {
    translation: TranslationEn,
  },
};
i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: "ro",
    debug: true,
    whitelist: Languages,
    resources,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
