const config = require('../conf/run');
const serverURL = config.remote_server;

import React, { Component } from 'react';
import Relay from 'react-relay';
import { Provider } from 'react-redux';

import Parse from 'parse/react-native';

import configureStore from './configureStore';
import App from './components/App';

let store = configureStore();

function setup(): Component {
    console.disableYellowBox = true;
    Parse.initialize(config.app_id);
    Parse.serverURL = `${serverURL}/parse`;

    Relay.injectNetworkLayer(
        new Relay.DefaultNetworkLayer(`${serverURL}/graphql`, {
            fetchTimeout: 30000,
            retryDelays: [5000, 10000]
        })
    );

    class Root extends Component {
        render() {
            return (
                <Provider store={store}>
                    <App />
                </Provider>
            );
        }
    }
    return Root;
}

module.exports = setup;
