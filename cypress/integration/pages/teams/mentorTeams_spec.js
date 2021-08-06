/// <reference types="cypress" />

describe('Mentor Teams Modules', () => {
  it('Show Validation Errors', () => {
    cy.visit('http://localhost:3000/');
    cy.get('input[type=email]').type('ninja4epsilon@gmail.com');
    cy.get('input[type=password]').type('Abc!23456');
    cy.get('form').submit();
    cy.url()
      .should('include', '/dashboard/overview')
      .then(() => {
        cy.visit('http://localhost:3000/dashboard/team-mentor');
        cy.get('button[id="create-team"]').click();
        cy.get('form').submit();
      });
  });
  it('Add Batch Successfully', () => {
    cy.visit('http://localhost:3000/');
    cy.get('input[type=email]').type('ninja4epsilon@gmail.com');
    cy.get('input[type=password]').type('Abc!23456');
    cy.get('form').submit();
    cy.url()
      .should('include', '/dashboard/overview')
      .then(() => {
        cy.visit('http://localhost:3000/dashboard/team-mentor');
        cy.get('button[id="create-team"]').click();
        cy.get('input[name=teamName]').type('Mentor Team 100');
        cy.get('input[id="batch-list"]').click({ force: true });
        cy.get('li[id="batch-list-option-0"]').click({ force: true });
        cy.get('div[role=dialog]').click();
        cy.get('input[id="team-mentor"]').click({ force: true });
        cy.get('li[id="team-mentor-option-0"]').click({ force: true });
        cy.get('div[role=dialog]').click();
        cy.get('input[id="team-member"]').click({ force: true });
        cy.get('li[id="team-member-option-0"]').click({ force: true });
        cy.get('li[id="team-member-option-1"]').click({ force: true });
        cy.get('div[role=dialog]').click();
        cy.get('form').submit();
      });
  });
});
