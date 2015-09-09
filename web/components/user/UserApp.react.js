/** @jsx React.DOM */

var React = require('react');
var Form = require('./Form.react.js');
var Header = require('./Header.react.js');

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
    onFormSubmit: function (action, name, pass) {
        if (action == "login"){
            this.logInUser(name, pass)
        } else if (action == "newUser"){
            this.createUser(name, pass)
        } else {
            console.log("action " + action + " is undefined");
        }
    },
    logInUser: function (name, pass) {
        network.logIn({
            user: {
                username: name,
                password: pass,
                email: ""
            },
            onSuccess: function (status, data) {
                console.log(status);
                console.log(data);
                if (status == 200){
                    network.getPage("home")
                }
            },
            onError: function (err) {
                console.log(arguments);
            }
        });
    },
    createUser: function (name, pass) {
        console.log("createUser");
        console.log(name, pass);
    },
    changeView: function (view) {
        console.log("change view: ", view);
        this.setState({
            view: view
        });
    },
    render: function() {

        return (
                <div className="user-app-holder">
                    <Header view={this.state.view}/>
                    <Form userName={this.state.userName} view={this.state.view}
                    onFormSubmit={this.onFormSubmit}
                    onViewChanged={this.changeView}
                    />
                </div>
            );
    }

});
