import React, { useState, useEffect } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { useTariffNameContext } from './TariffNameContextProvider'
import { useTranslation } from 'react-i18next'
import i18n from '../i18n/i18n'
import { useParams } from 'react-router-dom'
import { Tariffs, DefaultTariff } from '../data/tariff'

function TariffSelector() {
  const { t, i18n } = useTranslation()
  const { language } = useParams()
  const { tariffName, setTariffName } = useTariffNameContext()

  const tariffsVariant = {}
  for (const [key, value] of Object.entries(Tariffs)) {
    tariffsVariant[key] = value == DefaultTariff ? 'contained' : 'outlined'
  }
  const [variant, setVariant] = useState(tariffsVariant)

  const handleClick = (tariffName) => {
    for (const [key, value] of Object.entries(Tariffs)) {
      tariffsVariant[key] = value == tariffName ? 'contained' : 'outlined'
    }
    setVariant(tariffsVariant)
    setTariffName(tariffName)
  }

  const computeBackgroundColor = (variant) =>
    variant === 'contained' ? '#BAC92A' : '#666666'
  const computeTextColor = (variant) => (variant === 'contained' ? 'black' : 'white')

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language])

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={{ xs: 1, sm: 2, md: 6 }}
      justifyContent="center"
    >
      {Object.entries(Tariffs).map(([tariffKey, tariffName]) => (
        <Button
          variant={variant[tariffKey]}
          key={tariffKey}
          sx={{
            color: computeTextColor(variant[tariffKey]),
            background: computeBackgroundColor(variant[tariffKey]),
            '&:hover': {
              backgroundColor: computeBackgroundColor(variant[tariffKey]),
            },
          }}
          onClick={() => handleClick(tariffName)}
        >
          {t('TARIFF_SELECTOR.' + tariffKey)}
        </Button>
      ))}
    </Stack>
  )
}

export default TariffSelector
