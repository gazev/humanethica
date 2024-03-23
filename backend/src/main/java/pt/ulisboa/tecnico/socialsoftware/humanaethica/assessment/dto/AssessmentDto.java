package pt.ulisboa.tecnico.socialsoftware.humanaethica.assessment.dto;

import pt.ulisboa.tecnico.socialsoftware.humanaethica.assessment.domain.Assessment;
import pt.ulisboa.tecnico.socialsoftware.humanaethica.enrollment.domain.Enrollment;
import pt.ulisboa.tecnico.socialsoftware.humanaethica.institution.dto.InstitutionDto;
import pt.ulisboa.tecnico.socialsoftware.humanaethica.utils.DateHandler;

import java.time.LocalDateTime;

public class AssessmentDto {
    private Integer id;
    private String review;
    private String reviewDate;
    private InstitutionDto institution;
    private String volunteerName;

    public AssessmentDto() {}

    public AssessmentDto(Assessment assessment){
        this(assessment, false);
    }

    public AssessmentDto(Assessment assessment, boolean deepCopyInstitution) {
        this.id = assessment.getId();
        this.review = assessment.getReview();
        this.reviewDate = DateHandler.toISOString(assessment.getReviewDate());

        if (deepCopyInstitution && (assessment.getInstitution() != null)) {
            setInstitution(new InstitutionDto(assessment.getInstitution(), false, false));
        }
        
        this.volunteerName = assessment.getVolunteer().getName();
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getReview() {
        return review;
    }

    public void setReview(String review) {
        this.review = review;
    }

    public String getReviewDate() {
        return reviewDate;
    }

    public void setReviewDate(String reviewDate) {
        this.reviewDate = reviewDate;
    }

    public InstitutionDto getInstitution() {
        return institution;
    }

    public void setInstitution(InstitutionDto institution) {
        this.institution = institution;
    }

    public void getVolunteerName(String volunteerName) {
        this.volunteerName = volunteerName;
    }

    public String getVolunteerName(){
        return volunteerName;
    }
}
