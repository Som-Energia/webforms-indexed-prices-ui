import i18n from '../../i18n/i18n'
import { Link } from 'react-router-dom'

export default function TestPage() {
  let language = navigator.language
  const availableLanguages = Object.keys(i18n.options.resources)
  if (!availableLanguages.includes(language)) {
    language = 'es'
  }
  return (
    <ul>
      <li>
        <Link to={`${language}/indexed-daily-prices`}>Indexed Daily Prices</Link>
      </li>
      <li>
        <a href={`${language}/indexed-historic-prices`}>Indexed Historic Prices</a>
      </li>
    </ul>
  )
}
