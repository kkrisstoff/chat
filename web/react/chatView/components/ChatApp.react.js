/** @jsx React.DOM */

var React = require('react');
var Messages = require('./Messages.react.js');
var Controls = require('./Controls.react.js');
var Connection = require('../utils/Connection');

var MessageStore = require('../stores/MessagesStore');
var MessageActions = require('../actions/MessageActions');

var TodoList = React.createClass({
    render: function() {
        var createItem = function(itemText, index) {
            return <li key={index + itemText}>{itemText}</li>;
        };
        return <ul>{this.props.items.map(createItem)}</ul>;
    }
});

function setConnection(self) {
    self.connection = new Connection({
        prefix: "/chatConnection",
        socket: {debug: true},
        debug: true
    });
}

function setInitialMessagesToStory(messages) {
    MessageActions.setInitialMessages(messages);
}

module.exports = React.createClass({

    componentWillMount: function () {
        console.log("componentWillMount");
    },
    componentDidMount: function () {
        console.log("componentDidMount");
        MessageStore.addChangeListener(this._onChange);
        setConnection(this);
        this.setCallbacksToConnection();
    },
    componentWillReceiveProps: function () {
        console.log("componentWillReceiveProps");
    },
    componentWillUpdate: function () {
        console.log("componentWillUpdate");

    },
    componentWillUnmount: function() {
        MessageStore.removeChangeListener(this._onChange);
    },

    getInitialState: function (props) {
        var props = props || this.props;
        setInitialMessagesToStory(props.messages);
        //return null;
        return {
            messages: props.messages,
            value: ''
        };
    },

    _onChange: function(e) {
        console.log("_onChange");
        console.log(arguments);
        //this.props.onMessageSent(text);
    },

    /**
     * Controls --> Message Sent
     * @param text
     */
    onMessageSent: function (text) {
        this.connection.send({text: text});
        this.printMessage(null, text)
    },

    addItemToState: function (item) {
        this.state.messages.push(item);
        this.setState({
            messages: this.state.messages
        });
    },
    printMessage: function (user, message) {
        var messageItem = {
                username: user || "Me",//this.props.currentUser.username
                created: new Date(),
                text: message,
                type: "message"
            };

        this.addItemToState(messageItem)
    },
    printStatus: function (user, status) {
        var statusItem = {
                username: user || null,
                created: new Date(),
                text: status,
                type: "status"
            };

        this.addItemToState(statusItem);
    },

    /**Setters*/
    setCallbacksToConnection: function () {
        var self = this;

        console.log(this.connection);
        this.connection.on('open', function() {
            self.printStatus(null, 'the connection is established');
        });
        this.connection.on('disconnect', function() {
            self.printStatus(null, 'the connection is broken');
        });
        this.connection.on('message', function(e, message) {
            if (message.text) {
                self.printMessage(message.username, message.text);
            } else if (message.status) {
                self.printStatus(message.username, message.status);
            } else {
                throw new Error("Bad message: " + message);
            }
        });
        this.connection.on('close', function(e) {
            self.printStatus('connection is broken');
        });
    },

    render: function() {

        return (
                <div className="chat-app-holder">
                    <Messages messages={this.state.messages} />
                    <Controls onMessageSent={this.onMessageSent} />
                </div>
            );
    }

});
