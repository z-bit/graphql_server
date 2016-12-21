'use strict';

const {
    nodeDefinitions,
    fromGlobalId,
} = require('graphql-relay');

const { getObjectById } = require('./data');

const { nodeInterface, nodeField } = nodeDefinitions(
    (globalId) => {
        const { type, id } = fromGlobalId(globalId);
        return getObjectById(type.toLowerCase(), id);
    },
    (object) => {
        if (object.title) {
            const {videoType} = require('../vid13');
            return videoType;
        }
        return null;
    }
);
exports.nodeInterface = nodeInterface;
exports.nodeField = nodeField;
