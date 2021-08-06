/// <reference types="cypress" />

describe('Mentors Modules', () => {
  it('Show Validation Errors', () => {
    cy.visit('http://localhost:3000/');
    cy.get('input[type=email]').type('ninja4epsilon@gmail.com');
    cy.get('input[type=password]').type('Abc!23456');
    cy.get('form').submit();
    cy.url()
      .should('include', '/dashboard/overview')
      .then(() => {
        cy.visit('http://localhost:3000/dashboard/mentor');
        cy.get('button[id="add-user"]').click();
        cy.get('input[name=name]').type('Test Mentor Two');
        cy.get('input[name=phone]').type('7362718291');
        cy.get('form').submit();
      });
  });
  it('Add Mentor: Successfully', () => {
    cy.visit('http://localhost:3000/');
    cy.get('input[type=email]').type('ninja4epsilon@gmail.com');
    cy.get('input[type=password]').type('Abc!23456');
    cy.get('form').submit();
    cy.url()
      .should('include', '/dashboard/overview')
      .then(() => {
        cy.visit('http://localhost:3000/dashboard/mentor');
        cy.get('button[id="add-user"]').click();
        cy.get('input[name=name]').type('Test Mentor Three');
        cy.get('input[name=email]').type('testmentorthree@mentor.com');
        cy.get('input[name=phone]').type('7362718540');
        cy.get('input[name=password]').type('Abc!23456');
        cy.get('form').submit();
      });
  });
});
