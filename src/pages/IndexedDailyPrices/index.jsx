import React, { useEffect, useState } from 'react'
import Chart from '@somenergia/somenergia-ui/Chart'
import Loading from '@somenergia/somenergia-ui/Loading'
import { getCompensationIndexedPrices, getIndexedTariffPrices } from '../../services/api'
import { transformIndexedTariffPrices } from '../../services/utils'
import TariffSelector from '../../components/TariffSelector'
import { useTariffNameContext } from '../../components/TariffNameContextProvider'

export default function IndexedDailyPrices() {
  const { tariffName } = useTariffNameContext()
  const [indexedTariffPrices, setIndexedTariffPrices] = useState(false)

  useEffect(() => {
    const getPrices = async (tariffName) => {
      const calendarDay = '2024-03-14' //TODO: get that day from a date picker

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
  return (
    <>
      <TariffSelector />
      <br />
      {indexedTariffPrices ? (
        <Chart
          data={indexedTariffPrices}
          period="DAILY"
          type="BAR"
          Ylegend={'€/kWh'}
          showTooltipKeys={false}
        />
      ) : (
        <Loading />
      )}
    </>
  )
}
