// vid06.js
'use strict';

const express  = require('express');
const graphqlHTTP  = require("express-graphql");
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean
} = require('graphql');
const PORT = process.env.port || 3000;
const server = express();

const videoType = new GraphQLObjectType({
    name: 'Video',
    description: 'A video on egghead.io',
    fields: {
        id: {type: GraphQLID, description: 'The id of the video.'},
        title: {type: GraphQLString, description: 'The title of the video.'},
        duration: {type: GraphQLInt, description: 'the duration of the vodeo (in seconds).'},
        watched: {type: GraphQLBoolean, description: 'Whether or not the viewer has watched the video.'}
    }
});

const queryType = new GraphQLObjectType({
    name: 'queryType',
    description: 'The root query type.',
    fields: {
        video: {
            type: videoType,
            resolve: () => new Promise( (resolve)  => {
                resolve({
                    id: 'a',
                    title: 'GraphQl',
                    duration: 180,
                    watched: false
                })
            })

        }
    }
});

const schema = new GraphQLSchema({
    query: queryType
});

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

server.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});

// call:        node vid06
// returns:     Listening on http://localhost:3000

// open in browser with http://localhost:3000/graphql


