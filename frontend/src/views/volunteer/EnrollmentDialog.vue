<template>
  <v-dialog v-model="dialog" persistent width="1300">
    <v-card>
      <v-card-title>
        <span class="headline"> New Enrollment </span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" lazy-validation>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="*Motivation"
                :rules="[(v) => validMotivation(v) || 'Motivation must be longer than 10 characters']"
                required
                v-model="editEnrollment.motivation"
                data-cy="motivationInput"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="$emit('close-enrollment-dialog')"
        >
          Close
        </v-btn>
        <v-btn
            :disabled="!isValidMotivation"
          color="blue-darken-1"
          variant="text"
          @click="createEnrollment"
          data-cy="saveEnrollment"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Vue, Prop, Model, Component } from 'vue-property-decorator';
import Enrollment from '@/models/enrollment/Enrollment';
import RemoteServices from '@/services/RemoteServices';
import Activity from '@/models/activity/Activity';

@Component
export default class EnrollmentDialog extends Vue {
  @Model('dialog', Boolean) dialog!: boolean;
  @Prop({ type: Activity, required: true }) readonly activity!: Activity;

  editEnrollment: Enrollment = new Enrollment();

  isValidMotivation: Boolean = false;

  cypressCondition: boolean = false;

  async createEnrollment() {
    if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
      try {
        const result = await RemoteServices.createEnrollment(
          this.activity.id,
          this.editEnrollment,
        );
        this.$emit('save-enrollment', result);
      } catch (error) {
        await this.$store.dispatch('error', error);
      }
    }
  }

  validMotivation(value: any){
    if (value == null) return false;
    if (value && typeof value === 'string' && value.length < 10) return false;
    this.isValidMotivation = true;
    return true;
  }
}
</script>

<style scoped lang="scss"></style>
