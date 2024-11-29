import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ru from "@/intl/ru.json";
import en from "@/intl/en.json";

const resources = {
  ru: { translation: ru },
  en: { translation: en },
};

const initI18n = async () => {
  i18n.use(initReactI18next).init({
    compatibilityJSON: "v3",
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;
