import { ISOtoString } from '@/services/ConvertDateService';


export default class Enrollment {
  id: number | null = null;
  motivation!: string;
  enrollmentDateTime!: string;
  volunteerName!: string;
  participating!: boolean;
  volunteerId!: number;
  activityId!: number;

  constructor(jsonObj?: Enrollment) {
    if (jsonObj) {
      this.id = jsonObj.id;
      this.motivation = jsonObj.motivation;
      this.enrollmentDateTime = ISOtoString(jsonObj.enrollmentDateTime);
      this.volunteerName = jsonObj.volunteerName;
      this.participating = jsonObj.participating;
      this.volunteerId = jsonObj.volunteerId;
      this.activityId = jsonObj.activityId;
    }
  }
}
