import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";

// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check

// Invariant: SHOULD MIRROR poll type in CLIENT! (w/ readonly status)
type Poll = {
  // Invariant: questionName should be unique in each poll!
  questionName: string,
  endTime: number,
  options: string[],
  // Invariant: voters & optionVoted should act like a map with key,value pair for each index!
  // voters[] has unique values and has the same length as options voted
  voters: string[],
  // Invariant: optionsVoted contains only options from options!
  optionsVoted: string[],
};

// Invariant: requires key values to be unique!
const sPollMap: Map<string, Poll> = new Map();

// A way to organize and compare polls when using .sort
const comparePolls = (a: Poll, b: Poll): number => {
  const now: number = Date.now();
  const endA = now <= a.endTime ? a.endTime : 1e15 - a.endTime;
  const endB = now <= b.endTime ? b.endTime : 1e15 - b.endTime;
  return endA - endB;
};

/**
 * Handles GET request to retrieve entire pollMap from server and send a sorted version to client
 * @param _req the request
 * @param res the response
 * @returns the pollMap from server and send it to the client in a sorted order
 */
export const listPolls = (_req: SafeRequest, res: SafeResponse): void => {
  const vals = Array.from(sPollMap.values());
  vals.sort(comparePolls);
  res.send({sPollList: vals});
};

/**
 * Handles POST request to add a new Poll object into the server pollMap
 * @requires req.body.cVoters, req.body.cOptionsVoted to be empty string arrays
 * @param req the request, contains req.body... cQuestionName, cEndTime, cOptions, cVoters, cOptionsVoted
 * @param res the response
 * @throws if any of the given request params are invalid
 * @returns the new poll created in a record to the client
 */
export const addNewPoll = (req: SafeRequest, res: SafeResponse): void => {
  const sQuestionName = req.body.cQuestionName;
  if (sQuestionName === undefined || typeof sQuestionName !== "string") {
    res.status(400).send("sQuestionName is missing or not of type string");
    return;
  }
  const sEndTime = req.body.cEndTime;
  if (sEndTime === undefined || typeof sEndTime !== "number") {
    res.status(400).send("sEndTime is missing or not of type number");
    return;
  }
  const sOptions = req.body.cOptions;
  if (sOptions === undefined || !Array.isArray(sOptions)) {
    res.status(400).send("sOptions is missing or not of type array!");
    return;
  }
  for (const str of sOptions) {
    if (str === undefined || typeof str !== "string") {
      res.status(400).send("Elements of sOptions[] are not string!");
      return;
    }
  }
  // Check that sVoters and sOptiosnVoted are valid
  const sVoters = req.body.cVoters;
  const sOptionsVoted = req.body.cOptionsVoted;
  if (sVoters === undefined || !Array.isArray(sVoters) || sOptionsVoted === undefined || !Array.isArray(sOptionsVoted)) {
    res.status(400).send("sVoters or sOptionsVoted is missing or not of type array!");
    return;
  }
  for (const s1 of sVoters) {
    if (typeof s1 !== "string") {
      res.status(400).send("sVoters elements should be strings!");
      return;
    }
  }
  for (const s2 of sOptionsVoted) {
    if (typeof s2 !== "string") {
      res.status(400).send("sOptionsVoted elements should be strings!");
      return;
    }
  }
  // Check that sQuestionName is UNIQUE!
  if (sPollMap.get(sQuestionName) !== undefined) {
    res.status(400).send("The question name is not unique! Pick a new question name!");
    return;
  }
  // Create and set poll in server arnd return it in response
  const newPll : Poll = {questionName: sQuestionName, endTime: sEndTime, options: sOptions, optionsVoted: sOptionsVoted, voters: sVoters};
  sPollMap.set(sQuestionName, newPll);
  res.send({sPoll: newPll});
};

/**
 * Handles POST request to get the server poll from a given, unique questionName
 * @param req the request, contains req.body... cQuestoinName
 * @param res the response
 * @throws if any of the given req params are invalid OR if the questionName is not found
 * @returns the required poll from a given, unique questionName
 */
export const getPollFromName = (req: SafeRequest, res: SafeResponse): void => {
  const sQuestionName = req.body.cQuestionName;
  if (sQuestionName === undefined || typeof sQuestionName !== "string") {
    res.status(400).send("The question name is undefined or not of type string!");
    return;
  }
  const getPll = sPollMap.get(sQuestionName);
  if (getPll === undefined) {
    res.status(400).send("The question name is not in the server!");
    return;
  }
  res.send({sPoll: getPll});
};

/**
 * Handles POST request to record the vote in the voters array in the poll found from pollName
 * and overwrites a option voted if the voter is previously in the voters array
 * @param req the request, includes params req.body... cQuestionName, cVoterName, cChosenOpt
 * @param res the response
 * @throws if any of the request params are invalid OR if the voters/optionsVoted invariants are broken
 * @returns the recorded voter name and question name
 */
export const recordVoteInPollX = (req: SafeRequest, res: SafeResponse): void => {
  const sQuestionName = req.body.cQuestionName;
  if (sQuestionName === undefined || typeof sQuestionName !== "string") {
    res.status(400).send("The question name is undefined or not of type string!");
    return;
  }
  const sVoterName = req.body.cVoterName;
  if (sVoterName === undefined || typeof sVoterName !== "string" || sVoterName.length === 0) {
    res.status(400).send("The given voterName is undefined or not of type string or empty!");
    return;
  }
  const sChosenOpt = req.body.cChosenOpt;
  if (sChosenOpt === undefined || typeof sChosenOpt !== "string") {
    res.status(400).send("The chosen options is undefined or not of type string!");
    return;
  }
  // make sure questionName is in the pollmap
  const thisPll = sPollMap.get(sQuestionName);
  if (thisPll === undefined) {
    res.status(400).send("The question name is not part of a pollmap from server data!");
    return;
  }
  if (!thisPll.options.includes(sChosenOpt)) {
    res.status(400).send("The chosen option is not an option in the poll!");
    return;
  }
  const ind = thisPll.voters.indexOf(sVoterName);
  if (ind >= 0) { // voterName already recorded, overwrite past vote
    thisPll.optionsVoted[ind] = sChosenOpt;
  } else { // new voterName
    thisPll.voters.push(sVoterName);
    thisPll.optionsVoted.push(sChosenOpt);
  }
  // Simple check to see if invariant is maintained
  if (thisPll.voters.length !== thisPll.optionsVoted.length) {
    res.status(400).send("The voters and optionsVoted arrays are not of the same length! Invariant broken!");
    return;
  }
  res.send({voterRecorded: sVoterName, optionVotedRecorded: sChosenOpt});
};


/**
 * A simple server poll map reset for testing purposes
 */
export const resetForTesting = (): void => {
  sPollMap.clear();
};
