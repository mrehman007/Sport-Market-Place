# eSportsNFTFantasy

So the project contains 4 folders
frontend, protocol, backend and subgraph.
frontend is the UI for fantasysport
to run it you can cd to frontend and yarn dev .
Note to see all the available yarn command options you can open package.json on scripts
backend - contains fantasysport backend logic. there is no much there at the moment but to start it cd backend and yarn start , more commands on package.json
protocol - contains the s.c Voting, and Tournament which are basically the required fantasy sport s.c at the moment.
You can see a list of all commands to compile and deploy on package.json
subgraph - contains the subgraph configuration for indexing marketplace events( events that are emitted). The marketplace has been deployed from thirdweb.com/dashboard
The most important files here for now are subgraph.yaml, package.json and schema.graphql
package.json contains the commands for generating, building and deploying your subgraph.( you can create your subgraph from thegraph.com)
subgraph.yaml - contains the your config such as the address of the S.C you are indexing, block to start indexing From , events to index and many more as you will see from the resources below
Useful Resources for understanding subgraph
https://thegraph.academy/
https://www.howtographql.com/
https://thegraph.academy/developers/deploying-a-subgraph/
https://dev.to/nvn/the-graph-tutorial-creating-a-subgraph-4no4 [The one I started with]
