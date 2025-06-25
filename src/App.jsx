import React from 'react'
import i18n from './i18n/i18n'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { TariffNameContextProvider } from './components/TariffNameContextProvider'
import IndexedDailyPrices from './pages/IndexedDailyPrices'
import SomenergiaTheme from './components/SomenergiaTheme'

const urls = [
  '/:language/tarifes-delectricitat-que-oferim/tarifa-indexada/preu-avui/',
  '/:language/tarifas-de-electricidad-que-ofrecemos/tarifa-indexada/precio-hoy/',
  '/:language/tarifas-electricas-que-ofrecemos/tarifa-indexada/prezo-hoxe/',
  '/:language/eskaintzen-ditugun-elektrizitate-tarifak/tarifa-indexatua/gaurko-prezioa/',
]

const router = createBrowserRouter([
  {
    path: '/:language/*',
    element: (
      <TariffNameContextProvider>
        <IndexedDailyPrices />
      </TariffNameContextProvider>
    ),
  },
])

function App() {
  return (
    <React.StrictMode>
      <ThemeProvider theme={SomenergiaTheme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </React.StrictMode>
  )
}

export default App
