<template>
  <v-card class="table">
    <div class="text-h3">{{ activity.name }}</div>
    <v-data-table
      :headers="headers"
      :items="enrollments"
      :search="search"
      disable-pagination
      :hide-default-footer="true"
      :mobile-breakpoint="0"
      data-cy="activityEnrollmentsTable"
    >
      <template v-slot:top>
        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search"
            class="mx-2"
          />
          <v-spacer />
          <v-btn
            color="primary"
            dark
            @click="getActivities"
            data-cy="getActivities"
            >Activities</v-btn
          >
        </v-card-title>
      </template>
      <template v-slot:[`item.action`]="{ item }">
        <v-tooltip bottom v-if="activity.participantsNumberLimit >
              activity.numberOfParticipations && !item.participating">
          <template v-slot:activator="{ on }">
            <v-icon
              class="mr-2 action-button"
              @click="selectParticipant(item)"
              v-on="on"
              >mdi-check-bold
            </v-icon>
          </template>
          <span>Select Participant</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <select-participant-dialog
      v-if="currentEnrollment && selectParticipantDialog"
      v-model="selectParticipantDialog"
      :enrollment="currentEnrollment"
	  :activity ="activity"
	  v-on:save-select-participant = "onSaveSelectParticipant"
      v-on:close-select-participant-dialog="onCloseSelectParticipantDialog"
    />
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import RemoteServices from '@/services/RemoteServices';
import Activity from '@/models/activity/Activity';
import Enrollment from '@/models/enrollment/Enrollment';
import SelectParticipantDialog from '@/views/member/SelectParticipantDialog.vue';
import Participation from '@/models/participation/Participation';

@Component({
  components: {
    'select-participant-dialog': SelectParticipantDialog,
  },
})
export default class InstitutionActivityEnrollmentsView extends Vue {
  activity!: Activity;
  enrollments: Enrollment[] = [];
  search: string = '';

  currentEnrollment: Enrollment | null = null;
  selectParticipantDialog: boolean = false;

  headers: object = [
    {
      text: 'Name',
      value: 'volunteerName',
      align: 'left',
      width: '25%',
    },
    {
      text: 'Motivation',
      value: 'motivation',
      align: 'left',
      width: '30%',
    },
    {
      text: 'Participating',
      value: 'participating',
      align: 'left',
      width: '15%',
    },
    {
      text: 'Application Date',
      value: 'enrollmentDateTime',
      align: 'left',
      width: '5%',
    },
    {
      text: 'Actions',
      value: 'action',
      align: 'left',
      sortable: false,
      width: '5%',
    },
  ];

  async created() {
    this.activity = this.$store.getters.getActivity;
    if (this.activity !== null && this.activity.id !== null) {
      await this.$store.dispatch('loading');
      try {
        this.enrollments = await RemoteServices.getActivityEnrollments(
          this.activity.id,
        );
      } catch (error) {
        await this.$store.dispatch('error', error);
      }
      await this.$store.dispatch('clearLoading');
    }
  }

  async getActivities() {
    await this.$store.dispatch('setActivity', null);
    this.$router.push({ name: 'institution-activities' }).catch(() => {});
  }

  onSaveSelectParticipan(participation: Participation) {
	for (let enrollment of this.enrollments){
		if(enrollment.volunteerId == participation.volunteerId){
			enrollment.participating = true;
			break;
		}
	}
  }

  onCloseSelectParticipantDialog() {
    this.currentEnrollment = null;
    this.selectParticipantDialog = false;
  }

  selectParticipant(enrollment: Enrollment) {
    this.currentEnrollment = enrollment;
    this.selectParticipantDialog = true;
  }
}
</script>

<style lang="scss" scoped>
.date-fields-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.date-fields-row {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}
</style>
