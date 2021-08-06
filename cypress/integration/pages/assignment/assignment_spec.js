/// <reference types="cypress" />

describe('Assignment Modules', () => {
  it('Show Validation Errors', () => {
    cy.visit('http://localhost:3000/');
    cy.get('input[type=email]').type('studentone@student.com');
    cy.get('input[type=password]').type('Abc!23456');
    cy.get('form').submit();
    cy.url()
      .should('include', '/dashboard/overview')
      .then(() => {
        cy.visit('http://localhost:3000/dashboard/assignments');
        cy.get('button[id="add-assignment"]').click();
        cy.get('form').submit();
      });
  });
  it('Add Resource', () => {
    cy.visit('http://localhost:3000/');
    cy.get('input[type=email]').type('studentone@student.com');
    cy.get('input[type=password]').type('Abc!23456');
    cy.get('form').submit();
    cy.url()
      .should('include', '/dashboard/overview')
      .then(() => {
        cy.visit('http://localhost:3000/dashboard/assignments');
        cy.get('button[id="add-assignment"]').click();
        cy.get('input[name=assignmentName]').type('Assignment 635');
        cy.get('input[id="event-list"]').click({ force: true });
        cy.get('li[id="event-list-option-2"]').click({ force: true });
        cy.get('div[role=dialog]').click({ force: true });
        cy.get('input[name=resourceLink]').type(
          'https://dashboard.heroku.com/apps/pestomeet-backend/logs'
        );
        cy.get('button[id="add-link"]').click();
        cy.get('input[name=resourceLink]').type('https://www.google.com/');
        cy.get('button[id="add-link"]').click();
        cy.get('form').submit();
      });
  });
});
