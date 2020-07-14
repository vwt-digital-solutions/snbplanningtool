context('Monteurs', () => {
  beforeEach(() => {
    cy.visit('/monteurs');
  });

  it('Should load DDMT-lib table', () => {
    cy.get('.ddmt-grid-container').should((ddmtContainer) => {
      expect(ddmtContainer).to.exist;
    });
  });
});
