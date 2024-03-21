package pt.ulisboa.tecnico.socialsoftware.humanaethica.enrollment.dto;

import pt.ulisboa.tecnico.socialsoftware.humanaethica.enrollment.domain.Enrollment;
import pt.ulisboa.tecnico.socialsoftware.humanaethica.utils.DateHandler;

public class EnrollmentDto {
    private Integer id;
    private String motivation;

    private String enrollmentDateTime;
    private String volunteerName;
    private boolean participating;
	private Integer volunteerId;


    public EnrollmentDto() {}

    public EnrollmentDto(Enrollment enrollment) {
        this.id = enrollment.getId();
        this.motivation = enrollment.getMotivation();
        this.enrollmentDateTime = DateHandler.toISOString(enrollment.getEnrollmentDateTime());
        this.volunteerName = enrollment.getVolunteer().getName();
		this.volunteerId = enrollment.getVolunteer().getId();
        this.participating = enrollment.getActivity()
                .getParticipations()
                    .stream()
                    .anyMatch(p -> p.getVolunteer().getId().equals(enrollment.getVolunteer().getId()));
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getMotivation() {
        return motivation;
    }

    public void setMotivation(String motivation) {
        this.motivation = motivation;
    }

    public String getEnrollmentDateTime() {
        return enrollmentDateTime;
    }

    public void setEnrollmentDateTime(String enrollmentDateTime) {
        this.enrollmentDateTime = enrollmentDateTime;
    }

    public String getVolunteerName() {
        return this.volunteerName;
    }

    public void setVolunteerName(String volunteerName) {
        this.volunteerName = volunteerName;
    }

    public boolean getParticipating() {
        return this.participating;
    }

	public void setParticipating(boolean participating) {
		this.participating = participating;
	}

	public Integer getVolunteerId() {
		return this.volunteerId;
	}

    public void setVolunteerId(Integer volunteerId) {
        this.volunteerId = volunteerId;
    }
}
