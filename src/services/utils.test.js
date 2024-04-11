import React from 'react'
import { beforeEach, afterEach, describe, expect, test, it } from 'vitest'
import { computeTotals, getMeasuredData, computeLimitDate, transformIndexedTariffPrices, dayIsMissing } from './utils'

describe('getMeasuredData', () => {
  describe('when single day requested', () => {
    it('returns single day prices', () => {
        const a_valid_price = 0.1
        const totalWeekPriceValues = 360
        const prices = Array.from({ length: totalWeekPriceValues }, (_, index) => a_valid_price);
        const limit_date = new Date('2024-03-20')
        const selected_day = new Date('2024-03-21')

        const prices_data = getMeasuredData(limit_date, selected_day, prices);

        expect(prices_data.length).toBe(24)
    })
  })
  describe('when single day requested', () => {
    it('returns one week prices', () => {
        const a_valid_price = 0.1
        const totalWeekPriceValues = 360
        const prices = Array.from({ length: totalWeekPriceValues }, (_, index) => a_valid_price);
        const limit_date = new Date('2024-03-08')
        const selected_day = new Date('2024-03-14')

        const prices_data = getMeasuredData(limit_date, selected_day, prices);

        expect(prices_data.length).toBe(168)
    })
  })
})

describe('computeLimitDate', () => {
  describe('when limit_date is inside the valid range', () => {
    it('returns date into range', () => {  
        const selected_day = new Date('2024-03-27')
        const first_date = new Date('2024-03-15')
        const expected_date = new Date('2024-03-21')

        const limit_date = computeLimitDate(selected_day, first_date)

        expect(limit_date).toStrictEqual(expected_date)
    })
  })
  describe('when limit_date is equal to the started range limit', () => {
    it('returns started range limit value', () => {  
        const selected_day = new Date('2024-03-27')
        const first_date = new Date('2024-03-21')
        const expected_date = new Date('2024-03-21')

        const limit_date = computeLimitDate(selected_day, first_date)
        
        expect(limit_date).toStrictEqual(expected_date)
    })
  })
  describe('limit_date is outside of the valid range', () => {
    it('returns started range limit value', () => {  
        const selected_day = new Date('2024-03-27');
        const first_date = new Date('2024-03-25');
        const expected_date = new Date('2024-03-25')

        const limit_date = computeLimitDate(selected_day, first_date);

        expect(limit_date).toStrictEqual(expected_date)
    })
  })
})

describe('computeTotals', () => {
  describe('happy path', () => {
    describe('when one week prices is requested', () => {
      it('returns computation of the prices', () => {
          const a_valid_price = 0.1
          const prices = Array.from({ length:  168 }, (_, index) => a_valid_price)
          const expectedtotalPrices = {
            AVERAGE: '0.100000',
            MAX: '0.100000',
            MIN: '0.100000',
            WEEKLY_AVERAGE: '0.100000'
          }
          expect(computeTotals('2024-03-03','2024-03-10', prices)).toStrictEqual(expectedtotalPrices)
      })
    })
  })

  describe('validations', () => {
    const expectedEmptyTotalPrices = {
        AVERAGE: '0',
        MAX: '0',
        MIN: '0',
        WEEKLY_AVERAGE: '0'    
        }

    describe('when prices is an empty array', () => {
      it('returns the same prices array', () => {
          expect(computeTotals('','', [])).toStrictEqual(expectedEmptyTotalPrices)
      })   
    })
    describe('when date params are empty', () => {
      it('returns the same prices array', () => {
          expect(computeTotals('','', [])).toStrictEqual(expectedEmptyTotalPrices)  
      })
    })
    describe('when selectedDate is older than fromDate', () => {
      it('returns the same prices array', () => {         
          const aValidPrice = 0.23
          expect(computeTotals('2024-03-20','2024-03-19', [aValidPrice])).toStrictEqual(expectedEmptyTotalPrices)
      })
    })
    describe('when selectedDate minus 7 days is older than firstDate', () => {
      it('returns the same prices array', () => {         
          const aValidPrice = 0.23
          expect(computeTotals('2024-03-20','2024-03-19', [aValidPrice])).toStrictEqual(expectedEmptyTotalPrices)
      })
    })
  })
})

describe('transformIndexedTariffPrices', () => {
  describe('happy path', () => {
    describe('when a valid range with values is given', () => {
      it('returns a valid data to fill the chart', () => {
        const fromDate = '2024-03-01'
        const selectedDate = '2024-03-08'
        const a_valid_price = 0.1
        const pricesDefaultLength = 360
        const prices = Array.from({ length:  pricesDefaultLength }, (_, index) => a_valid_price)

        const result = transformIndexedTariffPrices(fromDate, selectedDate, prices)

        const expected_result_keys = ["fills", "keys", "periods", "referenceLineData"]
        expect(Object.keys(result)).toStrictEqual(expected_result_keys)
        expect(result['periods'].length).toBe(24)
      })
    })
  })
})


describe('dayIsMissing', () => {
  describe('when all day hours are not missing', () => {
    it('returns false', () => {
      const periodElement = {
        "date": 1712786400000,
        "value": 'aValidHourValue',
        "past_low": 0.028231
      }
      const totalDayHours = 24
      const periods = Array.from({ length: totalDayHours }, (_, index) => periodElement);

      const result = dayIsMissing(periods)

      expect(result).toBe(false)
    })
  })
  describe('when some day hours are missing', () => {
    it('returns false', () => {
      const periodElement = {
        "date": 1712786400000,
        "value": 'aValidHourValue',
        "past_low": 0.028231
      }
      const totalDayHours = 24
      const periods = Array.from({ length: totalDayHours }, (_, index) => ({ ...periodElement }));
      periods[0].value = null

      const result = dayIsMissing(periods)

      expect(result).toBe(false)
    })
  })
  describe('when all day hours are missing', () => {
    it('returns true', () => {
      const periodElement = {
        "date": 1712786400000,
        "value": null,
        "past_low": 0.028231
      }
      const totalDayHours = 24
      const periods = Array.from({ length: totalDayHours }, (_, index) => ({ ...periodElement }));

      const result = dayIsMissing(periods)

      expect(result).toBe(true)
    })
  })
})
