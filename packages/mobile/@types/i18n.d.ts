import "i18next"
import en from "@/i18n/en.json"

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "en"
    resources: {
      en: typeof en
    }
  }
}
