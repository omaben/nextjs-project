import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { English } from "./translation/en";
import { Frensh } from "./translation/fr";

const resources = {
  en: {
    translation: {
      ...English
    },
  },
  fr: {
    translation: {
      ...Frensh
    },
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});
