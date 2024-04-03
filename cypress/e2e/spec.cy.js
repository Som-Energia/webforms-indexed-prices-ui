describe('template spec', () => {
  Cypress.on('uncaught:exception', (error, runnable) => {
    console.error(error)
    return false
  })

  beforeEach(() => {
    cy.visit('/ca/indexed-daily-prices')
    //cy.fixture('cancellation.json').as('data')
  })


  it('passes', () => {
    //cy.visit('/ca/indexed-daily-prices')
  })
})