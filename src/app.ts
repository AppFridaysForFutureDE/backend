import express, {Request, Response} from 'express';
import { json } from 'body-parser';
import ogRoutes from './routes/ogs';
import mongoose from 'mongoose';
var Ddos = require('ddos');
var ddos = new Ddos({burst:10, limit:15});//probably need to adjust these
var mongoUp = true;

//create server, add json encoding and ddos protection
const app = express();
app.use(json())
app.use(ddos.express);


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
    console.log("Server not started because of a critical error that occurred when starting MongoDB");
  });

//initialise routers; every router needs to use ddos
ogRoutes.use(ddos.express);
app.use('/ogs', ogRoutes);

app.use((err: Error, req: Request, res: Response) => {
  res.status(500).json({message: err.message});
});

//only start server when mongo is up
if (mongoUp) {
  app.listen(3000);
}
