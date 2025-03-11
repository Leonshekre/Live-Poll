import express, { Express } from "express";
import { addNewPoll, listPolls, getPollFromName, recordVoteInPollX} from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
app.get("/api/getPollList", listPolls)
app.post("/api/add", addNewPoll);
app.post("/api/getPollFromName", getPollFromName);
app.post("/api/recordVote", recordVoteInPollX);
app.listen(port, () => console.log(`Server listening on ${port}`));
