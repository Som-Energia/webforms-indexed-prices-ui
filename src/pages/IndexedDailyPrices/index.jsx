import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Chart from '@somenergia/somenergia-ui/Chart'
import SumPricesDisplay from '@somenergia/somenergia-ui/SumPricesDisplay'
import Loading from '@somenergia/somenergia-ui/Loading'
import { getCompensationIndexedPrices, getIndexedTariffPrices } from '../../services/api'
import { transformIndexedTariffPrices, computeTotals } from '../../services/utils'
import TariffSelector from '../../components/TariffSelector'
import { useTariffNameContext } from '../../components/TariffNameContextProvider'
import { useTranslation } from 'react-i18next'

export default function IndexedDailyPrices() {
  const { tariffName } = useTariffNameContext()
  const [indexedTariffPrices, setIndexedTariffPrices] = useState(false)
  const [totalPrices, setTotalPrices] = useState(false)

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
        const computedTotals = computeTotals(
          data.first_date,
          calendarDay,
          data.curves.compensation_euros_kwh,
        )
        setTotalPrices(computedTotals)
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
        const computedTotals = computeTotals(
          data.first_date,
          calendarDay,
          data.curves.price_euros_kwh,
        )
        setTotalPrices(computedTotals)
      }
    }
    getPrices(tariffName)
  }, [tariffName])

  const { t } = useTranslation()
  const referenceLineData =[
    {
      value: indexedTariffPrices.week_average,
      color: 'blue',
      stroke: '3 3',
      strokeWidth: 2,
      text: t('CHART.WEEKLY_AVERAGE_LEGEND')
    },
    {
      value: indexedTariffPrices.day_average,
      color: 'blue',
      stroke: '0',
      strokeWidth: 2,
      text: t('CHART.DAILY_AVERAGE_LEGEND')
    }
  ]

  const totalPricesData = [
    {
      value: totalPrices['MIN'],
      unit: '€/kWh',
      description: t('SUMPRICESDISPLAY.TOTAL_MIN')
    },
    {
      value: totalPrices['MAX'],
      unit: '€/kWh',
      description: t('SUMPRICESDISPLAY.TOTAL_MAX')
    },
    {
      value: totalPrices['AVERAGE'],
      unit: '€/kWh',
      description: t('SUMPRICESDISPLAY.TOTAL_AVERAGE')
    },
    {
      value: totalPrices['WEEKLY_AVERAGE'],
      unit: '€/kWh',
      description: t('SUMPRICESDISPLAY.TOTAL_WEEKLY_AVERAGE')
    }
  ]

  return (
    <>
      <TariffSelector />
      <br />
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
          <SumPricesDisplay
            totalPrices={totalPricesData}
          />
        </Box>
        </>
      ) : (
        <Loading />
      )}
    </>
  )
}
