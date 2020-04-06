import mongoose from "mongoose";
import { app } from "./app";
import { startCronJobs } from "./cron";

try {
  // Connect to database
  await mongoose.connect("mongodb://localhost:27017/test", {
    useNewUrlParser: true
  });

  // Start listening to requests on port 3000
  app.listen(3000);

  // Start job scheduler
  startCronJobs();
} catch (error) {
  console.log(error);
}
