# Live-poll client-server communication website
Live-poll client-server communication project

Professor Starter-code: 
- CLIENT: Skeleton of PollsApp with dummy API error checking functions
- SERVER: Skeleton of Express.js set up with a "dummy" API endpoint + Skeleton of 
My contributions: 
- CLIENT: Completely functional Polling with PollsApp.tsx as Parent component and NewPollPage.tsx, ViewCurrentPollPage.tsx, ViewPollListPage.tsx as children components. Child components are displayed based on state management of PollsApp.tsx's currPage variable that changes due to Events
- SERVER: Completely functional Express based server with custom API's such as getPollList, add, getPollFromName, and recordVote that is RIGOUROUSLY unit-tested (400 lines of testing) in routes_test.ts from routes.ts

## Description
This is a basic "Live Poll client-server website" that displays real-time polls that users can vote on
... TODO: paste images here
![alt text][img1]

[img1]: 

## Prerequisites & Project Structure
1. Node.js (LTS version recommended)
2. npm (comes with Node)
3. TypeScript
4. Git
5. Web browser (preferably Chrome)
This project has a client-server architecture
SERVER: Mainly uses TypeScript with some Node.js and Express
CLIENT: Uses React framework with TypeScript language

### Installing & Executing program
You need 2 terminals, one to start the server & another for the client
1. git clone https://github.com/Leonshekre/Live-Poll.git
SERVER TERMINAL
1. cd HW-POLLS/server
2. npm run build  // (runs 'tsc --build tsconfig.json' in script)
3. npm run server  // server starts listening
CLIENT TERMINAL
1. cd HW-POLLS/client
2. npm run start
3. Click in terminal or open http://localhost:8080/ (or may be other port) after 'npm run start' command

## Help
- Make sure when cd'ed into server, to npm run build. If "dist" folder is NOT seen in server folder, run "tsc --build tsconfig.json" manually

## Authors
1. Student Leonardo Paredes (leitoparal@gmail.com)
2. Professor Kevin Zatloukal (starter code provided, DO NOT CONTACT)

