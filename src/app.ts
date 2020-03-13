import express, {Request, Response, NextFunction} from 'express';
import { json } from 'body-parser';
import ogRoutes from './routes/ogs';

const app = express();

app.use(json())

app.use('/ogs', ogRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({message: err.message});
});

app.listen(3000);