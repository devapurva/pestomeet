/// <reference types="cypress" />

context('Logout, and JWT Token Checks', () => {
  it('Before Login : JWT Token', () => {
    cy.visit('http://localhost:3000/');
    expect(localStorage.getItem('accessToken')).to.eq(null);
  });

  it('Login: Print Token', () => {
    cy.visit('http://localhost:3000/');
    cy.get('input[type=email]').type('ninja4epsilon@gmail.com');
    cy.get('input[type=password]').type('Abc!23456');
    cy.get('form').submit();
    cy.url()
      .should('include', '/dashboard/overview')
      .then(() => {
        cy.log(localStorage.getItem('accessToken'));
      });
  });

  it('Logout Successfully', () => {
    cy.visit('http://localhost:3000/');
    cy.get('input[type=email]').type('ninja4epsilon@gmail.com');
    cy.get('input[type=password]').type('Abc!23456');
    cy.get('form').submit();
    cy.url()
      .should('include', '/dashboard/overview')
      .then(() => {
        cy.get('button[id="accountPopover"]').click();
        cy.get('button[id="logoutButton"]').click();
      });
  });
});
