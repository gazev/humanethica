import { ISOtoString } from '@/services/ConvertDateService';
import Activity from '@/models/activity/Activity';


export default class Enrollment {
  id: number | null = null;
  motivation!: string;
  enrollmentDateTime!: string;
  volunteerName!: string;
  participating!: boolean;
  volunteerId!: number;
  activity!: Activity;

  constructor(jsonObj?: Enrollment) {
    if (jsonObj) {
      this.id = jsonObj.id;
      this.motivation = jsonObj.motivation;
      this.enrollmentDateTime = ISOtoString(jsonObj.enrollmentDateTime);
      this.volunteerName = jsonObj.volunteerName;
      this.participating = jsonObj.participating;
      this.volunteerId = jsonObj.volunteerId;
      this.activity = jsonObj.activity;
    }
  }
}
