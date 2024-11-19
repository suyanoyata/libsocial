import "i18next";
import ru from "@/intl/ru.json";
import en from "@/intl/en.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "en";
    resources: {
      ru: typeof ru;
      en: typeof en;
    };
  }
}
