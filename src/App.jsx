import React from 'react'
import {
  RouterProvider,
  createBrowserRouter
} from 'react-router-dom'
import './App.css'
//import i18n from './i18n/i18n'
//import { useTranslation } from 'react-i18next'
import IndexedDailyPrices from './pages/IndexedDailyPrices'
import IndexedHistoricPrices from './pages/IndexedHistoricPrices'
import TestPage from './pages/TestPage'

const router = createBrowserRouter([
  {
    path: "/",
    element: <TestPage />,
  },
  {
    path: "indexed-daily-prices",
    element: <IndexedDailyPrices />,
  },
  {
    path: "indexed-historic-prices",
    element: <IndexedHistoricPrices />,
  },
])

function App() {
  //const { t, i18n } = useTranslation()

  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  )
}

export default App
