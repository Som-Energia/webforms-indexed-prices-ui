import { useEffect, useState } from 'react'
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
      // TODO: get that day from a date picker
      const calendarDay = '2023-10-30'
      const transformedData = transformIndexedTariffPrices(data, calendarDay)
      setIndexedTariffPrices(transformedData)
    }
    getPrices()
  }, [])
  console.log(indexedTariffPrices)
  return (
    <Container maxWidth="md" disableGutters={true}>
      <TariffSelector/>
    <>
      {/* TODO: Y Axis legend */}
      {indexedTariffPrices ? (
        <Chart data={indexedTariffPrices} lang="ca" period="DAILY" type="BAR" />
      ) : (
        <Loading />
      )}
      </>
  )
}
