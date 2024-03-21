import { dateTimePickerTabsClasses } from '@mui/x-date-pickers'
import dayjs from 'dayjs'

const PERIOD = 'DAILY'
// Percentage for color gradient according to the mean price for the last 7 days
const PERCENTAGE_MEAN = 10 / 100 // 10%

export function getMeasuredData(first_date, selected_day, prices) {
  const [startIndex, endIndex] = sliceIndexes(first_date, PERIOD, dayjs(selected_day))
  return timeSlice(first_date, prices, startIndex, endIndex)
}

export function computeLimitDate(selected_day, first_date) {
  let limit_date = new Date(selected_day)
  const inclusive_week = 6
  limit_date.setDate(selected_day.getDate() - inclusive_week)
  if (limit_date < first_date) {
    limit_date = first_date
  }
  return limit_date
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
    AVERAGE: '0',
    MAX: '0',
    MIN: '0',
    WEEKLY_AVERAGE: '0'
  }

  if (fromDate === '' || selectedDate === '') {
    return totalPrices
  }

  if (prices.length === 0) {
    return totalPrices
  }

  const first_date = new Date(fromDate)
  first_date.setHours(0)

  const selected_day = new Date(selectedDate)
  selected_day.setHours(0)

  if (first_date > selected_day) {
    return totalPrices
  }

  const limit_date = computeLimitDate(selected_day, first_date)

  const measured_data = getMeasuredData(limit_date, selected_day, prices)

  let lastWeekPrices = []
  let dayPrices = []

  measured_data.forEach((data) => {
    const current_date = new Date(data.date)
    current_date.setHours(0)
    const current_date_day = current_date.getDate()

    lastWeekPrices.push(data.value)
    if (current_date_day == selected_day.getDate())
      dayPrices.push(data.value)
  })

  let acum_week = lastWeekPrices.reduce((accumulator, currentValue) => {
    return accumulator + currentValue
  }, 0)

  let acum_day = dayPrices.reduce((accumulator, currentValue) => {
    return accumulator + currentValue
  }, 0)

  if (acum_week > 0) {
    totalPrices['WEEKLY_AVERAGE'] = String((acum_week / lastWeekPrices.length).toFixed(6))
  }
  if (acum_day > 0) {
    totalPrices['AVERAGE'] = String((acum_day / dayPrices.length).toFixed(6))
    totalPrices['MAX'] = String((Math.max(...dayPrices)).toFixed(6))
    totalPrices['MIN'] = String((Math.min(...dayPrices)).toFixed(6))
  }

  return totalPrices
}

export function transformIndexedTariffPrices(firstDate, calendarDay, prices) {
  const first_date = new Date(firstDate)
  first_date.setHours(0)
  const calendar_day = new Date(calendarDay)
  const [startIndex, endIndex] = sliceIndexes(first_date, PERIOD, dayjs(calendar_day))

  var measured_data = timeSlice(first_date, prices, startIndex, endIndex)

  let acum = prices.reduce((accumulator, currentValue) => {
    return accumulator + currentValue
  }, 0)
  let average = acum / prices.length

  const today = new Date()
  today.setMinutes(0)
  today.setSeconds(0)
  today.setMilliseconds(0)

  // build the periods array of dicts
  let periods = []
  measured_data.forEach((data) => {
    const pre = today <= data?.date ? '' : 'past_'
    // choose the "number" we need
    if (data.value + average * PERCENTAGE_MEAN < average) {
      data[`${pre}low`] = data.value
    } else if (data.value - average * PERCENTAGE_MEAN > average) {
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
      past_low: '#f0faa5',
      past_average: '#d6f7be',
      past_up: '#a5b38f',
    },
    keys: ['low', 'average', 'up', 'past_low', 'past_average', 'past_up'],
    periods: periods,
  }
}

// FROM SOM REPRESENTA
// TODO: move this to somenergia-ui ?

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
