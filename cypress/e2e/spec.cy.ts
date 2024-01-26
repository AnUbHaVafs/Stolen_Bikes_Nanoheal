/// <reference types="cypress" />

describe('template spec', () => {
  it('all components exists', () => {
    cy.visit('http://localhost:5173/');
    cy.get('[data-testid=header-logo]').should('exist');
    cy.get('[data-testid=header-title]').should('exist');
    cy.get('[data-testid=header-sub-title]').should('exist');

    cy.get('[data-testid=case-description-input]').should('exist');
    cy.get('[data-testid=find-cases-submit-button]').should('exist');
    cy.get('[data-testid=pagination]').should('exist');
    cy.get('[data-testid=cases-count]').should('exist');

    cy.get('[data-testid=case-card-title]').should('exist');
    cy.get('[data-testid=case-card-description]').should('exist');
    cy.get('[data-testid=case-card-info]').should('exist');

  })

  it('loader exists', () => {
    cy.visit('http://localhost:5173/');
    cy.get('[data-testid=case-description-input]').should('exist');

    // loader exists
    cy.get('[data-testid=case-description-input]').type("202");
    cy.contains("loading");
    // results
    cy.get('[data-testid=cases-count]').should('exist');
    cy.get('[data-testid=case-card-title]').should('exist');
    cy.get('[data-testid=case-card-description]').should('exist');
    cy.get('[data-testid=case-card-info]').should('exist');

  })

  it('no results exists', () => {
    cy.visit('http://localhost:5173/');
    cy.get('[data-testid=case-description-input]').should('exist');

    // no results exists
    cy.get('[data-testid=case-description-input]').type("check for no results");
    cy.contains("loading");
    // cy.contains("No Results");

  })

  it('user queries responses exists', () => {
    cy.visit('http://localhost:5173/');
    cy.get('[data-testid=case-description-input]').should('exist');
    // user search query = "202"
    cy.get('[data-testid=case-description-input]').type("202");
    cy.contains("loading");

    // results
    cy.get('[data-testid=cases-count]').should('exist');
    cy.get('[data-testid=case-card-title]').should('exist');
    cy.get('[data-testid=case-card-description]').should('exist');
    cy.get('[data-testid=case-card-info]').should('exist');

  })

  // it('interaction', function() {
    /* ==== Generated with Cypress Studio ==== */
    // cy.visit('http://localhost:5173/');
    // cy.get('#\\:r1\\:').click();
    // cy.get('#\\:r1\\:').clear('2');
    // cy.get('#\\:r1\\:').type('202');
    // cy.get('.MuiButton-root').click();
    // cy.get('.from-date-picker > .MuiInputBase-root > .MuiInputAdornment-root > .MuiButtonBase-root > [data-testid="CalendarIcon"] > path').click();
    // cy.get('[data-timestamp="1704047400000"]').click();
    // cy.get('.to-date-picker > .MuiInputBase-root > .MuiInputAdornment-root > .MuiButtonBase-root > [data-testid="CalendarIcon"]').click();
    // cy.get('[data-timestamp="1704220200000"]').click();
    // cy.get('.MuiButton-root').click();
    // cy.get(':nth-child(3) > .MuiButtonBase-root').click();
    // cy.get('.MuiPagination-ul > :nth-child(2) > .MuiButtonBase-root').click();
    // cy.get('.bykes-theft-section').click();
    // cy.get('.total-stolen-bikes-count > p').click();
    // cy.get('.total-stolen-bikes-count > p').should('be.visible');
    /* ==== End Cypress Studio ==== */
  // });
})