import { CronJob } from "cron";
import * as strikeAccess from "./api/strikes";
import * as ogAccess from "./api/ogs";

const jobs = [
  {
    desc: "Retrieve Strikes",
    tab: "0 0 * * *",
    job: function() {
      console.log("Retrieving Strikes");
      strikeAccess.retrieveStrikes();
    }
  },
  {
    desc: "Retrieve OGs",
    tab: "5 0 * * *",
    job: function() {
      console.log("Retrieving OGs");
      ogAccess.retrieveOGs();
    }
  },
  {
    desc: "Check Strike Notifications",
    tab: "0 8-23 * * *",
    job: function() {
      console.log("Checking Strikes");
      strikeAccess.checkStrikes();
    }
  }
];

export const startCronJobs = (): void => {
  jobs.forEach(job => {
    const cronjob = new CronJob(
      job.tab,
      job.job,
      null,
      true,
      "Europe/Berlin"
    );
    cronjob.start();
  });
};
