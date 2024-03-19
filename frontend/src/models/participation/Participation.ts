import { ISOtoString } from '@/services/ConvertDateService';
import Activity from '@/models/activity/Activity';
import Volunteer from '@/models/volunteer/Volunteer';


export default class Participation {
  id: number | null = null;
  activityId: number | null = null;
  volunteerId: number | null = null;
  rating!: number;
  acceptanceDate!: string;
  activity!: Activity;
  volunteer!: Volunteer;


  constructor(jsonObj?: Participation) {
    if (jsonObj) {
      this.id = jsonObj.id;
      this.activityId = jsonObj.activityId;
      this.volunteerId = jsonObj.volunteerId;
      this.rating = jsonObj.rating;
      this.acceptanceDate = ISOtoString(jsonObj.acceptanceDate);
      this.activity = jsonObj.activity;
      this.volunteer = jsonObj.volunteer;
    }
  }
}
