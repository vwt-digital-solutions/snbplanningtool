const { request } = require("http");

context('Monteurs', () => {
  beforeEach(() => {
    cy.visit('/auth/' + Cypress.env('authBody'))
    cy.visit('/monteurs')
  })

  it('Should show more than 0 engineer rows', () => {
    cy.get('.ag-row').should((rows) => {
      expect(rows).to.have.length.of.at.least(1)
    })
  })

  describe('Change engineer skill', () => {
    beforeEach(() => {
      cy.get('.ag-row').within(() => {
        cy.get('.ag-cell[col-id*="token"]').first().as('token')//.to.have.length.of.at.least(1)
        cy.get('.ag-cell[col-id*="skill"]').first().as('skill')
      });
    })

    it('Should edit the first engineer row to "Lasser"', () => {
      cy.get('@skill').invoke('text').as('initial_skill')

      // Change driver skill
      cy.get('@skill').click()
      cy.get('@skill').type('{enter}{downarrow}{enter}')
      cy.get('@skill').invoke('text').as('new_skill')

      // Save it
      cy.get('button.save').click()

      cy.get('@skill').invoke('text').should((skill) => {
        expect([
          'Lasser',
          'Metende',
          'Leerling',
          'Kraanmachinist',
          'Overig',
          'NLS',
          'Cluster'
        ]).to.include(skill)
      });
    })

    it('Should revert the first engineer row to back to original skill', () => {
      // Change driver skill
      cy.get('@skill').click()
      cy.get('@skill').type('{enter}{uparrow}{enter}')
      // cy.get('@skill').invoke('text').as('new_skill')

      // Save it
      cy.get('button.save').click()

      cy.get('@skill').invoke('text').should((skill) => {
        expect([
          'Lasser',
          'Metende',
          'Leerling',
          'Kraanmachinist',
          'Overig',
          'NLS',
          'Cluster'
        ]).to.include(skill)
      });
    })
  })

})
