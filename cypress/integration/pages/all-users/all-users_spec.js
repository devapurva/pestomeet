/// <reference types="cypress" />

describe('All Users Modules', () => {
  it('Add User: Successfully', () => {
    cy.visit('http://localhost:3000/');
    cy.get('input[type=email]').type('ninja4epsilon@gmail.com');
    cy.get('input[type=password]').type('Abc!23456');
    cy.get('form').submit();
    cy.url()
      .should('include', '/dashboard/overview')
      .then(() => {
        cy.visit('http://localhost:3000/dashboard/all-user');
        cy.get('button[id="add-user"]').click();
        cy.get('input[name=name]').type('Test Student Two');
        cy.get('input[name=email]').type('testStudenttwo@student.com');
        cy.get('input[name=phone]').type('8438232182');
        cy.get('[type="radio"]').check('student');
        cy.get('input[name=experience]').type('5');
        cy.get('input[name=password]').type('Abc!23456');
        cy.get('form').submit();
      });
  });
  it('Show Validation Errors', () => {
    cy.visit('http://localhost:3000/');
    cy.get('input[type=email]').type('ninja4epsilon@gmail.com');
    cy.get('input[type=password]').type('Abc!23456');
    cy.get('form').submit();
    cy.url()
      .should('include', '/dashboard/overview')
      .then(() => {
        cy.visit('http://localhost:3000/dashboard/all-user');
        cy.get('button[id="add-user"]').click();
        cy.get('input[name=name]').type('Test Student Three');
        cy.get('input[name=phone]').type('8438632182');
        cy.get('[type="radio"]').check('student');
        cy.get('form').submit();
      });
  });
});
