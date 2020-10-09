import { CronJob } from "cron";
import * as strikeAccess from "./data/strikes";
import * as meetingAccess from "./data/meetings";
import * as ogAccess from "./data/ogs";
import LogManager from "./LogManager";
import { getOGContent } from "./data/ogcontent";
import { getStrikeImage } from "./data/strikeImage";

const jobs = [
  {
    desc: "Retrieve Strikes",
    tab: "50 * * * *",
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
  },
  {
    desc: "Clean Logs",
    tab: "15 0 * * *",
    job: (): void => {
      console.log("Cleaning Logs");
      LogManager.cleanLogs();
    }
  },
  {
    desc: "Get OG Contents",
    tab: "35 * * * *",
    job: (): void => {
      getOGContent();
    }
  },
  {
    desc: "Get Strike images",
    tab: "37 * * * *",
    job: (): void => {
      getStrikeImage();
    }
  }
];

export const startCronJobs = (): void => {
  jobs.forEach(job => {
    const cronjob = new CronJob(job.tab, job.job, null, true, "Europe/Berlin");
    cronjob.start();
  });
};
