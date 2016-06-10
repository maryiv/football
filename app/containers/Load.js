import React, { Component } from 'react'
import { StyleSheet, Text, View, ActivityIndicatorIOS } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingTop: 10
    },
    indicator: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: 16,
        color: '#55b8a8',
        alignSelf: 'center'
    }
});

class LoadScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Loading...</Text>
                <ActivityIndicatorIOS
                    animating="true" size="large" color="#55b8a8"
                    style={[styles.indicator, {height: 80}]}
                />
            </View>
        );
    }
}

export default LoadScreen;