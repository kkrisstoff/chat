/** @jsx React.DOM */

var React = require('react');
var Form = require('./Form.react.js');

module.exports = UserApp = React.createClass({
    componentWillMount: function () {
        console.log("componentWillMount");
    },
    componentDidMount: function () {
        console.log("componentDidMount");
    },
    componentWillReceiveProps: function () {
        console.log("componentWillReceiveProps");
    },
    componentWillUpdate: function () {
        console.log("componentWillUpdate");
    },
    getInitialState: function (props) {
        return props || this.props;
    },
    logInUser: function (name, pass) {

        console.log(name, pass);
    },
    changeView: function (view) {

        console.log("change view: ", view);
    },
    render: function() {

        return (
                <div className="user-app-holder">
                    <Form userName={this.state.userName} view={this.state.view}
                    onFormSubmit={this.logInUser}
                    onViewChanged={this.changeView}
                    />
                </div>
            );
    }

});
