const { request } = require("http");

context('Auto\'s', () => {
  beforeEach(() => {
    cy.visit('/auth/' + Cypress.env('authBody'))
    cy.visit('/autos')
  })

  it('Should show more than 0 carInfo rows', () => {
    cy.get('.ag-row').should((rows) => {
      expect(rows).to.have.length.of.at.least(1)
    })
  })

  describe('Change carInfo driver_skill', () => {
    beforeEach(() => {
      cy.get('.ag-row').within(() => {
        cy.get('.ag-cell[col-id*="token"]').first().as('driver_token')//.to.have.length.of.at.least(1)
        cy.get('.ag-cell[col-id*="driver_skill"]').first().as('driver_skill')
      });
    })

    it('Should edit the first carInfo row to "Lasser"', () => {
      cy.get('@driver_skill').invoke('text').as('initial_driver_skill')

      // Change driver skill
      cy.get('@driver_skill').click()
      cy.get('@driver_skill').type('{enter}{downarrow}{enter}')
      cy.get('@driver_skill').invoke('text').as('new_driver_skill')

      // Save it
      cy.get('button.save').click()

      cy.get('@driver_skill').invoke('text').should((driver_skill) => {
        expect([
          'Lasser',
          'Metende',
          'Leerling',
          'Kraanmachinist',
          'Overig',
          'NLS',
          'Cluster'
        ]).to.include(driver_skill)
      });
    })

    it('Should revert the first carInfo row to back to original driver_skill', () => {
      // Change driver skill
      cy.get('@driver_skill').click()
      cy.get('@driver_skill').type('{enter}{uparrow}{enter}')
      // cy.get('@driver_skill').invoke('text').as('new_driver_skill')

      // Save it
      cy.get('button.save').click()

      cy.get('@driver_skill').invoke('text').should((driver_skill) => {
        expect([
          'Lasser',
          'Metende',
          'Leerling',
          'Kraanmachinist',
          'Overig',
          'NLS',
          'Cluster'
        ]).to.include(driver_skill)
      });
    })
  })

})
