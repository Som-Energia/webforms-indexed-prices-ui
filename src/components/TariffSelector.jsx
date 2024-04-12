import React from 'react'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { useTariffNameContext } from './TariffNameContextProvider'
import { Tariffs } from '../data/tariff'
import i18n from '../i18n/i18n'

function TariffSelector() {
  const t = i18n.t
  const { tariffName, setTariffName } = useTariffNameContext()

  const handleClick = (tariffName) => {
    setTariffName(tariffName)
  }

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
