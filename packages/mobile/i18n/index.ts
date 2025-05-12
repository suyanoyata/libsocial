import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import en from "@/i18n/en.json"

const resources = {
  en: { translation: en },
}

const initI18n = async () => {
  i18n.use(initReactI18next).init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  })
}

initI18n()

export default i18n
