describe('Activity', () => {
  beforeEach(() => {
    cy.deleteAllButArs();
    cy.createDemoEntities();
    cy.createAssessmentsDemoEntities();
  });

  afterEach(() => {
    cy.deleteAllButArs();
  });

  it('create assessment', () => {
    const REVIEW = 'This is a test review.';
    cy.demoVolunteerLogin();
    // intercept get activities request
    cy.intercept('GET', '/activities').as('getActivities');
    // go to volunteer activities view
    cy.get('[data-cy="volunteerActivities"]').click();
    // check request was done
    cy.wait('@getActivities');
    // check results
    cy.get('[data-cy="volunteerActivitiesTable"] tbody tr')
      .should('have.length', 6) // Verify that the activities table has 6 instances.
      .eq(0)
      .children()
      .should('have.length', 10)
    cy.get('[data-cy="volunteerActivitiesTable"] tbody tr')
      .eq(0).children().eq(0).should('contain', "A1") // Verify that the first activity in the table is named A1.
  
    // Go to the volunteer activities view
    cy.get('[data-cy="volunteerActivities"]').first().click();
    // Click the "Write Assessment" button
    cy.get('[data-cy="writeAssessmentButton"]').click();
    // Type into the review field
    cy.get('[data-cy="reviewInput"]').type(REVIEW);
    // Click the "Create Assessment" button
    cy.get('[data-cy="saveAssessment"]').click();
  
    cy.wait(1000);
    cy.logout();

  });

});