// vid15.js <-> .src/node15.js
'use strict';

const { nodeInterface, nodeField } = require('./src/node15');

const {
    globalIdField,
    connectionDefinitions,
    connectionFromPromisedArray,
    connectionArgs,
    mutationWithClientMutationId,
} = require('graphql-relay');

const express  = require('express');

const graphqlHTTP  = require("express-graphql");

const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLList,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLNonNull
} = require('graphql');

const PORT = process.env.port || 3000;

const server = express();

const { getVideoById, getVideos, createVideo } = require('./src/data');

const videoType = new GraphQLObjectType({
    name: 'Video',
    description: 'A video on egghead.io',
    fields: {
        id: globalIdField(),
        title: {type: GraphQLString, description: 'The title of the video.'},
        duration: {type: GraphQLInt, description: 'the duration of the vodeo (in seconds).'},
        watched: {type: GraphQLBoolean, description: 'Whether or not the viewer has watched the video.'},
        released: {type: GraphQLBoolean, description: 'Whether or not the video is released'},
    },
    interfaces: [nodeInterface],
});
exports.videoType = videoType;

const { connectionType: VideoConnection } = connectionDefinitions({
    nodeType: videoType,
    connectionFields: () => ({
        totalCount: {
            type: GraphQLInt,
            description: 'A count oof the total number of objects in this connection',
            resolve: (conn) => {return conn.edges.length;},
        },
    }),
});

const queryType = new GraphQLObjectType({
    name: 'queryType',
    description: 'The root query type.',
    fields: {
        node: nodeField,
        videos: {
            type: VideoConnection,
            args: connectionArgs,
            resolve: (_, args) => connectionFromPromisedArray(getVideos(), args),
        },
        video: {
            type: videoType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'The id of the video.'
                }
            },
            resolve: (_, args) => {
                return getVideoById(args.id);
            }

        }
    }
});

const videoMutation = mutationWithClientMutationId({
    name: 'AddVideo',
    inputFields: {
        title: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The title of the video.'
        },
        duration: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'The duration of the video (in seconds)'
        },
        released: {
            type: new GraphQLNonNull(GraphQLBoolean),
            description: 'Whether or not the video is released.'
        },
    },
    outputFields: {
        video: {
            type: videoType,
        },
    },
    mutateAndGetPayload: (args) => new Promise((resolve, reject) => {
        Promise
            .resolve(createVideo(args))
            .then( (video) => resolve({video}) )
            .catch(reject)
        ;
    }),
});

const mutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'The root mutation type.',
    fields: {
        createVideo: videoMutation,
    }
});

const schema = new GraphQLSchema({
    query: queryType,
    mutation: mutationType
});

server.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});

/*
call:        node vid15
returns:     Listening on http://localhost:3000

open in browser with http://localhost:3000/graphql

Query:
======
mutation AddVideoQuery($input: AddVideoInput!){
    createVideo(input: $input){
        video {
            title
        }
    }
 }

Query Variables:
================
{
    "input": {
        "title": "Relay Video Title",
        "duration": 300,
        "released": false
    }
}

GraphiQL Result (should be):
============================
{
    "data": {
        "createVideo": {
            "video": {
                "title": "Relay Video Title"
            }
        }
    }
}
*/