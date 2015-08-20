/** @jsx React.DOM */

var React = require('react');
var Messages = require('./Messages.react.js');
var Controls = require('./Controls.react.js');

var TodoList = React.createClass({
    render: function() {
        var createItem = function(itemText, index) {
            return <li key={index + itemText}>{itemText}</li>;
        };
        return <ul>{this.props.items.map(createItem)}</ul>;
    }
});

function setConnection(self) {
    var connection = new Connection({
        prefix: "/chatConnection",
        socket: {debug: true},
        debug: true
    });
    self.connection = connection;
}

module.exports = ChatApp = React.createClass({
    componentWillMount: function () {
        console.log("componentWillMount");
    },
    componentDidMount: function () {
        console.log("componentDidMount");
        setConnection(this);
        this.setCallbacksToConnection();
    },
    componentWillReceiveProps: function () {
        console.log("componentWillReceiveProps");
    },
    componentWillUpdate: function () {
        console.log("componentWillUpdate");

    },
    getInitialState: function (props) {
        var props = props || this.props;
        return {
            messages: props.messages,
            value: ''
        };

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

        this.connection.on('open', function() {
            self.printStatus(null, 'the connection is established');
        });
        this.connection.on(null, 'disconnect', function() {
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
