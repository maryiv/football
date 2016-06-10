import React, { Component, PropTypes } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import  * as HomeActions from '../actions/index';
import LoadScreen from '../containers/Load';
import EmptyScreen from '../containers/Empty';
import MatchScreen from '../containers/Match';

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
        if (isFetching && !matches.length) {
            return (
                <LoadScreen />
            );
        }
        if (!isFetching && !matches.length) {
            return (
                <EmptyScreen />
            );
        }
        let result;
        if (matches.length > 0) {
            result = matches.map(match =>
                <MatchScreen post={match} key={match.id} />
            );
        }
        return (
            <View style={styles.container}
                  title={`Schedule`}
                  backgroundImage={require('../images/schedule-background.png')}
                  selectedSectionColor="#51CDDA">
                {result}
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