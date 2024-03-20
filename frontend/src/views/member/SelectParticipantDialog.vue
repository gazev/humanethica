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
            data-cy="participationRating"
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

@Component({})
export default class SelectParticipantDialog extends Vue {
  @Model('dialog', Boolean) dialog!: boolean;
  @Prop({ type: Enrollment, required: true }) readonly enrollment!: Enrollment;

  editEnrollment: Enrollment = new Enrollment();

  async created() {
    this.editEnrollment = new Enrollment(this.enrollment);
  }

  createParticipation() {
    console.log(this.editEnrollment);
  }
}
</script>

<style scoped lang="scss"></style>
