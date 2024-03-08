import React, { useState, useEffect } from 'react'
// import { useTranslation } from 'react-i18next'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import {useTariffNameContext} from './TariffNameContextProvider'
// import i18n from '../i18n/i18n'

function TariffSelector() {

  const {tariffName, setTariffName} = useTariffNameContext()

  const Tariffs = {
    TARIFF_20TD: 'tariff20TD',
    TARIFF_30TD: 'tariff30TD',
    SURPLUS_COMPENSATION: 'surplusCompensation',
  };

  const [variant, setVariant] = useState({
    TARIFF_20TD: 'contained',
    TARIFF_30TD: 'outlined',
    SURPLUS_COMPENSATION: 'outlined',
  })

  const handleClick = (tariffName) => {
    setVariant(variant => ({
      TARIFF_20TD: tariffName === Tariffs.TARIFF_20TD ? 'contained' : 'outlined',
      TARIFF_30TD: tariffName === Tariffs.TARIFF_30TD ? 'contained' : 'outlined',
      SURPLUS_COMPENSATION: tariffName === Tariffs.SURPLUS_COMPENSATION ? 'contained' : 'outlined',
    }))
    setTariffName(tariffName)
  }

  const computeBackgroundColor = (variant) => {
    if (variant === 'contained') {
      return '#BAC92A';
    }
    return '#666666';
  }

  const computeTextColor = (variant) => {
    if (variant === 'contained') {
      return 'black';
    }
    return 'white';
  }

  useEffect(() => {
    setTariffName(Tariffs.TARIFF_20TD);
  }, []);

  return (
    <Stack 
      direction={{ xs: 'column', sm: 'row' }}
      spacing={{ xs: 1, sm: 2, md: 4 }} 
      justifyContent="center"
    >
      <Button 
        variant={variant.TARIFF_20TD}
        sx={{ 
          borderRadius: 0,
          color: computeTextColor(variant.TARIFF_20TD),
          background: computeBackgroundColor(variant.TARIFF_20TD),
          '&:hover': {
            backgroundColor: computeBackgroundColor(variant.TARIFF_20TD),
          },
        }}
        onClick={() => handleClick(Tariffs.TARIFF_20TD)} >
          2.0TD
      </Button>

      <Button 
        variant={variant.TARIFF_20TD} 
        sx={{ 
          borderRadius: 0,
          color: computeTextColor(variant.TARIFF_30TD),
          background: computeBackgroundColor(variant.TARIFF_30TD),
          '&:hover': {
            backgroundColor: computeBackgroundColor(variant.TARIFF_30TD),
          },
        }}
        onClick={() => handleClick(Tariffs.TARIFF_30TD)} >
          3.0TD
      </Button>

      <Button 
        variant={variant.SURPLUS_COMPENSATION} 
        sx={{
          borderRadius: 0,
          color: computeTextColor(variant.SURPLUS_COMPENSATION),
          background: computeBackgroundColor(variant.SURPLUS_COMPENSATION),
          '&:hover': {
            backgroundColor: computeBackgroundColor(variant.SURPLUS_COMPENSATION),
          },
        }}
        onClick={() => handleClick(Tariffs.SURPLUS_COMPENSATION)}>
          TARIFF_SELECTOR.SURPLUS_COMPENSATION
      </Button>
    </Stack>
  )
}

export default TariffSelector