import dayjs from 'dayjs'

const PERIOD = 'WEEKLY'
// Percentage for color gradient according to the mean price for the last 7 days
const PERCENTAGE_MEAN = 10 / 100 // 10%

export function getMeasuredData(first_date, selected_day, prices) {
  const [startIndex, endIndex] = sliceIndexes(first_date, PERIOD, dayjs(selected_day))
  return timeSlice(first_date, prices, startIndex, endIndex)
}

function wrongParameterValidation(fromDate, selectedDate, prices) {
  const first_date = new Date(fromDate)
  first_date.setHours(0)
  const selected_day = new Date(selectedDate)
  selected_day.setHours(0)

  if (fromDate === '' || selectedDate === '') {
    return true
  }

  if (prices.length === 0) {
    return true
  }

  if (first_date > selected_day) {
    return true
  }

  return false
}

/**
 * Computes totals based on provided parameters.
 * @param {string} fromDate - The starting date.
 * @param {string} selectedDate - The calendar day.
 * @param {Array<number>} prices - Array of prices.
 * @returns {Object} - The computed total.
 */
export function computeTotals(fromDate, selectedDate, prices) {
  let totalPrices = {
    MIN: '0',
    MAX: '0',
    AVERAGE: '0',
    WEEKLY_AVERAGE: '0',
    BASE_DAYS_COMPUTATION: '0'
  }

  if (wrongParameterValidation(fromDate, selectedDate, prices)) {
    return totalPrices
  }

  let { acum_week, lastWeekPrices, acum_day, dayPrices } = computeBaseValues(fromDate, selectedDate, prices)

  if (acum_week > 0) {
    totalPrices['WEEKLY_AVERAGE'] = String((acum_week / lastWeekPrices.length).toFixed(6))
    totalPrices['BASE_DAYS_COMPUTATION'] = lastWeekPrices.length / 24
  }
  if (acum_day > 0) {
    totalPrices['AVERAGE'] = String((acum_day / dayPrices.length).toFixed(6))
    totalPrices['MAX'] = String((Math.max(...dayPrices.map(item => item.value))).toFixed(6))
    totalPrices['MIN'] = String((Math.min(...dayPrices.map(item => item.value))).toFixed(6))
  }

  return totalPrices
}

function computeBaseValues(fromDate, selectedDate, prices) {
  const first_date = new Date(fromDate)
  first_date.setHours(0)
  const selected_day = new Date(selectedDate)
  selected_day.setHours(0)

  const measured_data = getMeasuredData(first_date, selected_day, prices)

  let lastWeekPrices = []
  let dayPrices = []

  measured_data.forEach((data) => {
    const current_date = new Date(data.date)
    current_date.setHours(0)
    const current_date_day = current_date.getDate()

    lastWeekPrices.push(data)
    if (current_date_day == selected_day.getDate())
      dayPrices.push(data)
  })

  let acum_week = lastWeekPrices.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.value
  }, 0)
  let acum_day = dayPrices.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.value
  }, 0)

  return { acum_week, lastWeekPrices, acum_day, dayPrices }
}

export function transformIndexedTariffPrices(fromDate, selectedDate, prices) {
  let { acum_week, lastWeekPrices, acum_day, dayPrices } = computeBaseValues(fromDate, selectedDate, prices)
  let week_average = acum_week / lastWeekPrices.length
  let day_average = acum_day / dayPrices.length
  const today = new Date();
  today.setMinutes(0, 0, 0);

  // build the periods array of dicts
  let periods = []
  dayPrices.forEach((data) => {
    const pre = today <= data?.date ? '' : 'past_'
    // choose the "number" we need
    if (data.value + week_average * PERCENTAGE_MEAN < week_average) {
      data[`${pre}low`] = data.value
    } else if (data.value - week_average * PERCENTAGE_MEAN > week_average) {
      data[`${pre}up`] = data.value
    } else {
      data[`${pre}average`] = data.value
    }
    periods.push(data)
  })
  // TODO: check where to define these colors
  return {
    fills: {
      low: '#cbdc49',
      average: '#71a150',
      up: '#778462',
      past_low: '#cbdc49bb',
      past_average: '#71a150bb',
      past_up: '#778462bb',
    },
    keys: ['low', 'average', 'up', 'past_low', 'past_average', 'past_up'],
    periods: periods,
    week_average: week_average,
    day_average: day_average,
    base_days_computation: lastWeekPrices.length / 24
  }
}

// FROM SOM REPRESENTA
// TODO: move this to somenergia-ui
export function time2index(referenceTimestamp, timestamp) {
  return (new Date(timestamp) - new Date(referenceTimestamp)) / 60 / 60 / 1000
}

export function index2time(referenceTimestamp, index) {
  return new Date(new Date(referenceTimestamp).getTime() + index * 60 * 60 * 1000)
}

export function array2datapoints(first_timestamp, values, step_ms = 60 * 60 * 1000) {
  const base = first_timestamp.getTime()
  return values.map((value, i) => {
    return {
      date: base + i * step_ms,
      value,
    }
  })
}

export function timeSlice(timeOffset, values, indexStart, indexEnd) {
  var adjustedIndexStart = Math.max(0, indexStart)
  const newTimeOffset = index2time(timeOffset, adjustedIndexStart)
  return array2datapoints(newTimeOffset, values.slice(adjustedIndexStart, indexEnd))
}

export function sliceIndexes(offsetDate, period, currentTime) {
  var [startTime, endTime] = timeInterval(period, currentTime)
  var startIndex = time2index(offsetDate, startTime)
  var endIndex = time2index(offsetDate, endTime)
  return [startIndex, endIndex]
}

export function timeInterval(scope, current_date) {
  const start = new Date(current_date)
  start.setHours(0)
  start.setMinutes(0)
  start.setSeconds(0)
  start.setMilliseconds(0)
  if (scope === 'MONTHLY') {
    start.setDate(1)
  }
  if (scope === 'YEARLY') {
    start.setDate(1) // Month days are 1 based
    start.setMonth(0) // Month are 0 based
  }
  if (scope === 'WEEKLY') {
    var weekday_shift = (start.getDay() + 6) % 7
    start.setDate(start.getDate() - weekday_shift)
  }

  const end = new Date(start)
  switch (scope) {
    case 'DAILY':
      end.setDate(end.getDate() + 1)
      break
    case 'MONTHLY':
      end.setMonth(end.getMonth() + 1)
      break
    case 'YEARLY':
      end.setFullYear(end.getFullYear() + 1)
      break
    case 'WEEKLY':
      end.setDate(end.getDate() + 7)
      break
  }
  return [start, end]
}

export function dayIsMissing(periods) {
  for (const element of periods) {
    if (element.value !== null) return false
  }
  return true
}
