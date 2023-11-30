import express, { Express } from "express";
import { dummy } from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
app.get("/api/dummy", dummy);  // TODO: REMOVE
app.listen(port, () => console.log(`Server listening on ${port}`));
