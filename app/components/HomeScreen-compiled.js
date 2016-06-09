
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reactNative = require('react-native');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('React');
var Navigator = require('Navigator');

var _require = require('react-redux');

var connect = _require.connect;

var _require2 = require('../actions/index');

var loadMatches = _require2.loadMatches;


var Props = {
    navigator: Navigator,
    isFetching: Boolean,
    matches: Array
};

var HomeScreen = function (_React$Component) {
    _inherits(HomeScreen, _React$Component);

    function HomeScreen(props) {
        _classCallCheck(this, HomeScreen);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(HomeScreen).call(this, props));
        //this.state = {matches: []};
    }

    _createClass(HomeScreen, [{
        key: 'render',
        value: function render() {
            if (this.props.isFetching) {
                return React.createElement(
                    'p',
                    null,
                    'Loading...'
                );
            }
            var matches = void 0;
            if (this.props.matches) {
                matches = this.props.matches.map(function (match) {
                    return React.createElement(Post, { post: match, key: match.id });
                });
            } else {
                matches = "Events aren't planned";
            }
            return React.createElement(
                _reactNative.View,
                { style: styles.container,
                    title: 'Schedule',
                    backgroundImage: require('../images/schedule-background.png'),
                    selectedSectionColor: '#51CDDA' },
                React.createElement(
                    _reactNative.Text,
                    { style: styles.text },
                    'Matches: ',
                    matches
                )
            );
        }
    }]);

    return HomeScreen;
}(React.Component);

var styles = _reactNative.StyleSheet.create({
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

module.exports = connect(function (state) {
    return {
        matches: state.matches
    };
})(HomeScreen);

//# sourceMappingURL=HomeScreen-compiled.js.map