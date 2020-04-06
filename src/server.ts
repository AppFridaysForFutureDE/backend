import mongoose from "mongoose";
import { app } from "./app";
import { startCronJobs } from "./cron";

// Connect to database
mongoose
  .connect("mongodb://fffapp:fffapp@mongo-db:27017/fffapp", {
    useNewUrlParser: true
  })
  .then(
    () => {
      // Start listening to requests on port 3000
      app.listen(3000);

      // Start job scheduler
      startCronJobs();
    },
    error => {
      console.log(error);
    }
  );
