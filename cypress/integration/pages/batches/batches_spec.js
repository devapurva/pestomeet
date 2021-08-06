/// <reference types="cypress" />

describe('Batches Modules', () => {
  it('Show Validation Errors', () => {
    cy.visit('http://localhost:3000/');
    cy.get('input[type=email]').type('ninja4epsilon@gmail.com');
    cy.get('input[type=password]').type('Abc!23456');
    cy.get('form').submit();
    cy.url()
      .should('include', '/dashboard/overview')
      .then(() => {
        cy.visit('http://localhost:3000/dashboard/batch');
        cy.get('button[id="create-batch"]').click();
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
        cy.visit('http://localhost:3000/dashboard/batch');
        cy.get('button[id="create-batch"]').click();
        cy.get('input[name=batchName]').type('Ninja 40');
        cy.get('[type="radio"]').check('ninja');
        cy.get('input[id="batch-admin"]').click();
        cy.get('li[id="batch-admin-option-0"]').click({ force: true });
        cy.get('input[id="batch-members"]').click();
        cy.get('li[id="batch-members-option-0"]').click({ force: true });
        cy.get('li[id="batch-members-option-1"]').click({ force: true });
        cy.get('form').submit();
      });
  });
});
