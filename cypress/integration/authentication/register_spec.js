/// <reference types="cypress" />

describe('Resgiter to App', () => {
  it('Login without any inputs', () => {
    cy.visit('http://localhost:3000/auth/resgiter');
    cy.get('form').submit();
  });
  //   it('Without Login Visit Dashboard', () => {
  //     cy.visit('http://localhost:3000/dashboard');
  //   });
  //   it('Login with input', () => {
  //     cy.visit('http://localhost:3000/');
  //     cy.get('input[type=email]').type('ninja4epsilon@gmail.com');
  //     cy.get('input[type=password]').type('Abc!23456');
  //     cy.get('form').submit();
  //   });
});
