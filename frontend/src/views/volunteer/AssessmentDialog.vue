<template>
  <v-dialog v-model="dialog" persistent width="1300">
    <v-card>
      <v-card-title>
        <span class="headline"> New Assessment </span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" lazy-validation>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="*Review"
                :rules="[
                  (v) =>
                    validReview(v) ||
                    'Review must be longer than 10 characters',
                ]"
                required
                v-model="editAssessment.review"
                data-cy="reviewInput"
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
          @click="$emit('close-assessment-dialog')"
        >
          Close
        </v-btn>
        <v-btn
          :disabled="!isValidReview"
          color="blue-darken-1"
          variant="text"
          @click="createAssessment"
          data-cy="saveAssessment"
        >
          Create Assessment
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Vue, Prop, Model, Component } from 'vue-property-decorator';
import Assessment from '@/models/assessment/Assessment';
import RemoteServices from '@/services/RemoteServices';
import Activity from '@/models/activity/Activity';

@Component
export default class AssessmentDialog extends Vue {
  @Model('dialog', Boolean) dialog!: boolean;
  @Prop({ type: Activity, required: true }) readonly activity!: Activity;

  editAssessment: Assessment = new Assessment();

  isValidReview: Boolean = false;

  cypressCondition: boolean = false;

  // async created() {
  // this.editAssessment = new Assessment();
  // }

  async createAssessment() {
    if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
      try {
        const result = await RemoteServices.createAssessment(
          this.activity.institution.id,
          this.editAssessment,
        );
        this.$emit('save-assessment', result);
      } catch (error) {
        await this.$store.dispatch('error', error);
      }
    }
  }

  validReview(value: any) {
    if (value == null) return false;
    if (value && typeof value === 'string' && value.length < 10) return false;
    this.isValidReview = true;
    return true;
  }
}
</script>

<style scoped lang="scss"></style>
