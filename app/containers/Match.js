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
                <Text style={styles.title}>{ match.time } { match.date }</Text>
                <Text style={styles.title}>{ match.competition.text }</Text>
                <Text style={styles.text}>Live match: { match.liveMatch }</Text>
                <Text style={styles.text}>Preview available: { match.previewAvailable }</Text>
                <Text style={styles.text}>Report available: { match.reportAvailable }</Text>
                <Text style={styles.text}>Match status: { match.matchStatus }</Text>
            </View>
        );
    }
}

export default MatchesScreen;