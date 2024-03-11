import React, { createContext, useState, useContext } from 'react'
import Tariffs from '../data/tariff'

const TariffNameContext = createContext()

export const TariffNameContextProvider = ({ children }) => {
  const [tariffName, setTariffName] = useState(Tariffs.TARIFF_20TD);

  return (
    <TariffNameContext.Provider value={{ tariffName, setTariffName }}>
      {children}
    </TariffNameContext.Provider>
  )
}

export const useTariffNameContext = () => useContext(TariffNameContext);