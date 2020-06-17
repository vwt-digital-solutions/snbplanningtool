context('Kaart', () => {
  beforeEach(() => {
    cy.visit('/auth/' + Cypress.env('authBody'));
  });

  it('Should load the map and create clusters', () => {
    cy.visit('/');
    cy.get('.cluster').should((clusters) => {
      expect(clusters).to.have.length.of.at.least(1);
    });
  });
});
