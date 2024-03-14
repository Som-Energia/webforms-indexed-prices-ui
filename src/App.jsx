import React from 'react'
import {
  RouterProvider,
  createBrowserRouter
} from 'react-router-dom'
import './App.css'
import { TariffNameContextProvider } from './components/TariffNameContextProvider'
import IndexedDailyPrices from './pages/IndexedDailyPrices'
import IndexedHistoricPrices from './pages/IndexedHistoricPrices'
import TestPage from './pages/TestPage'
import i18n from './i18n/i18n'


const router = createBrowserRouter([
  {
    path: "/:language",
    element: <TestPage />,
  },
  {
    path: "/:language/indexed-daily-prices",
    element: (
      <TariffNameContextProvider>
        <IndexedDailyPrices />
      </TariffNameContextProvider>
    ),
  },
  {
    path: "/:language/indexed-historic-prices",
    element: <IndexedHistoricPrices />,
  },
])

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  )
}

export default App
