import React, { Component } from 'react'
import { StyleSheet, Text, View, ActivityIndicatorIOS } from 'react-native';

const styles = StyleSheet.create({
    container: {
        margin: 10,
        padding: 5,
        backgroundColor: '#51cdda',
        borderRadius: 3
    },
    title: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    text: {
        fontSize: 12,
        color: '#ffffff'
    }
});

class MatchesScreen extends Component {
    render() {
        const { match } = this.props;
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Class:{ match.className }</Text>
                <Text style={styles.text}>ID:{ match.id }</Text>
            </View>
        );
    }
}

export default MatchesScreen;