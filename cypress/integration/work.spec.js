context('Werk', () => {
  beforeEach(() => {
    cy.visit('/auth/' + Cypress.env('authBody'))
    cy.visit('/werk')
  })

  it('Should show more than 0 workItem rows', () => {
    cy.get('.ag-row', { timeout: 60000 }).should((rows) => {
      expect(rows).to.have.length.of.at.least(1)
    })
  })

  it('Should have more than 0 markers on the map after clicking the work-item link', () => {
    cy.get('.work-item-view-link').first().click();
    cy.get('.work-marker').first().should((markers) => {
      expect(markers).to.have.length.of.at.least(1)
    })
  })
})
