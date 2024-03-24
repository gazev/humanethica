describe('Enrollment', () => {
  beforeEach(() => {
    cy.deleteAllButArs();
    cy.createEnrollmentTestDemoEntities();
  });

  afterEach(() => {
    cy.deleteAllButArs();
  });

  it('create enrollment', () => {
    const MOTIVATION = 'I am very motivated';
    const INITIAL_NUMBER = '0';
    const FINAL_NUMBER = '1';

    //  As a member:  
    //  - verify number of lines of activity table (3)         
    //  - Verify number of enrollments in 1st activity (0)
    cy.demoMemberLogin();

    cy.intercept('GET', '/users/*/getInstitution').as('getInstitutions');
    cy.get('[data-cy="institution"]').click();
    cy.get('[data-cy="activities"]').click();
    cy.wait('@getInstitutions');

    // check results
    cy.get('[data-cy="memberActivitiesTable"] tbody tr')
      .should('have.length', 3)
      .eq(0)
      .children()
      .should('have.length', 12);
    cy.get('[data-cy="memberActivitiesTable"] tbody tr')
      .eq(0).children().eq(3).should('contain', INITIAL_NUMBER)
    cy.logout();

    //  As a volunteer  
    //  - enroll in first activity
    cy.demoVolunteerLogin();
    cy.intercept('POST', '/activities/*/enrollments').as('register');
    cy.intercept('GET', '/activities').as('getActivities');
    //  - enroll in first activity
    cy.get('[data-cy="volunteerActivities"]').click();
    cy.wait('@getActivities');
    cy.get('[data-cy="applyForActivityButton"]').first().click();
    cy.get('[data-cy="motivationInput"]').type(MOTIVATION);
    cy.get('[data-cy="saveEnrollment"]').click();
    cy.wait('@register');
    cy.logout();

    //  As a member:  
    //  - verify number of enrollments in 1st activity (1)  
    //  - select show enrollments in 1st activity
    //  - verify number of lines of enrollments in 1st activity table (1) with correct motivation      
    cy.demoMemberLogin();
    cy.logout();
  });
});
