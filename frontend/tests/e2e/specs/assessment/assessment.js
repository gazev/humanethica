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
    cy.logout();
  })

});