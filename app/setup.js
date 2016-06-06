/**
 * @flow
 */
'use strict';

const config = require('../conf/run');
const serverURL = config.remote_server;

var Parse = require('parse/react-native');
var React = require('React');
var Relay = require('react-relay');

var { Provider } = require('react-redux');
var { createStore, applyMiddleware } = require('redux');

import thunk from 'redux-thunk';

var App = require('./components/App');
var todoApp =  require('./reducers');

function setup(): React.Component {
    console.disableYellowBox = true;
    Parse.initialize(config.app_id);
    Parse.serverURL = `${serverURL}/parse`;

    Relay.injectNetworkLayer(
        new Relay.DefaultNetworkLayer(`${serverURL}/graphql`, {
            fetchTimeout: 30000,
            retryDelays: [5000, 10000]
        })
    );

    class Root extends React.Component {
        constructor() {
            super();
            this.state = {
                store: applyMiddleware(thunk)(createStore)(todoApp)
            };
        }
        render() {
            return (
                <Provider store={this.state.store}>
                    <App />
                </Provider>
            );
        }
    }
    return Root;
}

module.exports = setup;
