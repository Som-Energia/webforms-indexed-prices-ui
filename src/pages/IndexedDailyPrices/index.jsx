import React, { useEffect, useState } from 'react'
import Chart from '@somenergia/somenergia-ui/Chart'
import SumPricesDisplay from '@somenergia/somenergia-ui/SumPricesDisplay'
import Loading from '@somenergia/somenergia-ui/Loading'
import { getCompensationIndexedPrices, getIndexedTariffPrices } from '../../services/api'
import { transformIndexedTariffPrices, computeTotals } from '../../services/utils'
import TariffSelector from '../../components/TariffSelector'
import { useTariffNameContext } from '../../components/TariffNameContextProvider'
import { useTranslation } from 'react-i18next'
import SomDatePicker from '@somenergia/somenergia-ui/SomDatePicker'
import Box from '@mui/material/Box'
import dayjs from 'dayjs'

export default function IndexedDailyPrices() {
  const { tariffName } = useTariffNameContext()

  const [firstDate, setFirstDate] = useState(null)
  const [prices, setPrices] = useState(null)
  const [calendarDay, setCalendarDay] = useState(dayjs().endOf('day'))
  const { t } = useTranslation()

  const totalPrices = React.useMemo(() => {
    if (!firstDate) return false
    return computeTotals(firstDate, calendarDay, prices)
  }, [firstDate, calendarDay, prices])

  const indexedTariffPrices = React.useMemo(() => {
    if (!firstDate) return false
    return transformIndexedTariffPrices(firstDate, calendarDay, prices)
  }, [firstDate, calendarDay, prices])

  const referenceLineData = [
    {
      value: indexedTariffPrices.week_average,
      color: 'blue',
      stroke: '3 3',
      strokeWidth: 2,
      text: t('CHART.WEEKLY_AVERAGE_LEGEND'),
    },
    {
      value: indexedTariffPrices.day_average,
      color: 'blue',
      stroke: '0',
      strokeWidth: 2,
      text: t('CHART.DAILY_AVERAGE_LEGEND'),
    },
  ]

  const totalPricesData = [
    {
      value: totalPrices['MIN'],
      unit: '€/kWh',
      description: t('SUMPRICESDISPLAY.TOTAL_MIN'),
    },
    {
      value: totalPrices['MAX'],
      unit: '€/kWh',
      description: t('SUMPRICESDISPLAY.TOTAL_MAX'),
    },
    {
      value: totalPrices['AVERAGE'],
      unit: '€/kWh',
      description: t('SUMPRICESDISPLAY.TOTAL_AVERAGE'),
    },
    {
      value: totalPrices['WEEKLY_AVERAGE'],
      unit: '€/kWh',
      description: t('SUMPRICESDISPLAY.TOTAL_WEEKLY_AVERAGE'),
    },
  ]

  useEffect(() => {
    const getPrices = async (tariffName) => {
      if (tariffName === 'surplusCompensation') {
        const data = await getCompensationIndexedPrices({
          geoZone: 'PENINSULA',
        })
        setFirstDate(data.first_date)
        setPrices(data.curves.compensation_euros_kwh)
      } else {
        const data = await getIndexedTariffPrices({
          tariff: tariffName,
          geoZone: 'PENINSULA',
        })
        setFirstDate(data.first_date)
        setPrices(data.curves.price_euros_kwh)
      }
    }
    getPrices(tariffName)
  }, [tariffName])

  return (
    <>
      <TariffSelector />
      <Box margin={8} display="flex" justifyContent="center" alignItems="center">
        <SomDatePicker
          firstDate={dayjs().subtract(7, 'day').startOf('day')}
          lastDate={dayjs().add(1, 'day').endOf('day')}
          period="DAILY"
          currentTime={calendarDay}
          setCurrentTime={setCalendarDay}
        />
      </Box>
      {indexedTariffPrices ? (
        <>
          <Chart
            data={indexedTariffPrices}
            period="DAILY"
            type="BAR"
            Ylegend={'€/kWh'}
            legend={true}
            showTooltipKeys={false}
            referenceLineData={referenceLineData}
          />
          <Box>
            <SumPricesDisplay totalPrices={totalPricesData} />
          </Box>
        </>
      ) : (
        <Loading />
      )}
    </>
  )
}
