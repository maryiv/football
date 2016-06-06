/**
 * @flow
 */
'use strict';

var React = require('React');
var Navigator = require('Navigator');
var { connect } = require('react-redux');

import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

const Props = {
    navigator: Navigator,
    isFetching: Boolean,
    matches: Array
};

class HomeScreen extends React.Component {
    props: Props;

    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.isFetching) {
            return <p>Loading...</p>;
        }
        let matches;
        if (this.props.matches) {
            matches = this.props.matches.map(match =>
                <Post post={match} key={match.id} />
            );
        } else {
            matches = "Events aren't planned";
        }
        return (
            <View style={styles.container}
                title={`Schedule`}
                backgroundImage={require('../images/schedule-background.png')}
                selectedSectionColor="#51CDDA">
                <Text style={styles.text}>Matches: {matches}</Text>
            </View>
        );
    }
}
var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#55b8a8',
        paddingTop: 25
    },
    text: {
        fontSize: 20,
        color: '#ffffff'
    }
});

module.exports = connect(state => ({
    matches: state.matches
}))(HomeScreen);
