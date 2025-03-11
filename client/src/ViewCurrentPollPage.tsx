import React, { Component, ChangeEvent, MouseEvent } from 'react';
import { Poll, parsePoll } from './poll';
import { isRecord } from './record';

const DEBUG: boolean = true;

type ViewCurrentPollPageProps = {
    onBackClick: () => void,
    // Invariant: should be unique and should be stored in server
    pollQuestionName: string 
};

type ViewCurrentPollPageState = {
    now: number,
    currPoll: Poll | undefined,
    voteRecordedMessage: string;
    // MIRRORED INPUTS BELOW
    // Invariant: Should be unique in the server, should overwrite if trying to vote again
    voterName: string,
    checkedOpt: string | undefined
    // Invariant: if checkedOpts defined: same length as currPoll.options, only 1 boolean value is ever true
    checkedOpts: boolean[] | undefined,
    
};

export class ViewCurrentPollPage extends Component<ViewCurrentPollPageProps, ViewCurrentPollPageState> {
    constructor(props: ViewCurrentPollPageProps) {
        super(props);
        this.state = {now: Date.now(), currPoll: undefined, voterName: "", checkedOpt: undefined, voteRecordedMessage: "", checkedOpts: undefined};
    }



    render = (): JSX.Element => {
        if (DEBUG) {console.log(JSON.stringify(this.state))}
        if (this.state.currPoll === undefined) {
            return(<p>Loading poll ...</p>);
        } else {
            if (this.state.checkedOpts === undefined) {
                return(<p>Loading checked options ...</p>);
            } else {
                if (this.state.currPoll.endTime > this.state.now) {  // ongoing
                    return this.renderOngoingPoll(this.state.currPoll, this.state.checkedOpts);
                } else { // past poll
                    return this.renderPastPoll(this.state.currPoll);
                }
            }
        }
    };

    renderOngoingPoll = (thisPoll: Poll, chkOpts: boolean[]): JSX.Element => {
        const optJSX: JSX.Element[] = [];
        for (const [index, opt] of thisPoll.options.entries()) {
            optJSX.push(
                <div key={index}>
                    <input type="radio" name="group1" checked={chkOpts[index]} value={opt} onChange={(evt) => this.doRadioInputCheckedChange(evt, index)}/>
                    <label>{opt}</label>
                </div> 
            );
        }
        return (
            <div>
                <h1>{thisPoll.questionName}</h1>
                <p>Closes in {Math.round((thisPoll.endTime - this.state.now) / 1000 / 60 * 100) / 100} minutes...</p>
                {optJSX}
                <label>Voter Name:</label>
                <input type="text" value={this.state.voterName} onChange={this.doVoterNameChange}></input>
                <br></br>
                <button type="button" onClick={this.doBackClick}>Back</button>
                <button type="button" onClick={this.doRefreshClick}>Refresh</button>
                <button type="button" onClick={this.doUniqueVoteClick}>Vote</button>
                <br></br>
                <p>{this.state.voteRecordedMessage}</p>
            </div>
        );
    };

    renderPastPoll = (thisPoll: Poll): JSX.Element => {
        const closedOptJSX: JSX.Element[] = [];
        const totalVotes = thisPoll.optionsVoted.length;
        const resultPercentageArr: number[] = [];
        for (const currOpt of thisPoll.options) { // cant use mutation
            const percent = Math.round(((thisPoll.optionsVoted.filter(opt => opt === currOpt).length) / totalVotes) * 100 * 100)/100;
            resultPercentageArr.push(percent);
        }
        for (const [index, opt] of thisPoll.options.entries()) {
            closedOptJSX.push(
                <div key={index}>
                    <li value={opt + "" + index}>{resultPercentageArr[index] + "% - " + opt}</li>
                </div>
            );
        }
        return (
            <div>
                <h1>{thisPoll.questionName}</h1>
                <p>Closed {Math.round((this.state.now - thisPoll.endTime) / 1000 / 60 * 100) / 100} minutes ago</p>

                <ul>
                    {closedOptJSX}
                </ul>
                <button type="button" onClick={this.doBackClick}>Back</button>
                <button type="button" onClick={this.doRefreshClick}>Refresh</button>
            </div>
        );
    };



    componentDidMount = (): void => {
        const args = {cQuestionName: this.props.pollQuestionName};
        fetch("/api/getPollFromName", {method: "POST", body: JSON.stringify(args), headers: {"Content-Type": "application/json"} })
            .then(this.doGetPollResp)
            .catch(() => this.doGetPollError("failed to connect to server"));
    };

    doGetPollResp= (res: Response): void => {
        if (res.status === 200) {
            res.json().then(this.doGetPollJson)
                .catch(() => this.doGetPollError("doGetPollResp: 200 res is not JSON"));
        } else if (res.status === 400) {
            res.text().then(this.doGetPollError)
                .catch(() => this.doGetPollError("doGetPollResp: 400 response is not text"));
        } else {
            this.doGetPollError(`doGetPollResp: bad status code from /api/refersh: ${res.status}`);
        }
    }

    doGetPollJson = (data: unknown): void => {
        if (!isRecord(data)) {
            console.error("doGetPollJson: Error: data is not a record!", data);
            return;
        }
        // data.sPoll should be a valid poll!
        const thisPll = parsePoll(data.sPoll); 
        if (thisPll === undefined) {
            console.log("doCreatePollJson: Error: poll returned from server is invalid!");
            return;
        }
        this.setState({currPoll: thisPll});
        // Set checkedOpts to be a false filled array
        this.setState({checkedOpts: new Array(thisPll.options.length).fill(false)});
    }

    doGetPollError = (msg: string): void => {
        console.error(`Error w/ GET request fetching /api/getPollFromName ${msg}`);
        alert(`Sorry! An error happened with the server, details: ${msg}`);
    }



    ////// OTHER
    doRefreshClick = (): void => {
        this.setState({now: Date.now(), voteRecordedMessage: ""});
    };

    doUniqueVoteClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        if (this.state.checkedOpt === undefined) {
            alert("Please choose an option first!");
            return;
        }
        if (this.state.voterName === "") {
            alert("Please type your name first!");
            return;
        }
        if (this.state.currPoll === undefined) {
            alert("Currpoll is undefined! Impossible!");
            return;
        }
        if (this.state.currPoll.voters.includes(this.state.voterName)) {
            console.log("Given voter's vote will be overwritten");
        }

        const args = {cQuestionName: this.state.currPoll.questionName, cVoterName: this.state.voterName, cChosenOpt: this.state.checkedOpt};
        fetch("/api/recordVote", {method: "POST", body: JSON.stringify(args), headers: {"Content-Type": "application/json"} })
            .then(this.doSendVoteResp)
            .catch(() => this.doSendVoteError("doSendVoteResp: failed to connect to server"));
    };

    doSendVoteResp = (resp: Response): void => {
        if (resp.status === 200) {
            resp.json().then(this.doSendVoteJson)
                .catch(() => this.doSendVoteError("doSendVoteResp: 200 response is not JSON"));
        } else if (resp.status === 400) {
            resp.text().then(this.doSendVoteError)
                .catch(() => this.doSendVoteError("doSendVoteResp: 400 response is not text"));
        } else {
            this.doSendVoteError(`doSendVoteResp: bad status code from /api/list: ${resp.status}`);
        }
    };

    doSendVoteJson = (data: unknown): void => {
        if (!isRecord(data)) {
            console.error("bad data from /api/recordVote: not a record!");
            alert("Sorry! server error! bad data from /api/recordVote: not a record!");
            return;
        }
        // data.voterRecorded and data.optionVotedRecorded should be strings
        if (typeof data.voterRecorded !== "string") {
            console.error("bad data from /api/recordVote: data.voterRecorded is not a string!");
            alert("Sorry! server error! bad data from /api/recordVote: data.voterRecorded is not a string!");
            return;
        }
        if (typeof data.optionVotedRecorded !== "string") {
            console.error("bad data from /api/recordVote: data.optionVotedRecorded is not a string!");
            alert("Sorry! server error! bad data from /api/recordVote: data.optionVotedRecorded is not a string!");
            return;
        }
        const vtRecordedMsg: string = "Recorded vote of '" + data.voterRecorded + "' as '" + data.optionVotedRecorded + "'";
        // Reset mirrored inputs (checkedOpts, voterName, and checkedOpt)
        if (this.state.currPoll === undefined) {
            console.error("this.state.currPoll is undefined! Shouldn't be possible");
            alert("Sorry! server error! this.state.currPoll is undefined! Shouldn't be possible");
            return;
        }
        const falseArr = new Array(this.state.currPoll.options.length).fill(false);
        this.setState({checkedOpt: undefined, voterName: "", voteRecordedMessage: vtRecordedMsg, checkedOpts: falseArr});
    };

    doSendVoteError = (msg: string): void => {
        console.error(`Error fetching /api/recordVote: ${msg}`);
        alert(`Sorry! Server error, details: ${msg}`);
    };



    ////// CALLBACKS
    doBackClick = (_evt: MouseEvent<HTMLButtonElement>): void => { 
        this.props.onBackClick();
    };
    


    ////// MIRRORS
    doVoterNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({voterName: evt.target.value, voteRecordedMessage: ""});
    };

    doRadioInputCheckedChange = (evt: ChangeEvent<HTMLInputElement>, index: number): void => {
        if (this.state.checkedOpts === undefined) {
            console.error("this.state.checkedOpts is undefined! Shouldn't be possible");
            alert("this.state.checkedOpts is undefined! Shouldn't be possible");
            return;
        }
        if (this.state.currPoll === undefined) {
            console.error("this.state.currPoll is undefined! Shouldn't be possible");
            alert("this.state.currPoll is undefined! Shouldn't be possible");
            return;
        }
        // Make checkedOpts arr ONLY contains one checked value as true AND checkedOpt is set accordingly
        const falseArr = new Array(this.state.currPoll.options.length).fill(false);
        const newArr = falseArr.slice(0, index)
            .concat([true])
            .concat(falseArr.slice(index + 1));
        this.setState({checkedOpt: evt.target.value, voteRecordedMessage: "", checkedOpts: newArr});
    };

}