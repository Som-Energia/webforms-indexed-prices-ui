import React, { useEffect } from 'react'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { useTariffNameContext } from './TariffNameContextProvider'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Tariffs } from '../data/tariff'

function TariffSelector() {
  const { t, i18n } = useTranslation()
  const { language } = useParams()
  const { tariffName, setTariffName } = useTariffNameContext()

  const handleClick = (tariffName) => {
    setTariffName(tariffName)
  }

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language])

  const selectedTariff = tariffName

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={{ xs: 1, sm: 2, md: 6 }}
      justifyContent="center"
    >
      {Object.entries(Tariffs).map(([tariffKey, tariffName]) => (
        <Button
          variant="contained"
          key={tariffKey}
          data-cy={"button-"+tariffName}
          color={selectedTariff === tariffName ? 'primary' : 'secondary'}
          sx={{
            '@media (min-width: 600px)': {
              width: '150px',
              padding: '0.4em 0em 0.4em 0em',
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
