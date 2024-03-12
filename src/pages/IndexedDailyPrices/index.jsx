import React from 'react'
import Container from "@mui/material/Container"
import TariffSelector from '../../components/TariffSelector'

export default function IndexedDailyPrices(){
  return (
    <Container maxWidth="md" disableGutters={true}>
      <TariffSelector/>
    </Container>

  )
}

