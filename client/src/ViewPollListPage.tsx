import React, { Component, MouseEvent } from 'react';
import { Poll, parsePoll } from './poll';
import { isRecord } from './record';

const DEBUG: boolean = true;

type ViewPollListPageProps = {
    onNewPollClick: () => void,
    onRedirectToCurrPollClick: (qName: string) => void
};

type ViewPollListPageState = {
    now: number, // current time when rendering
    // RI: pollList here should MIRROR server pollList
    pollList: Poll[] | undefined
};



export class ViewPollListPage extends Component<ViewPollListPageProps, ViewPollListPageState> {
    constructor(props: ViewPollListPageProps) {
        super(props);
        this.state = {now: Date.now(), pollList: undefined};
    }

    render = (): JSX.Element => {
        if (DEBUG) {console.log(JSON.stringify(this.state))}
        return (
            <div>
                {this.renderPollList()}
                <button type="button" onClick={this.doRefreshClick}>Refresh</button>
                <button type="button" onClick={this.doNewPollClick}>New Poll</button>
            </div>
        );
    };

    renderPollList = (): JSX.Element => {
        if (this.state.pollList === undefined) { // didMount loading
            return (<p>Loading poll list...</p>);
        } else {
            const ongoingPollJSX: JSX.Element[] = [];
            const pastPollJSX: JSX.Element[] = [];
            for (const pll of this.state.pollList) {
                console.log(this.state.pollList);
                const timeLeft = (Math.round((pll.endTime - this.state.now) / 60 / 1000 * 100)) / 100;
                const descOpen = (<span> - {timeLeft} minutes remaining</span>);
                const descClosed = (<span> - closed {-timeLeft} minutes ago</span>);
                if (timeLeft >= 0) {
                    ongoingPollJSX.push(
                        <li key={pll.questionName}>
                            <a href="#" onClick={(evt) => this.doRedirectToCurrPollClick(evt, pll.questionName)}>{pll.questionName}</a>
                            {descOpen}
                        </li>
                    );
                } else {
                    pastPollJSX.push(
                        <li key={pll.questionName}>
                            <a href="#" onClick={(evt) => this.doRedirectToCurrPollClick(evt, pll.questionName)}>{pll.questionName}</a>
                            {descClosed}
                        </li>
                    );
                }
                
            }
            return (
                <div>
                    <h1>Current polls</h1>
                    <h2>Still Open</h2>
                    <ul>{ongoingPollJSX}</ul>
                    <h2>Closed</h2>
                    <ul>{pastPollJSX}</ul>
                </div>
            );
        }
    };


    
    componentDidMount = (): void => {
        fetch("/api/getPollList").then(this.doListResp)
            .catch(() => this.doListError("failed to connect to server"));
    };

    doListResp = (resp: Response): void => {
        if (resp.status === 200) {
            resp.json().then(this.doListJson)
                .catch(() => this.doListError("200 response is not JSON"));
        } else if (resp.status === 400) {
            resp.text().then(this.doListError)
                .catch(() => this.doListError("400 response is not text"));
        } else {
            this.doListError(`bad status code from /api/list: ${resp.status}`);
        }
    };

    doListJson = (data: unknown): void => {
        if (!isRecord(data)) {
            console.error("doListJson: error: data is not a record!")
            return;
        }
        // data.sPollList -> should be Poll[]
        if (!Array.isArray(data.sPollList)) {
            console.error("doListJson: error: data.sPollList is not an array!");
            return;
        }
        const pllList: Poll[] = [];
        for (const pll of data.sPollList) {
            const parsePll = parsePoll(pll);
            if (parsePll === undefined) {
                console.error("doListJson: error: elements of data.sPollList are not polls!");
                return;
            } else {
                pllList.push(pll);
            }
        }
        this.setState({pollList: pllList});
    };

    doListError = (msg: string): void => {
        console.error(`Error w/ GET request fetching /api/getPolllist ${msg}`);
        alert(`Sorry! Server error, details: ${msg}`);
    };


    
    ////// OTHER
    doRefreshClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        const nw = Date.now();
        console.log("doRefreshClick: time is now: " + nw); 
        this.setState({now: nw});
    };



    ////// CALLBACKS
    doNewPollClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        this.props.onNewPollClick();
    };

    doRedirectToCurrPollClick = (evt: MouseEvent<HTMLAnchorElement>, qName: string) : void => {
        evt.preventDefault();
        this.props.onRedirectToCurrPollClick(qName);
    };
}
