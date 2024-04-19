import dayjs from 'dayjs'

// Percentage for color gradient according to the mean price for the last 7 days
const PERCENTAGE_MEAN = 10 / 100 // 10%

/**
 * Validates parameters for incorrect values or conditions.
 * @param {Date} fromDate - The start date.
 * @param {Date} selectedDate - The selected date.
 * @param {Array} prices - The array of prices.
 * @returns {boolean} - Indicates whether parameters are valid or not.
 */
function validateParameters(fromDate, selectedDate, prices) {
  // Convert fromDate and selectedDate to Date objects and set hours to 0
  const startDate = new Date(fromDate);
  startDate.setHours(0);
  const selectedDay = new Date(selectedDate);
  selectedDay.setHours(0);

  // Check for empty dates or empty prices array
  if (fromDate === '' || selectedDate === '' || prices.length === 0) {
    return true; // Parameters are invalid
  }

  // Check if the startDate is after the selectedDay
  if (startDate > selectedDay) {
    return true; // Parameters are invalid
  }

  return false; // Parameters are valid
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
    BASE_DAYS_COMPUTATION: '0',
  }

  if (validateParameters(fromDate, selectedDate, prices)) {
    return totalPrices
  }

  let { acum_week, acum_day, dayPrices, baseDaysComputation } = computeBaseValues(
    fromDate,
    selectedDate,
    prices,
  )

  if (acum_week > 0) {
    totalPrices['WEEKLY_AVERAGE'] = String((acum_week / baseDaysComputation).toFixed(6))
    totalPrices['BASE_DAYS_COMPUTATION'] = baseDaysComputation / 24
  }
  if (acum_day > 0) {
    totalPrices['AVERAGE'] = String((acum_day / dayPrices.length).toFixed(6))
    totalPrices['MAX'] = String(
      Math.max(...dayPrices.map((item) => item.value)).toFixed(6),
    )
    totalPrices['MIN'] = String(
      Math.min(...dayPrices.map((item) => item.value)).toFixed(6),
    )
  }

  return totalPrices
}

function computeBaseValues(fromDate, selectedDate, prices) {
  const first_date = new Date(fromDate)
  first_date.setHours(0)
  const selected_day = new Date(selectedDate)
  selected_day.setHours(0)

  const periodPrices = getPricesForPeriod(first_date, selected_day, prices)

  let lastWeekPrices = []
  let dayPrices = []
  let baseDaysComputation = 0

  periodPrices.forEach((data) => {
    const current_date = new Date(data.date)
    current_date.setHours(0)
    const current_date_day = current_date.getDate()

    if (data.value !== null) {
      lastWeekPrices.push(data)
      baseDaysComputation += 1
    }
    if (current_date_day == selected_day.getDate()) dayPrices.push(data)
  })

  let acum_week = lastWeekPrices.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.value
  }, 0)
  let acum_day = dayPrices.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.value
  }, 0)

  return { acum_week, acum_day, dayPrices, baseDaysComputation }
}

export function transformIndexedTariffPrices(fromDate, selectedDate, prices) {
  let { acum_week, acum_day, dayPrices, baseDaysComputation } = computeBaseValues(
    fromDate,
    selectedDate,
    prices,
  )
  let week_average = acum_week / baseDaysComputation
  let day_average = acum_day / dayPrices.length
  const today = new Date()
  today.setMinutes(0, 0, 0)

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
    base_days_computation: baseDaysComputation / 24,
  }
}

/**
 * Retrieves the data within a specified time range.
 * @param {Date} firstDate - The start date of the time range.
 * @param {Date} selectedDay - The selected day, the end of the time range.
 * @param {Array} prices - The array of prices.
 * @returns {Array} - The data within the specified time range.
 */
export function getPricesForPeriod(firstDate, selectedDay, prices) {
  // Calculate the start and end indexes based on the firstDate and the selectedDay
  const [startIndex, endIndex] = getSliceIndexes(firstDate, dayjs(selectedDay));

  // Extract the data within the specified time range
  return sliceTimeRange(firstDate, prices, startIndex, endIndex);
}

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

export function sliceTimeRange(timeOffset, values, indexStart, indexEnd) {
  var adjustedIndexStart = Math.max(0, indexStart)
  const newTimeOffset = index2time(timeOffset, adjustedIndexStart)
  return array2datapoints(newTimeOffset, values.slice(adjustedIndexStart, indexEnd))
}

export function getSliceIndexes(offsetDate, currentTime) {
  var [startTime, endTime] = weekTimeInterval(currentTime)
  var startIndex = time2index(offsetDate, startTime)
  var endIndex = time2index(offsetDate, endTime)
  return [startIndex, endIndex]
}

export function weekTimeInterval(currentTime) {
  const end = new Date(currentTime)
  end.setHours(0)
  end.setMinutes(0)
  end.setSeconds(0)
  end.setMilliseconds(0)
  end.setDate(end.getDate() + 1)

  const start = new Date(end)
  start.setDate(start.getDate() - 7)

  return [start, end]
}

export function dayIsMissing(periods) {
  for (const element of periods) {
    if (element.value !== null) return false
  }
  return true
}
