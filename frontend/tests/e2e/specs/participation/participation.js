describe('Participation', () => {
  const RATING = 3;

  beforeEach(() => {
    cy.deleteAllButArs();
    cy.createDemoEntities();
    cy.createDemoActivitiesAndEnrollments();
  });

  afterEach(() => {
    cy.deleteAllButArs();
  });

  it('ars login and get users', () => {
    cy.demoMemberLogin()
    cy.intercept('GET', '/users/*/getInstitution').as('getInstitutions');
    cy.intercept('GET', '/activities').as('getActivities');
    cy.intercept('GET', '/activities/*/enrollments').as('getEnrollments');
    cy.intercept('POST', '/activities/*/participations').as('createParticipation');

    cy.get('[data-cy="institution"]').click();
    cy.get('[data-cy="activities"]').click();
    cy.wait('@getInstitutions');

    cy.get('[data-cy="showEnrollments"').first().click();
    cy.wait('@getEnrollments');

    cy.get('[data-cy="selectParticipant"').click();
    cy.get('[data-cy="participationRating"').type(RATING);
    cy.get('[data-cy="createParticipation"').click();
    cy.get('.v-btn span').contains('Close').click();
    cy.get('.v-btn span').contains('Activities').click();
  });
});