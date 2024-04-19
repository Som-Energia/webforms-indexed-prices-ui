import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_APP_API_BASE_URL ||
  window?.config?.API_BASE_URL.replace?.(/\/$/, '')

export const getIndexedTariffPrices = async ({ tariff, geoZone }) => {
  return axios({
    method: 'GET',
    url: `${API_BASE_URL}/data/indexed_prices`,
    withCredentials: false,
    params: {
      tariff: tariff,
      geo_zone: geoZone,
    },
  })
    .catch((error) => {
      throw error
    })
    .then((response) => {
      if (response.error !== undefined) {
        throw response
      }
      return response?.data?.data
    })
}

export const getCompensationIndexedPrices = async ({ geoZone }) => {
  return axios({
    method: 'GET',
    url: `${API_BASE_URL}/data/compensation_indexed_prices`,
    withCredentials: false,
    params: {
      geo_zone: geoZone,
    },
  })
    .catch((error) => {
      throw error
    })
    .then((response) => {
      if (response.error !== undefined) {
        throw response
      }
      return response?.data?.data
    })
}
