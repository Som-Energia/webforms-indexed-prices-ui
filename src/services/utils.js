export function transformIndexedTariffPrices(indexedTariffPrices) {
  console.log('indexedTariffPrices', indexedTariffPrices)
  console.log('curves', indexedTariffPrices.curves)
  // TODO: remove this, we use these mocked values while we do not have data
  let mocked_indexedTariffPrices = {
    first_date: '2024-03-08',
    last_date: '2024-03-08',
    curves: {
      maturity: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      price_euros_kwh: [
        1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4,
      ],
    },
  }
  const first_date = Date.parse(mocked_indexedTariffPrices.first_date)
  // const last_date = Date.parse(mocked_indexedTariffPrices.last_date)

  // TODO: check if this has sense
  let acum = mocked_indexedTariffPrices.curves.price_euros_kwh.reduce(
    (accumulator, currentValue) => {
      return accumulator + currentValue
    },
    0,
  )
  let average = acum / mocked_indexedTariffPrices.curves.price_euros_kwh.length

  // build the periods array of dicts
  let periods = []
  mocked_indexedTariffPrices.curves.price_euros_kwh.forEach((price, index) => {
    // TODO: check why it starts at 1am instead of 0am
    // TODO: it has to start at... 0am, right?

    // hoursToAdd: number we have to add to a datetime to sum 'x' hours
    const hoursToAdd = index * 60 * 60 * 1000 
    // data: dictionary that contains the date, value and "number" (low, up or average)
    let data = {
      date: first_date + hoursToAdd,
      values: price,
    }
    // choose the "number" we need
    if (price + average * 0.1 < average) {
      data['low'] = price
    } else if (price - average * 0.1 > average) {
      data['up'] = price
    } else {
      data['average'] = price
    }
    periods.push(data)
  })

  return {
    fills: {
      low: '#cbdc49',
      average: '#71a150',
      up: '#778462',
    },
    keys: ['low', 'average', 'up'],
    periods: periods,
  }
}
