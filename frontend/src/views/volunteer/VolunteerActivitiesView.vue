<template>
  <div>
    <v-card class="table">
      <v-data-table
        :headers="headers"
        :items="activities"
        :search="search"
        disable-pagination
        :hide-default-footer="true"
        :mobile-breakpoint="0"
        data-cy="volunteerActivitiesTable"
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
          </v-card-title>
        </template>
        <template v-slot:[`item.themes`]="{ item }">
          <v-chip v-for="theme in item.themes" v-bind:key="theme.id">
            {{ theme.completeName }}
          </v-chip>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <v-tooltip v-if="item.state === 'APPROVED'" bottom>
            <template v-slot:activator="{ on }">
              <v-icon
                class="mr-2 action-button"
                color="red"
                v-on="on"
                data-cy="reportButton"
                @click="reportActivity(item)"
                >warning</v-icon
              >
            </template>
            <span>Report Activity</span>
          </v-tooltip>
          <v-tooltip v-if="verifyEnrollmentConditions(item)" bottom>
            <template v-slot:activator="{ on }">
              <v-icon
                  class="mr-2 action-button"
                  color="#0E4D92"
                  v-on="on"
                  data-cy="applyForActivityButton"
                  @click="onOpenEnrollmentDialog(item)"
              >fa-solid fa-user-plus
              </v-icon>
            </template>
            <span>Apply for Activity</span>
          </v-tooltip>
          <v-tooltip v-if="item.allowReview" bottom>
            <template v-slot:activator="{ on }">
              <v-icon
                class="mr-2 action-button"
                color="#4484CD"
                v-on="on"
                data-cy="writeAssessmentButton"
                @click="openAssessmentDialog(item)"
                >fa-solid fa-pen-to-square
              </v-icon>
            </template>
            <span>Create Assessment</span>
          </v-tooltip>
        </template>
      </v-data-table>
      <enrollment-dialog
        v-if="currentActivity && editEnrollmentDialog"
        v-model="editEnrollmentDialog"
        :activity="currentActivity"
        v-on:save-enrollment="onSaveEnrollmentDialog"
        v-on:close-enrollment-dialog="onCloseEnrollmentDialog"
      />
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import RemoteServices from '@/services/RemoteServices';
import Activity from '@/models/activity/Activity';
import Enrollment from '@/models/enrollment/Enrollment';
import EnrollmentDialog from '@/views/volunteer/EnrollmentDialog.vue';
import { show } from 'cli-cursor';

@Component({
  components: {
    'enrollment-dialog': EnrollmentDialog,
  },
  methods: { show },
})
export default class VolunteerActivitiesView extends Vue {
  activities: Activity[] = [];
  volunteerEnrollments: Enrollment[] = [];
  search: string = '';
  currentActivity: Activity | null = null;
  editEnrollmentDialog: boolean = false;
  headers: object = [
    {
      text: 'Name',
      value: 'name',
      align: 'left',
      width: '5%',
    },
    {
      text: 'Region',
      value: 'region',
      align: 'left',
      width: '5%',
    },
    {
      text: 'Participants',
      value: 'participantsNumberLimit',
      align: 'left',
      width: '5%',
    },
    {
      text: 'Themes',
      value: 'themes',
      align: 'left',
      width: '5%',
    },
    {
      text: 'Description',
      value: 'description',
      align: 'left',
      width: '30%',
    },
    {
      text: 'State',
      value: 'state',
      align: 'left',
      width: '5%',
    },
    {
      text: 'Start Date',
      value: 'formattedStartingDate',
      align: 'left',
      width: '5%',
    },
    {
      text: 'End Date',
      value: 'formattedEndingDate',
      align: 'left',
      width: '5%',
    },
    {
      text: 'Application Deadline',
      value: 'formattedApplicationDeadline',
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

  verifyEnrollmentConditions(activity: Activity): boolean {
    return (
        !(this.activityDeadlinePassed(activity)) &&
        !(this.volunteerAlreadyApplied(activity))
    );
  }

  activityDeadlinePassed(activity: Activity): boolean {
    const currentDate = new Date();
    const activityDeadline = new Date(activity.applicationDeadline);
    return currentDate > activityDeadline;
  }

  volunteerAlreadyApplied(activity: Activity){
    return this.volunteerEnrollments.some(
      (enrollment) => enrollment.activity.id === activity.id,
    );
  }

  async created() {
    await this.$store.dispatch('loading');
    try {
      this.activities = await RemoteServices.getActivities();
      this.volunteerEnrollments = await RemoteServices.getVolunteerEnrollments();
      this.activities = await Promise.all(
        this.activities.map(async (activity) => {
          activity.allowReview = !(await this.verifyConditions(activity));
          return activity;
        }),
      );
    } catch (error) {
      await this.$store.dispatch('error', error);
    }
    await this.$store.dispatch('clearLoading');
  }

  async reportActivity(activity: Activity) {
    if (activity.id !== null) {
      try {
        const result = await RemoteServices.reportActivity(
          this.$store.getters.getUser.id,
          activity.id,
        );
        this.activities = this.activities.filter((a) => a.id !== activity.id);
        this.activities.unshift(result);
      } catch (error) {
        await this.$store.dispatch('error', error);
      }
    }
  }
  async verifyConditions(activity: Activity): Promise<boolean> {
    return (
      this.activityHasEnded(activity) &&
      !(await this.volunteerAlreadyRated(activity)) &&
      (await this.volunteerHasParticipation(activity))
    );
  }

  activityHasEnded(activity: Activity): boolean {
    const currentDate = new Date();
    const activityEndDate = new Date(activity.endingDate);
    return currentDate > activityEndDate;
  }

  async volunteerAlreadyRated(activity: Activity) {
    try {
      const institutionId = activity.institution.id;
      if (institutionId !== null) {
        const volunteerAssessments =
          await RemoteServices.getVolunteerAssessments(institutionId);
        return volunteerAssessments.length > 0;
      }
    } catch (error) {
      await this.$store.dispatch('error', error);
    }
  }

  async volunteerHasParticipation(activity: Activity) {
    try {
      const activityId = activity.id;
      if (activityId !== null) {
        const volunteerParticipations =
          await RemoteServices.getVolunteerParticipations(activityId);
        return volunteerParticipations.length > 0;
      }
    } catch (error) {
      await this.$store.dispatch('error', error);
    }
    return false;
  }

  onOpenEnrollmentDialog(activity: Activity) {
    this.currentActivity = activity;
    this.editEnrollmentDialog = true;
  }

  onCloseEnrollmentDialog() {
    this.currentActivity = null;
    this.editEnrollmentDialog = false;
  }

  async onSaveEnrollmentDialog(enrollment: Enrollment) {
    this.volunteerEnrollments = this.volunteerEnrollments.filter(
      (enr) => enr.id !== enrollment.id,
    );
    this.volunteerEnrollments.unshift(enrollment);
    this.editEnrollmentDialog = false;
    this.currentActivity = null;
  }
}

</script>

<style lang="scss" scoped></style>
