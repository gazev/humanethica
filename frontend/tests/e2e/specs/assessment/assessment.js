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
  
    // intercept create assessment request
    cy.intercept('POST', '/institutions/*/assessments').as('createAssessment');
    // Go to the volunteer activities view
    cy.get('[data-cy="volunteerActivities"]').first().click();
    // Click the "Write Assessment" button
    cy.get('[data-cy="writeAssessmentButton"]').first().click();
    // Type into the review field
    cy.get('[data-cy="reviewInput"]').type(REVIEW);
    // Click the "Create Assessment" button
    cy.get('[data-cy="saveAssessment"]').click();
  
    cy.wait('@createAssessment');
    cy.logout();

    cy.demoMemberLogin()
    // intercept get assessments request
    cy.intercept('GET', '/institutions/*/assessments').as('getAssessments');
    // go to volunteer assessments view
    cy.get('[data-cy="institution"]').click();
    cy.get('[data-cy="assessments"]').click();
    // check request was done
    cy.wait('@getAssessments');
    // check results
    cy.get('[data-cy="institutionAssessmentsTable"] tbody tr')
      .should('have.length', 1) // Verify that the ratings table has only one rate.
      .eq(0)
      .children()
      .should('have.length', 3)
    cy.get('[data-cy="institutionAssessmentsTable"] tbody tr')
      .eq(0).children().eq(0).should('contain', REVIEW) // Verify that the rating contains the text entered by the volunteer.
    cy.logout();
  });

});