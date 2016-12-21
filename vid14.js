// vid13.js <-> .src/node14.js
'use strict';

const { nodeInterface, nodeField } = require('./src/node14');

const {
    globalIdField,
    connectionDefinitions,
    connectionFromPromisedArray,
    connectionArgs,
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
    },
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

/*
call:        node vid12
returns:     Listening on http://localhost:3000

open in browser with http://localhost:3000/graphql

after starting in browser:
{"errors": [{"message": "Unknown operation named \"null\"."}]}

after first
    {video(id:"a"){title}}
or
    mutation M { createVideo(title:"Foo",duration:120,released:true){id title} }
everything OK
*/