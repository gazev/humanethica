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
    cy.intercept('GET', '/activities/*/enrollments').as('getEnrollments');
    cy.intercept('POST', '/activities/*/participations').as('createParticipation');

    // navigate to member InstitutionActivitiesView view
    cy.get('[data-cy="institution"]').click();
    cy.get('[data-cy="activities"]').click();
    cy.wait('@getInstitutions');

    // check if there are 2 activities in table and if table has 12 columns
    cy.get('[data-cy="memberActivitiesTable"] tbody tr')
      .should('have.length', 2)
      .first()
      .children()
      .should('have.length', 12);

    // first activity should have 1 participation
    cy.get('[data-cy="memberActivitiesTable"] tbody tr')
      .first()
      .children()
      .eq(3)
      .should('contain', 1);

    // navigate to member InstitutionActivityEnrollmentsView
    cy.get('[data-cy="showEnrollments"').first().click();
    cy.wait('@getEnrollments');

    // check if there aer 2 enrollments in table and if table has 5 columns
    cy.get('[data-cy="activityEnrollmentsTable"] tbody tr')
      .should('have.length', 2)
      .first()
      .children()
      .should('have.length', 5);

    // first enrollment should not be participating
    cy.get('[data-cy="activityEnrollmentsTable"] tbody tr')
      .first()
      .children()
      .eq(2)
      .should('contain', false);

    // open dialog, create participation and close dialog
    cy.get('[data-cy="selectParticipant"').click();
    cy.get('[data-cy="participationRating"').type(RATING);
    cy.get('[data-cy="createParticipation"').click();
    cy.wait('@createParticipation');
    cy.get('.v-btn span').contains('Close').click();

    // check if enrollments table retained schema
    cy.get('[data-cy="activityEnrollmentsTable"] tbody tr')
      .should('have.length', 2)
      .first()
      .children()
      .should('have.length', 5)

    // check if first enrollment was updated, now with participating set as true
    cy.get('[data-cy="activityEnrollmentsTable"] tbody tr')
      .first()
      .children()
      .eq(2)
      .should('contain', true);

    // navigate back to member InstitutionActivitiesView
    cy.get('.v-btn span').contains('Activities').click();
    cy.wait('@getInstitutions');

    // check if activity table retained schema
    cy.get('[data-cy="memberActivitiesTable"] tbody tr')
      .should('have.length', 2)
      .first()
      .children()
      .should('have.length', 12);

    // check if first activity was updated, now with 2 participants
    cy.get('[data-cy="memberActivitiesTable"] tbody tr')
      .first()
      .children()
      .eq(3)
      .should('contain', 2);
  });
});
