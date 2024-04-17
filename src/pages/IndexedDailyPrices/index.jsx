import React, { useEffect, useState } from 'react'
import Chart from '@somenergia/somenergia-ui/Chart'
import SumPricesDisplay from '@somenergia/somenergia-ui/SumPricesDisplay'
import Loading from '@somenergia/somenergia-ui/Loading'
import { getCompensationIndexedPrices, getIndexedTariffPrices } from '../../services/api'
import { transformIndexedTariffPrices, computeTotals, dayIsMissing } from '../../services/utils'
import TariffSelector from '../../components/TariffSelector'
import { useTariffNameContext } from '../../components/TariffNameContextProvider'
import { useParams } from 'react-router-dom'
import SomDatePicker from '@somenergia/somenergia-ui/SomDatePicker'
import DizzyError from '@somenergia/somenergia-ui/DizzyError'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

export default function IndexedDailyPrices() {
  const { tariffName } = useTariffNameContext()
  const { language } = useParams()

  const [firstDate, setFirstDate] = useState(null)
  const [prices, setPrices] = useState(null)
  const [calendarDay, setCalendarDay] = useState(dayjs().startOf('day'))
  const { t, i18n } = useTranslation()

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
      text: t('CHART.WEEKLY_AVERAGE_LEGEND', { base_days_computation: indexedTariffPrices['base_days_computation'] }),
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
      description: t('SUMPRICESDISPLAY.TOTAL_WEEKLY_AVERAGE', { base_days_computation: totalPrices['BASE_DAYS_COMPUTATION'] }),
    },
  ]

  const [error, setError] = useState(false)

  useEffect(() => {
    i18n.changeLanguage(language)
    const getPrices = async (tariffName) => {
      setError(false)
      if (tariffName === 'surplusCompensation') {
        const data = await getCompensationIndexedPrices({
          geoZone: 'PENINSULA',
        })
        setFirstDate(data.first_date)
        setPrices(data.curves.compensation_euros_kwh)
      } else {
        try {

          const data = await getIndexedTariffPrices({
            tariff: tariffName,
            geoZone: 'PENINSULA',
          })
          setFirstDate(data.first_date)
          setPrices(data.curves.price_euros_kwh)

        } catch (error) {
          setError(true)
        }

      }
    }
    getPrices(tariffName)
  }, [tariffName, language])

  const ErrorBox = ({ message }) => (
    <Box sx={{ textAlign: 'center' }}>
      <DizzyError />
      <Typography>{message}</Typography>
    </Box>
  );

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

      {
        error ? (
          <ErrorBox message={t('API.ERROR_FETCHING_DATA')} />
        ) : (
          !indexedTariffPrices ? (
            <Loading />
          ) : (
            !dayIsMissing(indexedTariffPrices.periods) ? (
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
                <SumPricesDisplay totalPrices={totalPricesData} />
              </>
            ) : (
              <ErrorBox message={t('PRICES.ERROR_MISSING_DATA')} />
            )
          )
        )
      }

    </>
  )
}
