import express, {Request, Response} from 'express';
import { json } from 'body-parser';
import ogRoutes from './routes/ogs';
import mongoose from 'mongoose';
var mongoUp = true;

//create server
const app = express();
app.use(json())


// connect to Mongo daemon
mongoose
  .connect(
    'mongodb://fffapp:fffapp@mongo-db:27017/fffapp',
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(function(err) {
    console.log(err);
    mongoUp = false;//cant use close() here because server isnt already listening
    console.log("Server not started because of a critical error that occurred when starting mongodb");
  });

//initialise routes
app.use('/ogs', ogRoutes);

app.use((err: Error, req: Request, res: Response) => {
  res.status(500).json({message: err.message});
});

//only start server when mongo is up
if (mongoUp) {
  app.listen(3000);
}
