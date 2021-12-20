import i18n, { Resource } from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const languages = import.meta.globEager("./locales/*.ts");
const resources: Resource = {};
Object.values(languages).forEach((language) => {
  resources[language.config.code] = {
    translation: language.default,
  };
});

let lang = navigator.language.split(/[-_]/)[0];

if (!resources[lang]) {
  lang = "en";
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: lang, // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
