import i18n from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const translations = import.meta.glob('./locale-*.yaml', { eager: true })

const resources = Object.fromEntries(
  Object.keys(translations).map((file) => {
    const code = file.slice('./locale-'.length, -'.yaml'.length)
    const translation = translations[file].default
    return [code, { translation }]
  }),
)

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector) // detects language in the browser
  .init({
    resources,
    fallbackLng: 'es', // Comment out to better spot untranslated texts
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    detection: {
      order: [
        'querystring',
        'cookie',
        'localStorage',
        'sessionStorage',
        'navigator',
        'htmlTag',
        'path',
        'subdomain',
      ],
      lookupQuerystring: 'lang',
    },
  })

function addTranslationFiles(translationFiles) {
  const resources = Object.fromEntries(
    Object.keys(translationFiles).map((key) => {
      const code = key.slice('./locale-'.length, -'.yaml'.length)
      const translation = translationFiles[key].default
      return [code, { translation }]
    }),
  )

  for (const [lang, entries] of Object.entries(resources)) {
    i18n.addResourceBundle(
      lang,
      'translation', // namespace
      entries.translation, // resources
      true, // deep
      true, // overwrite
    )
  }
}

export { i18n, addTranslationFiles, useTranslation }
export default { i18n, addTranslationFiles, useTranslation }
