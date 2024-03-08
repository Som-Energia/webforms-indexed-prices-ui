import React, { createContext, useState, useContext } from 'react'

const TariffNameContext = createContext()

export const TariffNameContextProvider = ({ children }) => {
  const [tariffName, setTariffName] = useState()
 
  return (
    <TariffNameContext.Provider value={{ tariffName, setTariffName }}>
      {children}
    </TariffNameContext.Provider>
  )
}

export const useTariffNameContext = () => useContext(TariffNameContext);