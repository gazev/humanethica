<template>
  <v-dialog v-model="dialog" persistent width="1300">
    <v-card>
      <v-card-title>
        <span class="headline">Select Participant</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" lazy-validation>
          <v-text-field
            label="Rating (Optional)"
            v-model="participation.rating"
            data-cy="participationRating"
            :rules="[
              (v) =>
                v === '' ||
                isRatingValid(v) ||
                'Rating is either none or a number between 1 and 5, inclusive',
            ]"
            required
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="$emit('close-select-participant-dialog')"
        >
          Close
        </v-btn>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="createParticipation"
          data-cy="createParticipation"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Model, Prop } from 'vue-property-decorator';
import Enrollment from '@/models/enrollment/Enrollment';
import Activity from '@/models/activity/Activity';
import Participation from '@/models/participation/Participation';
import RemoteServices from '@/services/RemoteServices';

@Component({})
export default class SelectParticipantDialog extends Vue {
  @Model('dialog', Boolean) dialog!: boolean;
  @Prop({ type: Enrollment, required: true }) readonly enrollment!: Enrollment;
  @Prop({ type: Activity, required: true }) readonly activity!: Activity;

  participationEnrollment: Enrollment = new Enrollment();
  participationActivity: Activity = new Activity();
  participation: Participation = new Participation();

  async created() {
    this.participationEnrollment = new Enrollment(this.enrollment);
    this.participationActivity = new Activity(this.activity);
    this.participation = new Participation(this.participation);
    this.participation.activityId = this.participationActivity.id;
    this.participation.volunteerId = this.participationEnrollment.volunteerId;
  }

  async createParticipation() {
    if (this.participation.activityId == null) {
      return;
    }
    if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
      try {
        const result = await RemoteServices.createParticipation(
          this.participation.activityId,
          this.participation,
        );
        this.$emit('save-select-participant', result);
      } catch (error) {
        await this.$store.dispatch('error', error);
      }
    }
  }

  isRatingValid(rating: any): boolean {
    if (!/^\d+$/.test(rating)) return false;
    const parsedValue = parseInt(rating);
    return parsedValue >= 1 && parsedValue <= 5;
  }
}
</script>

<style scoped lang="scss"></style>
