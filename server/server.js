/**
 * Create an API using GraphQL
 */

import path from 'path';
import express from 'express';
import graphQLHTTP from 'express-graphql';
import {Schema} from './schema/schema';
import Parse from 'parse/node';
import {ParseServer} from 'parse-server';
import ParseDashboard from 'parse-dashboard';

const config = require('../conf/run');
const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production';
const DASHBOARD_AUTH = process.env.DASHBOARD_AUTH;

Parse.initialize(config.app_id);
Parse.serverURL = `http://localhost:${config.port}/parse`;
Parse.masterKey = config.master_key;
Parse.Cloud.useMasterKey();

function getSchema() {
    if (!IS_DEVELOPMENT) {
        return Schema;
    }

    delete require.cache[require.resolve('./schema/schema.js')];
    return require('./schema/schema.js').Schema;
}

const server = express();

server.use(
    '/parse',
    new ParseServer({
        databaseURI: config.db_uri,
        //cloud: path.resolve(__dirname, 'cloud.js'),
        appId: config.app_id,
        masterKey: config.master_key,
        fileKey: config.file_key_o,
        serverURL: `http://${config.host}:${config.port}/parse`
    })
);

if (IS_DEVELOPMENT) {
    let users;
    if (DASHBOARD_AUTH) {
        var [user, pass] = DASHBOARD_AUTH.split(':');
        users = [{user, pass}];
    }
    server.use(
        '/dashboard',
        ParseDashboard({
            apps: [{
                serverURL: '/parse',
                appId: config.app_id,
                masterKey: config.master_key,
                appName: config.app_name
            }],
            users
        }, IS_DEVELOPMENT),
    );
}

server.use(
    '/graphql',
    graphQLHTTP((request) => {
        return {
            graphiql: IS_DEVELOPMENT,
            pretty: IS_DEVELOPMENT,
            schema: getSchema(),
            rootValue: Math.random() // TODO: Check credentials, assign user
        };
    })
);

server.use('/', (req, res) => res.redirect('/graphql'));

server.listen(config.port, () => console.log(
    `Server is now running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${config.port}`
));
