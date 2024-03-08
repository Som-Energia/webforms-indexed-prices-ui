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

const router = createBrowserRouter([
  {
    path: "/",
    element: <TestPage />,
  },
  {
    path: "/indexed-daily-prices",
    element: (
      <TariffNameContextProvider>
        <IndexedDailyPrices />
      </TariffNameContextProvider>
    ),
  },
  {
    path: "indexed-historic-prices",
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
