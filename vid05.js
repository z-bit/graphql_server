// vid05.js
'use strict';

const express  = require('express');

const graphqlHTTP  = require("express-graphql");

const {graphql, buildSchema} = require('graphql');

const PORT = process.env.port || 3000;

const server = express();

const schema = buildSchema(`
    type Video {
        id: ID,
        title: String,
        duration: Int,
        watched: Boolean
    }
    type Query {
        video: Video 
        videos: [Video]
    }
    type Schema {
        query: Query
    }
`);

const videoA = {
    id: 'a',
    title: 'Create a GraphQl Schema',
    duration: 120,
    watched: true
};
const videoB = {
    id: 'b',
    title: 'Ember.js CLI',
    duration: 240,
    watched: false
};
const videos = [videoA, videoB];

const resolvers = {
    video: () => ({
        id: '1',
        title: 'bar',
        duration:  180,
        watched: true
    }),
    videos: () => videos
};

server.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
    rootValue: resolvers
}));

server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});

// call:        node vid05
// returns:     Listening on http://localhost:3000
// open in browser with http://localhost:3000/graphql


