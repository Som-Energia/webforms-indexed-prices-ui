import React, { useEffect, useState } from 'react'
import Chart from '@somenergia/somenergia-ui/Chart'
import Loading from '@somenergia/somenergia-ui/Loading'
import { getCompensationIndexedPrices, getIndexedTariffPrices } from '../../services/api'
import { transformIndexedTariffPrices } from '../../services/utils'
import TariffSelector from '../../components/TariffSelector'
import { Container } from '@mui/material'
import { useTariffNameContext } from '../../components/TariffNameContextProvider'

export default function IndexedDailyPrices() {
  const { tariffName } = useTariffNameContext()
  const [indexedTariffPrices, setIndexedTariffPrices] = useState(false)

  useEffect(() => {
    const getPrices = async (tariffName) => {
      console.log('tariffName', tariffName)
      const calendarDay = '2023-11-22' //TODO: get that day from a date picker

      if (tariffName === 'surplusCompensation') {
        const data = await getCompensationIndexedPrices({
          geoZone: 'PENINSULA',
        })
        const transformedData = transformIndexedTariffPrices(
          data.first_date,
          calendarDay,
          data.curves.compensation_euros_kwh,
        )
        setIndexedTariffPrices(transformedData)
      } else {
        const data = await getIndexedTariffPrices({
          tariff: tariffName,
          geoZone: 'PENINSULA',
        })
        const transformedData = transformIndexedTariffPrices(
          data.first_date,
          calendarDay,
          data.curves.price_euros_kwh,
        )
        setIndexedTariffPrices(transformedData)
      }
    }
    getPrices(tariffName)
  }, [tariffName])

  console.log(indexedTariffPrices)

  return (
    <Container maxWidth="md" disableGutters={true}>
      <TariffSelector />
      {/* TODO: Y Axis legend */}
      {indexedTariffPrices ? (
        <Chart
          data={indexedTariffPrices}
          lang="ca"
          period="DAILY"
          type="BAR"
          Ylegend={'€/kWh'}
          showTooltipKeys={false}
        />
      ) : (
        <Loading />
      )}
    </Container>
  )
}
