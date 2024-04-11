import moment from 'moment'

describe('Indexed daily prices spec', () => {
  const activeButtonBgColor = 'rgb(186, 201, 42)'
  const inactiveButtonBgColor = 'rgb(102, 102, 102)'
  const today = moment().format('DD/MM/YYYY')
  const tomorrow = moment().add(1, 'days').format('DD/MM/YYYY')
  const yesterday = moment().subtract(1, 'days').format('DD/MM/YYYY')
  const firstDate = moment().subtract(15, 'days').format('YYYY-MM-DD')
  const lastDate = moment().add(1, 'days').format('YYYY-MM-DD')

  beforeEach(() => {
    cy.fixture('indexedPrices20TD').then((data) => {
      data.data.first_date = firstDate
      data.data.last_date = lastDate
      cy.intercept(
        'GET',
        '/data/indexed_prices?tariff=2.0TD&geo_zone=PENINSULA',
        data,
      ).as('mockedIndexed20TD')
    })
    cy.fixture('indexedPrices30TD').then((data) => {
      data.data.first_date = firstDate
      data.data.last_date = lastDate
      cy.intercept(
        'GET',
        '/data/indexed_prices?tariff=3.0TD&geo_zone=PENINSULA',
        data,
      ).as('mockedIndexed30TD')
    })
    cy.fixture('compensationPrices').then((data) => {
      data.data.first_date = firstDate
      data.data.last_date = lastDate
      cy.intercept(
        'GET',
        '/data/compensation_indexed_prices?geo_zone=PENINSULA',
        data,
      ).as('mockedCompensationPrices')
    })

    cy.visit('/ca/indexed-daily-prices')
  })

  function assertButtonIsActive(buttonName) {
    cy.get(`[data-cy="${buttonName}"]`)
      .invoke('css', 'background-color')
      .then((value) => {
        expect(value).equal(activeButtonBgColor)
      })
  }
  function assertButtonIsInactive(buttonName) {
    cy.get(`[data-cy="${buttonName}"]`)
      .invoke('css', 'background-color')
      .then((value) => {
        expect(value).equal(inactiveButtonBgColor)
      })
  }

  it('calls 2.0 prices API on start', () => {
    cy.wait('@mockedIndexed20TD')
    cy.get('.MuiFormControl-root').should('be.visible')
    cy.get('input.MuiInputBase-input').should('have.value', today)
    cy.get('.recharts-layer').should('be.visible')
    assertButtonIsActive('button-2.0TD')
    assertButtonIsInactive('button-3.0TD')
    assertButtonIsInactive('button-surplusCompensation')
  })
  it('calls 3.0 prices API when 3.0 button clicked', () => {
    cy.get('[data-cy="button-3.0TD"]').click()
    cy.wait('@mockedIndexed30TD')
    cy.get('.recharts-layer').should('be.visible')
  })
  it('calls compensation prices API when compensation button clicked', () => {
    cy.get('[data-cy="button-surplusCompensation"]').click()
    cy.wait('@mockedCompensationPrices')
    cy.get('.recharts-layer').should('be.visible')
  })
  it('calls 2.0 prices API on selecting back 2.0TD', () => {
    cy.wait('@mockedIndexed20TD')
    cy.get('[data-cy="button-3.0TD"]').click()
    cy.wait('@mockedIndexed30TD')
    cy.get('.recharts-layer').should('be.visible')
    cy.get('[data-cy="button-2.0TD"]').click()
    cy.wait('@mockedIndexed20TD')
    cy.get('.recharts-layer').should('be.visible')
  })
  it('goes to next day when clicking on next button and updates minimum price for 20TD', () => {
    cy.wait('@mockedIndexed20TD')
    cy.get('.MuiStack-root').contains(35.9)
    cy.get('[data-testid="ArrowForwardIosOutlinedIcon"]').click()
    cy.get('input.MuiInputBase-input').should('have.value', tomorrow)
    cy.get('.recharts-layer').should('be.visible')
    cy.get('.MuiStack-root').contains(-40.6)
  })
  it('goes to previous day when clicking on next button and updates minimum price for 30TD', () => {
    cy.get('[data-cy="button-3.0TD"]').click()
    cy.wait('@mockedIndexed30TD')
    cy.get('.MuiStack-root').contains(71.8)
    cy.get('[data-testid="ArrowBackIosOutlinedIcon"]').click()
    cy.get('input.MuiInputBase-input').should('have.value', yesterday)
    cy.get('.recharts-layer').should('be.visible')
    cy.get('.MuiStack-root').contains(67.0)
  })
})
