/// <reference types="cypress" />

describe('Resgiter to App', () => {
  it('Route to Register Page', () => {
    cy.visit('http://localhost:3000/auth/register');
    cy.get('form').submit();
  });
  it('Submit Registration without Inputs', () => {
    cy.visit('http://localhost:3000/auth/register');
    cy.get('form').submit();
  });
  it('Submit Registration with Inputs', () => {
    cy.visit('http://localhost:3000/auth/register');
    cy.get('input[name=name]').type('Test Student One');
    cy.get('input[type=email]').type('testStudent@student.com');
    cy.get('input[name=phone]').type('8738272182');
    cy.get('[type="radio"]').first().check();
    cy.get('input[name=experience]').type('5');
    cy.get('input[name=password]').type('Abc!23456');
    cy.get('input[name=confirmPassword]').type('Abc!23456');
    cy.get('form').submit();
  });
});
