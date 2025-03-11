import React, { Component, MouseEvent, ChangeEvent } from 'react';
import { parsePoll } from './poll';
import { isRecord } from './record';

const DEBUG: boolean = true;

type NewPollPageProps = {
    onBackClick: () => void,
    onRedirectToCurrPollClick: (pollQuestionName: string) => void
};

type NewPollPageState = {
    questionName: string,
    minutes: string,
    options: string,
};

export class NewPollPage extends Component<NewPollPageProps, NewPollPageState> {
    constructor(props: NewPollPageProps) {
        super(props);
        this.state = {questionName: "", minutes: "", options: ""};
    }



    render = (): JSX.Element => {
        if (DEBUG) console.log(JSON.stringify(this.state));
        return (
            <div>
                <div>
                <h1>New Poll</h1>
                <br></br>
                <div>
                    <label>Name:</label>
                    <input type="text" value={this.state.questionName} onChange={this.doQuestionNameChange}></input>
                </div>
                <div>
                    <label>Minutes:</label>
                    <input type="number" value={this.state.minutes} onChange={this.doMinutesChange}></input>
                </div>
                <div>
                    <label>Options - one per line, minimum 2 lines:</label><br/>
                    <textarea rows={3} cols={40} value={this.state.options} onChange={this.doOptionsChange}></textarea>
                </div>
                <button type="button" onClick={this.doCreatePollClick}>Create</button>
                <button type="button" onClick={this.doBackClick}>Back</button>
                </div>
            </div>
        );
    };



    // Will not only create a server poll but also redirect to "ViewCurrentPollPage" at the end
    doCreatePollClick = (_: MouseEvent<HTMLButtonElement>): void => {
        // Check that inputs are valid
        if (this.state.questionName === undefined || typeof this.state.questionName !== "string") {
            console.error("doCreatePollClick: Error: questionname is not valid!");
            alert("Given questionName is not given or not of type string!");
            return;
        }
        if (this.state.minutes === undefined || typeof this.state.minutes !== "string") {
            console.error("doCreatePollClick: Error: minutes is not valid!");
            alert("Given minutes is not valid!");
            return;
        }
        if (this.state.options === undefined || typeof this.state.options !== "string") {
            console.error("doCreatePollClick: Error: options is not valid!");
            alert("Given options are not defined or not of type string!");
            return;
        }
        // the question name
        const newQuestionName = this.state.questionName; // trim?
        // makes sure given min is a valid integer input
        const currDate = Date.now();
        const oldMin = parseFloat(this.state.minutes)
        if (isNaN(oldMin) || Math.floor(oldMin) !== oldMin) {
            console.error("minutes given is not an integer or not valid!");
            alert("minutes given is not an integer!");
            return;
        }
        const newEndTime = currDate + (oldMin * 1000 * 60);
        // converst this.state.options from a string to a string[] using split()
        const oldOpts = this.state.options; // trim?
        const newOpts: string[] = oldOpts.split('\n');
        for (const str of newOpts) {
            if (typeof str !== "string") {
                console.error("newOpts[] elements not a string!");
                alert("Given options are not valid!");
                return;
            }
        }
        // Add new poll to server from given input data
        const args = {cQuestionName: newQuestionName, cEndTime: newEndTime, cOptions: newOpts, cVoters: [], cOptionsVoted: []};
        fetch("/api/add", { method: "POST", body: JSON.stringify(args), headers: {"Content-Type": "application/json"} })
            .then(this.doCreatePollResp)
            .catch(() => this.doCreatePollError("failed to connect to server"));
    };

    doCreatePollResp = (resp: Response): void => {
        if (resp.status === 200) {
            resp.json().then(this.doCreatePollJson)
                .catch(() => this.doCreatePollError("doCreatePollResp: 200 response is not JSON"));
        } else if (resp.status === 400) {
            resp.text().then(this.doCreatePollError)
                .catch(() => this.doCreatePollError("doCreatePollResp: 400 response is not text"));
        } else {
            this.doCreatePollError(`doCreatePollResp: bad status code from /api/add: ${resp.status}`);
        }
    }

    doCreatePollJson = (data: unknown): void => {
        if (!isRecord(data)) {
            console.error("doCreatePollJson: Error: data is not record!", data)
            return;
        }
        // data.sPoll should be valid poll
        const thisPll = parsePoll(data.sPoll);
        if (thisPll === undefined) {
            console.error("doCreatePollJson: Error: poll returned from server is invalid!");
            return;
        }
        // Now, immedieatly redirect to ViewCurrentPollPage
        this.doRedirectToCurrPollClick(thisPll.questionName);
    }

    doCreatePollError = (msg: string): void => {
        // Can only check questionName uniqueness in server, therefore if msg is as follows, send alert (errors are still good here)
        if (msg === "The question name is not unique! Pick a new question name!") {
            alert("The question name is not unique! Pick a new question name!");
        }
        console.error(`Error w/ POST request fetching /api/add ${msg}`);
        alert(`Sorry! An unexpected error occured, details: ${msg}`);
    }



    ////// CALLBACKS
    doBackClick = (_: MouseEvent<HTMLButtonElement>): void => {
        this.props.onBackClick();
    };

    doRedirectToCurrPollClick = (qName: string) : void => {
        this.props.onRedirectToCurrPollClick(qName);
    };



    ////// MIRRORS
    doQuestionNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({questionName: evt.target.value});
    };

    doMinutesChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({minutes: evt.target.value});
    };
    
    doOptionsChange =(evt: ChangeEvent<HTMLTextAreaElement>): void => { // NOTE: different ChangeEvent
        this.setState({options: evt.target.value});
    };
}
