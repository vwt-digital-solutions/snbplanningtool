context('Monteurs', () => {
  beforeEach(() => {
    cy.visit('/auth/' + Cypress.env('authBody'));
    cy.visit('/monteurs');
  });

  it('Should show more than 0 engineer rows', () => {
    cy.get('.ag-row').should((rows) => {
      expect(rows).to.have.length.of.at.least(1);
    });
  });

  describe('Change engineer role', () => {
    beforeEach(() => {
      cy.get('.ag-row').within(() => {
        cy.get('.ag-cell[col-id*="token"]').first().as('token');
        cy.get('.ag-cell[col-id*="role"]').first().as('role');
      });
    });

    it('Should change the first engineer row\'s role"', () => {
      cy.server();

      // Change driver role
      cy.get('@role').dblclick();
      cy.route('POST', '/engineers').as('getData');

      cy.get('@role').invoke('text').then((role) => {
        if (role === 'Lasser') {
          cy.get('.ag-rich-select-row').contains('Metende').click().then(() => {
            // Save it
            cy.get('button.save').click();
            cy.wait('@getData');
          });
        } else {
          cy.get('.ag-rich-select-row').contains('Lasser').click().then(() => {
            // Save it
            cy.get('button.save').click();
            cy.wait('@getData');
          });
        }
      });

      cy.get('@role').invoke('text').should((role) => {
        expect([
          'Lasser',
          'Metende',
          'Leerling',
          'Kraanmachinist',
          'Overig',
          'NLS',
          'Cluster'
        ]).to.include(role);
      });
    });

    it('Should revert the first engineer row to back to original role', () => {
      cy.server();

      // Change driver role
      cy.get('@role').dblclick();
      cy.route('POST', '/engineers').as('getData');

      cy.get('@role').invoke('text').then((role) => {
        if (role === 'Lasser') {
          cy.get('.ag-rich-select-row').contains('Metende').click().then(() => {
            // Save it
            cy.get('button.save').click();
            cy.wait('@getData');
          });
        } else {
          cy.get('.ag-rich-select-row').contains('Lasser').click().then(() => {
            // Save it
            cy.get('button.save').click();
            cy.wait('@getData');
          });
        }
      });

      cy.get('@role').invoke('text').should((role) => {
        expect([
          'Lasser',
          'Metende',
          'Leerling',
          'Kraanmachinist',
          'Overig',
          'NLS',
          'Cluster'
        ]).to.include(role);
      });
    });
  });

});
