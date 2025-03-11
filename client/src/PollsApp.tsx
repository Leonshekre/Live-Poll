import React, { Component } from "react"; // ChangeEvent, MouseEvent
import { ViewPollListPage } from './ViewPollListPage'; 
import { NewPollPage } from './NewPollPage'; 
import { ViewCurrentPollPage } from './ViewCurrentPollPage'; 

const DEBUG: boolean = true;

// Indicates which page to show. If it is the ViewCurrentPollPage, also has a string to
// find the poll with the given questionName in the server
type Page = "ViewPollListPage" | "NewPollPage" | {kind: "ViewCurrentPollPage", pollQuestionName: string};

type PollsAppState = {
  currPage: Page;
}

/** Displays the UI of the Polls application. */
export class PollsApp extends Component<{}, PollsAppState> {

  constructor(props: {}) {
    super(props);
    this.state = {currPage: "ViewPollListPage"};
  }
  


  render = (): JSX.Element => {
    if (DEBUG) console.log(JSON.stringify(this.state));

    if (this.state.currPage === "ViewPollListPage") {
      return <ViewPollListPage onNewPollClick={this.doNewPollClick} onRedirectToCurrPollClick={this.doRedirectToCurrPollClick}/>;
    } else if (this.state.currPage === "NewPollPage") {
      return <NewPollPage onBackClick={this.doBackClick} onRedirectToCurrPollClick={this.doRedirectToCurrPollClick}/>
    } else {
      return <ViewCurrentPollPage onBackClick={this.doBackClick} pollQuestionName={this.state.currPage.pollQuestionName}/>
    }
  };


  ////// REDIRECTS
  doNewPollClick = (): void => {
    this.setState({currPage: "NewPollPage"});
  };

  doBackClick = (): void => {
    this.setState({currPage: "ViewPollListPage"});
  };



  ////// CALLBACKS
  doRedirectToCurrPollClick = (pollQuestionName: string): void => {
    if (pollQuestionName === undefined || typeof pollQuestionName !== "string") {
      console.error("doRedirectToCurrPollClick: Error: pollQuestionName is undefined or not of type string!")
      return;
    }
    this.setState({currPage: {kind: "ViewCurrentPollPage", pollQuestionName: pollQuestionName}});
  }; 
}

