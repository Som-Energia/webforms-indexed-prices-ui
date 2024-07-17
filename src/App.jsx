import React from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { TariffNameContextProvider } from './components/TariffNameContextProvider'
import IndexedDailyPrices from './pages/IndexedDailyPrices'
import IndexedHistoricPrices from './pages/IndexedHistoricPrices'
import TestPage from './pages/TestPage'
import SomenergiaTheme from './components/SomenergiaTheme'

const router = createBrowserRouter([
  {
    path: '/',
    element: <TestPage />,
  },
  {
    path: '/:language/indexed-daily-prices',
    element: (
      <TariffNameContextProvider>
        <IndexedDailyPrices />
      </TariffNameContextProvider>
    ),
  },
  {
      path: '/:language/tarifes-delectricitat-que-oferim/tarifa-indexada/preu-avui/',
    element: (
      <TariffNameContextProvider>
        <IndexedDailyPrices />
      </TariffNameContextProvider>
    ),
  },
  {
      path: '/:language/tarifas-de-electricidad-que-ofrecemos/tarifa-indexada/precio-hoy/',
    element: (
      <TariffNameContextProvider>
        <IndexedDailyPrices />
      </TariffNameContextProvider>
    ),
  },
  {
      path: '/:language/tarifas-electricas-que-ofrecemos/tarifa-indexada/prezo-hoxe/',
    element: (
      <TariffNameContextProvider>
        <IndexedDailyPrices />
      </TariffNameContextProvider>
    ),
  },
  {
      path: '/:language/eskaintzen-ditugun-elektrizitate-tarifak/tarifa-indexatua/gaurko-prezioa/',
    element: (
      <TariffNameContextProvider>
        <IndexedDailyPrices />
      </TariffNameContextProvider>
    ),
  },
  {
    path: '/:language/indexed-historic-prices',
    element: <IndexedHistoricPrices />,
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
