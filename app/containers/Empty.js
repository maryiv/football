import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native';

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

class EmptyScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Events aren't planned.</Text>
            </View>
        );
    }
}

export default EmptyScreen;