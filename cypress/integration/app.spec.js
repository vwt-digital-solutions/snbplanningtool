context('App', () => {
  it('Should be authenticated', () => {
    cy.visit('/auth/' + Cypress.env('authBody'))
    expect(Cypress.env('accessToken')).to.be.ok;
  })

  it('Should connect to the API', async () => {
    const requestOptions = {
      method: 'GET',
      url: Cypress.env('apiUrl') + 'engineers',
      headers: {
        Authorization: 'Bearer ' + Cypress.env('accessToken')
      }
    };

    const response = await cy.request(requestOptions)
    expect(response.status).to.equal(200);
  })
})
