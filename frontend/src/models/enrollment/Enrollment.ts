import { ISOtoString } from '@/services/ConvertDateService';
import Activity from '@/models/activity/Activity';
import Volunteer from '@/models/volunteer/Volunteer';


export default class Enrollment {
  id: number | null = null;
  motivation!: string;
  enrollmentDateTime!: string;
  volunteerName!: string;
  participating!: boolean;
  volunteerId!: number;
  activity!: Activity;
  volunteer!: Volunteer;


  constructor(jsonObj?: Enrollment) {
    if (jsonObj) {
      this.id = jsonObj.id;
      this.motivation = jsonObj.motivation;
      this.enrollmentDateTime = ISOtoString(jsonObj.enrollmentDateTime);
      this.volunteerName = jsonObj.volunteerName;
      this.participating = jsonObj.participating;
      this.volunteerId = jsonObj.volunteerId;
      this.activity = jsonObj.activity;
      this.volunteer = jsonObj.volunteer;
    }
  }
}
