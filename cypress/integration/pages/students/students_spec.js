/// <reference types="cypress" />

describe('Student Modules', () => {
  it('Show Validation Errors', () => {
    cy.visit('http://localhost:3000/');
    cy.get('input[type=email]').type('ninja4epsilon@gmail.com');
    cy.get('input[type=password]').type('Abc!23456');
    cy.get('form').submit();
    cy.url()
      .should('include', '/dashboard/overview')
      .then(() => {
        cy.visit('http://localhost:3000/dashboard/student');
        cy.get('button[id="add-user"]').click();
        cy.get('input[name=name]').type('Test Student Three');
        cy.get('input[name=phone]').type('84386321321');
        cy.get('form').submit();
      });
  });
  it('Add User: Successfully', () => {
    cy.visit('http://localhost:3000/');
    cy.get('input[type=email]').type('ninja4epsilon@gmail.com');
    cy.get('input[type=password]').type('Abc!23456');
    cy.get('form').submit();
    cy.url()
      .should('include', '/dashboard/overview')
      .then(() => {
        cy.visit('http://localhost:3000/dashboard/student');
        cy.get('button[id="add-user"]').click();
        cy.get('input[name=name]').type('Test Student Four');
        cy.get('input[name=email]').type('testStudentfour@student.com');
        cy.get('input[name=phone]').type('8430932439');
        cy.get('input[name=experience]').type('5');
        cy.get('input[name=password]').type('Abc!23456');
        cy.get('form').submit();
      });
  });
});
