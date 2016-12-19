// vid11.js
'use strict';

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
        id: {type: GraphQLID, description: 'The id of the video.'},
        title: {type: GraphQLString, description: 'The title of the video.'},
        duration: {type: GraphQLInt, description: 'the duration of the vodeo (in seconds).'},
        watched: {type: GraphQLBoolean, description: 'Whether or not the viewer has watched the video.'},
        released: {type: GraphQLBoolean, description: 'Whether or not the video is released'},
    }
});

const queryType = new GraphQLObjectType({
    name: 'queryType',
    description: 'The root query type.',
    fields: {
        videos: {
            type: new GraphQLList(videoType),
            resolve: getVideos
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

const videoInputType = new GraphQLInputObjectType({
    name: 'VideoInput',
    fields: {
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
        }
    }
});

const mutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'The root mutation type.',
    fields: {
        createVideo: {
            type: videoType,
            args: {
               video: {
                   type: new GraphQLNonNull(videoInputType)
               },
            },
            resolve: (_, args) => {
                return createVideo(args.video);
            }
        }
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

// call:        node vid11
// returns:     Listening on http://localhost:3000

// open in browser with http://localhost:3000/graphql


