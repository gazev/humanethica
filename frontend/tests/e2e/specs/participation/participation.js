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
    cy.wait('@createParticipation');
    cy.get('.v-btn span').contains('Close').click();
    
    cy.get('[data-cy="activityEnrollmentsTable"] tbody tr')
      .should('have.length', 2)
      .eq(0)
      .children()
      .should('have.length', 5)
    cy.get('[data-cy="activityEnrollmentsTable"] tbody tr')
      .eq(0).children().eq(2).should('contain', true);

    cy.get('.v-btn span').contains('Activities').click();
    cy.wait('@getInstitutions');

    cy.get('[data-cy="memberActivitiesTable"] tbody tr')
      .should('have.length', 2)
      .eq(0)
      .children()
      .should('have.length', 12);

    cy.get('[data-cy="memberActivitiesTable"] tbody tr')
      .eq(0).children().eq(3).should('contain', 2);
  });
});