import { CronJob } from "cron";
import * as strikeAccess from "./api/strikes";
import * as meetingAccess from "./api/meetings";
import * as ogAccess from "./api/ogs";

const jobs = [
  {
    desc: "Retrieve Strikes",
    tab: "50 1 * * *",
    job: (): void => {
      console.log("Retrieving Strikes");
      strikeAccess.retrieveStrikes();
    }
  },
  {
    desc: "Retrieve Meetings",
    tab: "45 * * * *",
    job: (): void => {
      console.log("Retrieving Meetings");
      meetingAccess.retrieveMeetings();
    }
  },
  {
    desc: "Retrieve OGs",
    tab: "55 * * * *",
    job: (): void => {
      console.log("Retrieving OGs");
      ogAccess.retrieveOGs();
    }
  },
  {
    desc: "Check Strike Notifications",
    tab: "0 8-20 * * *",
    job: (): void => {
      console.log("Checking Strikes");
      strikeAccess.checkStrikes();
    }
  }
];

export const startCronJobs = (): void => {
  jobs.forEach(job => {
    const cronjob = new CronJob(job.tab, job.job, null, true, "Europe/Berlin");
    cronjob.start();
  });
};
