import React, { Component } from 'react'
import { AppState, StyleSheet, Text, View, StatusBar, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
import HomeScreen from './HomeScreen';

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

class App extends Component {
    componentDidMount() {
        AppState.addEventListener('change', this.handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange);
    }

    render() {
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
}

export default connect()(App);