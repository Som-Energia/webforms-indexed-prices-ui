import React, { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import Chart from '@somenergia/somenergia-ui/Chart'
import Loading from '@somenergia/somenergia-ui/Loading'
import { getIndexedTariffPrices } from '../../services/api'
import { transformIndexedTariffPrices } from '../../services/utils'
import TariffSelector from '../../components/TariffSelector'

export default function IndexedDailyPrices() {
  const [indexedTariffPrices, setIndexedTariffPrices] = useState(false)

  useEffect(() => {
    const getPrices = async () => {
      const data = await getIndexedTariffPrices({ tariff: '2.0TD', geoZone: 'PENINSULA' })
      const transformedData = transformIndexedTariffPrices(data)
      setIndexedTariffPrices(transformedData)
    }
    getPrices()
  }, [])

  return (
    <Container maxWidth="md" disableGutters={true}>
      <TariffSelector/>
      {/* TODO: Y Axis legend */}
      {indexedTariffPrices ? (
        <Chart data={indexedTariffPrices} lang="ca" period="DAILY" type="BAR" />
      ) : (
        <Loading />
      )}
    </Container>
  )
}
