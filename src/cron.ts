import { CronJob } from "cron";
import StrikeAccess from "./strikes";
import OGAccess from "./ogs";

// TODO: Refactor to reduce code duplication
export const startCronJobs = (): void => {
  //retrieve strikes and ogs now
  const strikeA = new StrikeAccess();
  console.log("Retrieving Strikes");
  strikeA.retrieveStrikes();
  const ogA = new OGAccess();
  console.log("Retrieving OGs");
  ogA.retrieveOGs();

  //retrieving strikes every day at 0:00
  const strikeJob = new CronJob(
    "0 0 * * *",
    function() {
      console.log("Retrieving Strikes");
      strikeA.retrieveStrikes();
    },
    null,
    true,
    "Europe/Berlin"
  );
  strikeJob.start();

  //retrieving ogs at 0:05 on mondays, wednesdays and fridays
  const ogJob = new CronJob(
    "5 0 * * 1,3,5",
    function() {
      console.log("Retrieving OGs");
      ogA.retrieveOGs();
    },
    null,
    true,
    "Europe/Berlin"
  );
  ogJob.start();

  //check strikes every hour from 8-20
  const strikeNotifyJob = new CronJob(
    "0 8-20 * * *",
    function() {
      console.log("Checking Strikes");
      strikeA.checkStrikes();
    },
    null,
    true,
    "Europe/Berlin"
  );
  strikeNotifyJob.start();
};
