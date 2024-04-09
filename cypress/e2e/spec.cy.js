
describe('Indexed daily prices spec', () => {
  beforeEach(() => {
    cy.intercept('GET', '/data/indexed_prices?tariff=2.0TD&geo_zone=PENINSULA', {
      fixture: 'indexedPrices20TD.json',
    }).as('mockedIndexed20TD')
    cy.intercept('GET', '/data/indexed_prices?tariff=3.0TD&geo_zone=PENINSULA', {
      fixture: 'indexedPrices30TD.json',
    }).as('mockedIndexed30TD')
    cy.intercept('GET', '/data/compensation_indexed_prices?geo_zone=PENINSULA', {
      fixture: 'compensationPrices.json',
    }).as('mockedCompensationPrices')

    cy.visit('/ca/indexed-daily-prices')
  })
  const activeButtonBgColor = 'rgb(186, 201, 42)'
  const inactiveButtonBgColor = 'rgb(102, 102, 102)'
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
    cy.get('[data-cy="calendar"]').should('be.visible')
    assertButtonIsActive('button-2.0TD')
    assertButtonIsInactive('button-3.0TD')
    assertButtonIsInactive('button-surplusCompensation')
  })
  it('calls 3.0 prices API when 3.0 button clicked', () => {
    cy.get('[data-cy="button-3.0TD"]').click()
    cy.wait('@mockedIndexed30TD')
  })
  it('calls compensation prices API when compensation button clicked', () => {
    cy.get('[data-cy="button-surplusCompensation"]').click()
    cy.wait('@mockedCompensationPrices')
  })
  it('calls 2.0 prices API on selecting back 2.0TD', () => {
    cy.wait('@mockedIndexed20TD')
    cy.get('[data-cy="button-3.0TD"]').click()
    cy.wait('@mockedIndexed30TD')
    cy.get('[data-cy="button-2.0TD"]').click()
    cy.wait('@mockedIndexed20TD')
  })
})
