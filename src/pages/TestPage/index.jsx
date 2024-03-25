import i18n from '../../i18n/i18n'

export default function TestPage(){
  let language = navigator.language
  const availableLanguages = Object.keys(i18n.i18n.options.resources)
  if (!availableLanguages.includes(language)) {
    language = 'es'
  }
  return (
    <ul>
      <li><a href={`${language}/indexed-daily-prices`}>Indexed Daily Prices</a></li>
      <li><a href={`${language}/indexed-historic-prices`}>Indexed Historic Prices</a></li>
    </ul>
  )
}