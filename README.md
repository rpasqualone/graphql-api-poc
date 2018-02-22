#GraphQL API Proof of Concept

## Goals

 - Stand up a REST express server and wrap it with GraphQL
 - Gain basic concepts 

## Installation

"start": "nodemon src --exec babel-node",
"build": "node build.js",
"serve": "node ./build/index.js",
"json:server": "json-server --watch -p 3030 db.json"

### Available Scripts

In the project directory, you can run: 

```bash
npm run json:server
```
This stands up a moc REST server based off of the `./db.json` file located in root directory. By default the service can be 
accessed from [http://localhost:3030/](http://localhost:3030/). This is required for this proof of concept, JSON Server
is acting as the database in this example.


```bash
npm run start
```
This stands up a GraphQL server proof of concept dev server. By default the service can be accessed from 
[http://localhost:3030/](http://localhost:3000/). Accessing this URL via a browser brings up a Graphiql interface to run 
and test queries and mutations.

```bash
npm run start
```
This creates a build environment for production deployment within a `./build` directory.

```bash
npm run serve
```
This stands up a GraphQL server proof of concept production environment off of the contents within the `./build` 
directory. By default the service can be accessed from [http://localhost:3000/](http://localhost:3000/). Accessing this 
URL via a browser brings up a Graphiql interface to run and test queries and mutations.
