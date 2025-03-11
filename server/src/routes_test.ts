import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { addNewPoll, getPollFromName, listPolls, recordVoteInPollX, resetForTesting} from './routes';


describe('routes', function() {



  it('addNewPoll', function() {
    // 1st branch, ERROR: req.body.cQuestionName is undefined
    const reqS1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add', body: {}}); 
    const resS1 = httpMocks.createResponse();
    addNewPoll(reqS1, resS1);
    assert.strictEqual(resS1._getStatusCode(), 400);
    assert.deepEqual(resS1._getData(), 'sQuestionName is missing or not of type string');
    
    // 1st branch, ERROR: req.body.cQuestionName is not string
    const date1 = Date.now() + 60 * 1000
    const reqS2 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add', body: {cQuestionName: 7, cEndTime: date1, cOptions: ["Pizza", "burger"], cVoters: [], cOptionsVoted: []}}); 
    const resS2 = httpMocks.createResponse();
    addNewPoll(reqS2, resS2);
    assert.strictEqual(resS2._getStatusCode(), 400);
    assert.deepEqual(resS2._getData(), 'sQuestionName is missing or not of type string');

    // 2nd branch, ERROR: req.body.cEndTime is undefined
    const reqS3 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add', body: {cQuestionName: "Breakfast?", cOptions: ["Pizza", "burger"], cVoters: [], cOptionsVoted: []}}); 
    const resS3 = httpMocks.createResponse();
    addNewPoll(reqS3, resS3);
    assert.strictEqual(resS3._getStatusCode(), 400);
    assert.deepEqual(resS3._getData(), 'sEndTime is missing or not of type number');

    // 2nd branch, ERROR: req.body.cEndTime is not a number
    const reqS4 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add', body: {cQuestionName: "Breakfast?", cEndTime: "date1", cOptions: ["Pizza", "burger"], cVoters: [], cOptionsVoted: []}}); 
    const resS4 = httpMocks.createResponse();
    addNewPoll(reqS4, resS4);
    assert.strictEqual(resS4._getStatusCode(), 400);
    assert.deepEqual(resS4._getData(), 'sEndTime is missing or not of type number');

    // 3rd branch, ERROR: req.body.cOptions is undefined
    const reqS5 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add', body: {cQuestionName: "Breakfast?", cEndTime: date1, cVoters: [], cOptionsVoted: []}}); 
    const resS5 = httpMocks.createResponse();
    addNewPoll(reqS5, resS5);
    assert.strictEqual(resS5._getStatusCode(), 400);
    assert.deepEqual(resS5._getData(), 'sOptions is missing or not of type array!');

    // 3rd branch, ERROR: req.body.cOptions is not an array
    const reqS6 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add', body: {cQuestionName: "Breakfast?", cEndTime: date1, cOptions: "yep", cVoters: [], cOptionsVoted: []}}); 
    const resS6 = httpMocks.createResponse();
    addNewPoll(reqS6, resS6);
    assert.strictEqual(resS6._getStatusCode(), 400);
    assert.deepEqual(resS6._getData(), 'sOptions is missing or not of type array!');

    // 4th branch, ERROR: req.body.cOptions elements not of type string
    const reqS7 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add', body: {cQuestionName: "Breakfast?", cEndTime: date1, cOptions: [2, 7], cVoters: [], cOptionsVoted: []}}); 
    const resS7 = httpMocks.createResponse();
    addNewPoll(reqS7, resS7);
    assert.strictEqual(resS7._getStatusCode(), 400);
    assert.deepEqual(resS7._getData(), 'Elements of sOptions[] are not string!');

    // 5th branch, ERROR: req.body.cVoters is undefined
    const reqS8 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add', body: {cQuestionName: "Breakfast?", cEndTime: date1, cOptions: ["Pizza", "burger"], cOptionsVoted: []}}); 
    const resS8 = httpMocks.createResponse();
    addNewPoll(reqS8, resS8);
    assert.strictEqual(resS8._getStatusCode(), 400);
    assert.deepEqual(resS8._getData(), 'sVoters or sOptionsVoted is missing or not of type array!');

    // 5th branch, ERROR: req.body.cVoters is not an array
    const reqS9 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add', body: {cQuestionName: "Breakfast?", cEndTime: date1, cOptions: ["Pizza", "burger"], cVoters: "hey", cOptionsVoted: []}}); 
    const resS9 = httpMocks.createResponse();
    addNewPoll(reqS9, resS9);
    assert.strictEqual(resS9._getStatusCode(), 400);
    assert.deepEqual(resS9._getData(), 'sVoters or sOptionsVoted is missing or not of type array!');

    // 5th branch, ERROR: req.body.cOptionsVoted is undefined
    const reqS10 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add', body: {cQuestionName: "Breakfast?", cEndTime: date1, cOptions: ["Pizza", "burger"], cVoters: []}}); 
    const resS10 = httpMocks.createResponse();
    addNewPoll(reqS10, resS10);
    assert.strictEqual(resS10._getStatusCode(), 400);
    assert.deepEqual(resS10._getData(), 'sVoters or sOptionsVoted is missing or not of type array!');

    // 5th branch, ERROR: req.body.cOptionsVoted is not an array
    const reqS11 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add', body: {cQuestionName: "Breakfast?", cEndTime: date1, cOptions: ["Pizza", "burger"], cVoters: [], cOptionsVoted: "hey"}}); 
    const resS11 = httpMocks.createResponse();
    addNewPoll(reqS11, resS11);
    assert.strictEqual(resS11._getStatusCode(), 400);
    assert.deepEqual(resS11._getData(), 'sVoters or sOptionsVoted is missing or not of type array!');

    // 6th branch, ERROR: elements of sVoters are not of type string
    const reqS12 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add', body: {cQuestionName: "Breakfast?", cEndTime: date1, cOptions: ["Pizza", "burger"], cVoters: [7, 6], cOptionsVoted: []}}); 
    const resS12 = httpMocks.createResponse();
    addNewPoll(reqS12, resS12);
    assert.strictEqual(resS12._getStatusCode(), 400);
    assert.deepEqual(resS12._getData(), 'sVoters elements should be strings!');

    // 7th branch, ERROR: elements of sOptionsVOted are not of type string
    const reqS13 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add', body: {cQuestionName: "Breakfast?", cEndTime: date1, cOptions: ["Pizza", "burger"], cVoters: [], cOptionsVoted: [7, 6]}}); 
    const resS13 = httpMocks.createResponse();
    addNewPoll(reqS13, resS13);
    assert.strictEqual(resS13._getStatusCode(), 400);
    assert.deepEqual(resS13._getData(), 'sOptionsVoted elements should be strings!');

    // Working test
    const testBody2 = {cQuestionName: "Breakfast?", cEndTime: date1, cOptions: ["Pizza", "burger"], cVoters: [], cOptionsVoted: []};
    const reqSW = httpMocks.createRequest(
      {method: 'POST', url: '/api/add', body: testBody2}); 
    const resSW = httpMocks.createResponse();
    addNewPoll(reqSW, resSW);
    assert.strictEqual(resSW._getStatusCode(), 200);
    assert.deepStrictEqual(resSW._getData().sPoll.questionName, "Breakfast?");
    assert.deepStrictEqual(resSW._getData().sPoll.endTime, date1);
    assert.deepStrictEqual(resSW._getData().sPoll.options, ["Pizza", "burger"]);
    assert.deepStrictEqual(resSW._getData().sPoll.voters, []);
    assert.deepStrictEqual(resSW._getData().sPoll.optionsVoted, []);

    // 8th branch, ERROR: sQuestion name should be unique!
    const reqS14 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add', body: {cQuestionName: "Breakfast?", cEndTime: date1, cOptions: ["Pizza", "burger"], cVoters: [], cOptionsVoted: []}}); 
    const resS14 = httpMocks.createResponse();
    addNewPoll(reqS14, resS14);
    assert.strictEqual(resS14._getStatusCode(), 400);
    assert.deepEqual(resS14._getData(), 'The question name is not unique! Pick a new question name!');

    resetForTesting();
  });
  

  
  it('listPolls', function() { // NOTE: listPolls gives back sPollMap.values()!
    // map is empty test
    const reqL1 = httpMocks.createRequest(
      {method: 'GET', url: '/api/getPollMap', query: {}});
    const resL1 = httpMocks.createResponse();
    listPolls(reqL1, resL1);
    assert.strictEqual(resL1._getStatusCode(), 200);
    assert.deepStrictEqual(resL1._getData(), {sPollList: []});

    // Add 2 elements to sPollMap
    const date1 = Date.now() + 60 * 1000;
    const testBody1 = {cQuestionName: "Breakfast?", cEndTime: date1, cOptions: ["Cereal", "Banana"], cVoters: [], cOptionsVoted: []};
    const reqS1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add', body: testBody1}); 
    const resS1 = httpMocks.createResponse();
    addNewPoll(reqS1, resS1);
    assert.strictEqual(resS1._getStatusCode(), 200);
    assert.deepStrictEqual(resS1._getData().sPoll.questionName, "Breakfast?");
    assert.deepStrictEqual(resS1._getData().sPoll.voters, []);
    assert.deepStrictEqual(resS1._getData().sPoll.optionsVoted, []);
    const date2 = Date.now() + 60 * 1000;
    const testBody2 = {cQuestionName: "Lunch?", cEndTime: date2, cOptions: ["Pizza", "burger"], cVoters: [], cOptionsVoted: []};
    const reqS2 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add', body: testBody2}); 
    const resS2 = httpMocks.createResponse();
    addNewPoll(reqS2, resS2);
    assert.strictEqual(resS2._getStatusCode(), 200);
    assert.deepStrictEqual(resS2._getData().sPoll.questionName, "Lunch?");
    assert.deepStrictEqual(resS2._getData().sPoll.voters, []);
    assert.deepStrictEqual(resS2._getData().sPoll.optionsVoted, []);

    // Check list with 2 elements test
    const req5 = httpMocks.createRequest(
      {method: 'GET', url: '/api/getPollMap', query: {}});
    const res5 = httpMocks.createResponse();
    listPolls(req5, res5);
    assert.strictEqual(res5._getStatusCode(), 200);
    assert.deepStrictEqual(res5._getData().sPollList.length, 2);
    assert.deepStrictEqual(res5._getData().sPollList[0].questionName, "Breakfast?");
    assert.deepStrictEqual(res5._getData().sPollList[0].endTime, date1);
    assert.deepStrictEqual(res5._getData().sPollList[0].options, ["Cereal", "Banana"]);
    assert.deepStrictEqual(res5._getData().sPollList[0].voters, []);
    assert.deepStrictEqual(res5._getData().sPollList[0].optionsVoted, []);
    assert.deepStrictEqual(res5._getData().sPollList[1].questionName, "Lunch?");
    assert.deepStrictEqual(res5._getData().sPollList[1].endTime, date2);
    assert.deepStrictEqual(res5._getData().sPollList[1].options, ["Pizza", "burger"]);
    assert.deepStrictEqual(res5._getData().sPollList[1].voters, []);
    assert.deepStrictEqual(res5._getData().sPollList[1].optionsVoted, []);
    
    resetForTesting();
  });



  it('getPollFromName', function() {
    // Add 2 elements to sPollMap
    const date1E = Date.now() + 60 * 1000;
    const testBody1E = {cQuestionName: "Breakfast?", cEndTime: date1E, cOptions: ["Cereal", "Banana"], cVoters: [], cOptionsVoted: []};
    const reqS1E = httpMocks.createRequest(
      {method: 'POST', url: '/api/add', body: testBody1E}); 
    const resS1E = httpMocks.createResponse();
    addNewPoll(reqS1E, resS1E);
    assert.strictEqual(resS1E._getStatusCode(), 200);
    assert.deepStrictEqual(resS1E._getData().sPoll.questionName, "Breakfast?");
    assert.deepStrictEqual(resS1E._getData().sPoll.voters, []);
    assert.deepStrictEqual(resS1E._getData().sPoll.optionsVoted, []);
    const date2E = Date.now() + 60 * 1000;
    const testBody2E = {cQuestionName: "Lunch?", cEndTime: date2E, cOptions: ["Pizza", "burger"], cVoters: [], cOptionsVoted: []};
    const reqS2E = httpMocks.createRequest(
      {method: 'POST', url: '/api/add', body: testBody2E}); 
    const resS2E = httpMocks.createResponse();
    addNewPoll(reqS2E, resS2E);
    assert.strictEqual(resS2E._getStatusCode(), 200);
    assert.deepStrictEqual(resS2E._getData().sPoll.questionName, "Lunch?");
    assert.deepStrictEqual(resS2E._getData().sPoll.voters, []);
    assert.deepStrictEqual(resS2E._getData().sPoll.optionsVoted, []);

    // 1st branch, ERROR: sQuestionName is undefined
    const testBody1 = {};
    const reqS1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/getPollFromName', body: testBody1}); 
    const resS1 = httpMocks.createResponse();
    getPollFromName(reqS1, resS1);
    assert.strictEqual(resS1._getStatusCode(), 400);
    assert.deepStrictEqual(resS1._getData(), "The question name is undefined or not of type string!");

    // 1st branch, ERROR: sQuestionName is not a string
    const testBody2 = {cQuestionName: 7};
    const reqS2 = httpMocks.createRequest(
      {method: 'POST', url: '/api/getPollFromName', body: testBody2}); 
    const resS2 = httpMocks.createResponse();
    getPollFromName(reqS2, resS2);
    assert.strictEqual(resS2._getStatusCode(), 400);
    assert.deepStrictEqual(resS2._getData(), "The question name is undefined or not of type string!");

    // 2nd branch, ERROR: sQuestionName is not in the map
    const testBody3 = {cQuestionName: "Not here?"};
    const reqS3 = httpMocks.createRequest(
      {method: 'POST', url: '/api/getPollFromName', body: testBody3}); 
    const resS3 = httpMocks.createResponse();
    getPollFromName(reqS3, resS3);
    assert.strictEqual(resS3._getStatusCode(), 400);
    assert.deepStrictEqual(resS3._getData(), "The question name is not in the server!");

    // Working
    const testBody4 = {cQuestionName: "Breakfast?"};
    const reqS4 = httpMocks.createRequest(
      {method: 'POST', url: '/api/getPollFromName', body: testBody4}); 
    const resS4 = httpMocks.createResponse();
    getPollFromName(reqS4, resS4);
    assert.strictEqual(resS4._getStatusCode(), 200);
    assert.deepStrictEqual(resS4._getData().sPoll.questionName, "Breakfast?");
    assert.deepStrictEqual(resS4._getData().sPoll.endTime, date1E);
    assert.deepStrictEqual(resS4._getData().sPoll.options, ["Cereal", "Banana"]);
    assert.deepStrictEqual(resS4._getData().sPoll.optionsVoted, []);
    assert.deepStrictEqual(resS4._getData().sPoll.voters, []);

    resetForTesting();
  });



  it('recordVoteInPollX', function() {
    // 1st branch, ERROR: req.body.cQuestionName is undefined
    const reqR1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/recordVote', body: {cVoterName: "Leo", cChosenOpt: "Cereal"}}); 
    const resR1 = httpMocks.createResponse();
    recordVoteInPollX(reqR1, resR1);
    assert.strictEqual(resR1._getStatusCode(), 400);
    assert.deepEqual(resR1._getData(), 'The question name is undefined or not of type string!');

    // 1st branch, ERROR: req.body.cQuestionName is not a string
    const reqR2 = httpMocks.createRequest(
      {method: 'POST', url: '/api/recordVote', body: {cQuestionName: 7, cVoterName: "Leo", cChosenOpt: "Cereal"}}); 
    const resR2 = httpMocks.createResponse();
    recordVoteInPollX(reqR2, resR2);
    assert.strictEqual(resR2._getStatusCode(), 400);
    assert.deepEqual(resR2._getData(), 'The question name is undefined or not of type string!');

    // 2nd branch, ERROR: req.body.cVoterName is undefined
    const reqR3 = httpMocks.createRequest(
      {method: 'POST', url: '/api/recordVote', body: {cQuestionName: "Breakfast?", cChosenOpt: "Cereal"}}); 
    const resR3 = httpMocks.createResponse();
    recordVoteInPollX(reqR3, resR3);
    assert.strictEqual(resR3._getStatusCode(), 400);
    assert.deepEqual(resR3._getData(), 'The given voterName is undefined or not of type string or empty!');

    // 2nd branch, ERROR: req.body.cVoterName is not a string
    const reqR4 = httpMocks.createRequest(
      {method: 'POST', url: '/api/recordVote', body: {cQuestionName: "Breakfast?", cVoterName: 7, cChosenOpt: "Cereal"}}); 
    const resR4 = httpMocks.createResponse();
    recordVoteInPollX(reqR4, resR4);
    assert.strictEqual(resR4._getStatusCode(), 400);
    assert.deepEqual(resR4._getData(), 'The given voterName is undefined or not of type string or empty!');

    // 2nd branch, ERROR: req.body.cVoterName is of length 0
    const reqR5 = httpMocks.createRequest(
      {method: 'POST', url: '/api/recordVote', body: {cQuestionName: "Breakfast?", cVoterName: "", cChosenOpt: "Cereal"}}); 
    const resR5 = httpMocks.createResponse();
    recordVoteInPollX(reqR5, resR5);
    assert.strictEqual(resR5._getStatusCode(), 400);
    assert.deepEqual(resR5._getData(), 'The given voterName is undefined or not of type string or empty!');

    // 3rd branch, ERROR: req.body.cChosenOpt is not defined
    const reqR6 = httpMocks.createRequest(
      {method: 'POST', url: '/api/recordVote', body: {cQuestionName: "Breakfast?", cVoterName: "Leo"}}); 
    const resR6 = httpMocks.createResponse();
    recordVoteInPollX(reqR6, resR6);
    assert.strictEqual(resR6._getStatusCode(), 400);
    assert.deepEqual(resR6._getData(), 'The chosen options is undefined or not of type string!');

    // 3rd branch, ERROR: req.body.cChosenOpt is not a string
    const reqR7 = httpMocks.createRequest(
      {method: 'POST', url: '/api/recordVote', body: {cQuestionName: "Breakfast?", cVoterName: "Leo", cChosenOpt: 7}}); 
    const resR7 = httpMocks.createResponse();
    recordVoteInPollX(reqR7, resR7);
    assert.strictEqual(resR7._getStatusCode(), 400);
    assert.deepEqual(resR7._getData(), 'The chosen options is undefined or not of type string!');

    // Add 1 element to sPollMap
    const date1 = Date.now() + 60 * 1000;
    const testBody1 = {cQuestionName: "Breakfast?", cEndTime: date1, cOptions: ["Cereal", "Banana"], cVoters: [], cOptionsVoted: []};
    const reqS1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add', body: testBody1}); 
    const resS1 = httpMocks.createResponse();
    addNewPoll(reqS1, resS1);
    assert.strictEqual(resS1._getStatusCode(), 200);
    assert.deepStrictEqual(resS1._getData().sPoll.questionName, "Breakfast?");
    assert.deepStrictEqual(resS1._getData().sPoll.voters, []);
    assert.deepStrictEqual(resS1._getData().sPoll.optionsVoted, []);

    // 4th branch, ERROR: given questionName is not in the pollmap
    const reqR8 = httpMocks.createRequest(
      {method: 'POST', url: '/api/recordVote', body: {cQuestionName: "Not here?", cVoterName: "Leo", cChosenOpt: "Cereal"}}); 
    const resR8 = httpMocks.createResponse();
    recordVoteInPollX(reqR8, resR8);
    assert.strictEqual(resR8._getStatusCode(), 400);
    assert.deepEqual(resR8._getData(), 'The question name is not part of a pollmap from server data!');

    // 5th branch, ERROR: given option is not an option in poll!
    const reqR9 = httpMocks.createRequest(
      {method: 'POST', url: '/api/recordVote', body: {cQuestionName: "Breakfast?", cVoterName: "Leo", cChosenOpt: "burger"}}); 
    const resR9 = httpMocks.createResponse();
    recordVoteInPollX(reqR9, resR9);
    assert.strictEqual(resR9._getStatusCode(), 400);
    assert.deepEqual(resR9._getData(), 'The chosen option is not an option in the poll!');

    // Working with 1 vote
    const reqR10 = httpMocks.createRequest(
      {method: 'POST', url: '/api/recordVote', body: {cQuestionName: "Breakfast?", cVoterName: "Leo", cChosenOpt: "Cereal"}}); 
    const resR10 = httpMocks.createResponse();
    recordVoteInPollX(reqR10, resR10);
    assert.strictEqual(resR10._getStatusCode(), 200);
    assert.deepEqual(resR10._getData().voterRecorded, "Leo");
    assert.deepEqual(resR10._getData().optionVotedRecorded, "Cereal");

    // Working with 2 votes
    const reqR11 = httpMocks.createRequest(
      {method: 'POST', url: '/api/recordVote', body: {cQuestionName: "Breakfast?", cVoterName: "Jack", cChosenOpt: "Banana"}}); 
    const resR11 = httpMocks.createResponse();
    recordVoteInPollX(reqR11, resR11);
    assert.strictEqual(resR11._getStatusCode(), 200);
    assert.deepEqual(resR11._getData().voterRecorded, "Jack");
    assert.deepEqual(resR11._getData().optionVotedRecorded, "Banana");

    // Working with overwritten vote
    const reqR12 = httpMocks.createRequest(
      {method: 'POST', url: '/api/recordVote', body: {cQuestionName: "Breakfast?", cVoterName: "Jack", cChosenOpt: "Cereal"}}); 
    const resR12 = httpMocks.createResponse();
    recordVoteInPollX(reqR12, resR12);
    assert.strictEqual(resR12._getStatusCode(), 200);
    assert.deepEqual(resR12._getData().voterRecorded, "Jack");
    assert.deepEqual(resR12._getData().optionVotedRecorded, "Cereal");

    resetForTesting();
  });


});

