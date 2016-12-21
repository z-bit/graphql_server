// node14.js <-> vid14.js
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
            const {videoType} = require('../vid14');
            return videoType;
        }
        return null;
    }
);
exports.nodeInterface = nodeInterface;
exports.nodeField = nodeField;
