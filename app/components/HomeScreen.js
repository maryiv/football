import React, { Component, PropTypes } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import  * as HomeActions from '../actions/index';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#55b8a8',
        paddingTop: 50
    },
    text: {
        fontSize: 20,
        color: '#ffffff',
        alignSelf: 'center'
    }
});

class HomeScreen extends Component {
    constructor(props) {
        super(props);
    }

    static fetchData(dispatch) {
        let homeActions = bindActionCreators(HomeActions, dispatch);
        return Promise.all([
            homeActions.loadMatches()
        ]);
    }

    componentDidMount() {
        if (!this.props.matches) {
            this.constructor.fetchData(this.props.dispatch);
        }
    }

    render() {
        const { isFetching, matches } = this.props;
        if (isFetching) {
            return <p>Loading...</p>;
        }
        let result;
        if (matches && matches.length > 0) {
            result = matches.map(match =>
                <Post post={match} key={match.id} />
            );
        } else {
            result = "Events aren't planned";
        }
        return (
            <View style={styles.container}
                title={`Schedule`}
                backgroundImage={require('../images/schedule-background.png')}
                selectedSectionColor="#51CDDA">
                <Text style={styles.text}>Matches: {result}</Text>
            </View>
        );
    }
}

HomeScreen.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    matches: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    const { isFetching, matches } = state || {
        isFetching: true,
        matches: []
    };
    return {
        isFetching: isFetching,
        matches: matches
    }
}

export default connect(mapStateToProps)(HomeScreen);