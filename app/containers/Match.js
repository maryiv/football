import React, { Component } from 'react'
import { StyleSheet, Text, View, ActivityIndicatorIOS } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingTop: 10
    },
    text: {
        fontSize: 16,
        color: '#55b8a8',
        alignSelf: 'center'
    }
});

class MathesScreen extends Component {
    render() {
        return (
            <View style={styles.container}>

            </View>
        );
    }
}

export default MathesScreen;