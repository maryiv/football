/**
 * @providesModule F8App
 * @flow
 */

'use strict';

var React = require('React');
var AppState = require('AppState');
var StyleSheet = require('StyleSheet');
var View = require('View');
var StatusBar = require('StatusBar');
var { connect } = require('react-redux');
var HomeScreen = require('./HomeScreen');

var { loadMatches } = require('../constants/ActionCreators');

const Props = {
    isFetching: Boolean,
    matches: Array
};

var App = React.createClass({
    componentDidMount: function() {
        AppState.addEventListener('change', this.handleAppStateChange);
        this.props.dispatch(loadMatches());
    },

    componentWillUnmount: function() {
        AppState.removeEventListener('change', this.handleAppStateChange);
    },

    render: function() {
        
        return (
            <View style={styles.container}>
                <StatusBar
                    translucent={true}
                    backgroundColor="rgba(0, 0, 0, 0.2)"
                    barStyle="light-content"
                />
                <HomeScreen />
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

module.exports = connect()(App);