import express, {Request, Response} from 'express';
import { json } from 'body-parser';
import ogRoutes from './routes/ogs';
import mongoose from 'mongoose';

// connect to Mongo daemon
mongoose
  .connect(
    'mongodb://fffapp:fffapp@mongo-db:27017/fffapp',
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch((err: Error) => console.log(err));

const app = express();

app.use(json())

app.use('/ogs', ogRoutes);

app.use((err: Error, req: Request, res: Response) => {
  res.status(500).json({message: err.message});
});

app.listen(3000);