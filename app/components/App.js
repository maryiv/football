import React, { Component } from 'react'
import { AppState, StyleSheet, Text, View, StatusBar, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
import { loadMatches } from '../actions/index';
import HomeScreen from './HomeScreen';

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        height: 70,
        backgroundColor: '#55b8a8',
        paddingTop: 30
    },
    headerText: {
        fontSize: 20,
        color: '#ffffff',
        alignSelf: 'center'
    }
});

class App extends Component {
    componentDidMount() {
        AppState.addEventListener('change', this.handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange);
    }

    handleAppStateChange(appState) {
        if (false && appState === 'active') {
            this.props.dispatch(loadMatches());
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    translucent={true}
                    backgroundColor="rgba(0, 0, 0, 0.2)"
                    barStyle="light-content"
                />
                <View style={ styles.header }>
                    <Text style={ styles.headerText }>Today: 03/06/2016</Text>
                </View>
                <HomeScreen />
            </View>
        );
    }
}

export default connect()(App);