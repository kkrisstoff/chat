/** @jsx React.DOM */

const React = require('react');

const MessageStore = require('../stores/MessagesStore');
const MessageActions = require('../actions/MessageActions');

const Messages = require('./Messages.react.js');
const Controls = require('./Controls.react.js');

const Connection = require('../utils/Connection');

function setConnection(self) {
    self.connection = new Connection({
        prefix: "/chatConnection",
        socket: {debug: true},
        debug: true
    });
}

module.exports = React.createClass({

    componentDidMount: function () {
        MessageStore.addChangeListener(this._onChange);
        setConnection(this);
        this.setCallbacksToConnection();
    },

    componentWillUnmount: function() {
        MessageStore.removeChangeListener(this._onChange);
    },

    getInitialState: function (props) {
        var props = props || this.props;

        MessageActions.addMessages(props.messages);
        return {
            messages: props.messages
        };
    },

    onStateChanged: function (messages) {
        if (!Array.isArray(messages)) messages = [messages];

        this.setState({
            messages: messages
        });
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

    _onChange: function(messages) {
        this.onStateChanged(messages);
    },

    /**
     * Controls --> Message Sent
     * @param text
     */
    onMessageSent: function (text) {
        const message = this.createMessage(text);
        console.log(message);

        MessageActions.addMessage(message);
    },

    createMessage: function (message) {
        return {
            username: this.props.currentUser.username,
            created: new Date(),
            text: message,
            type: "message"
        };
    },

    printStatus: function (user, status) {
        const statusMessage = this.createStatus(user, status);

        MessageActions.addMessage(statusMessage);
    },

    createStatus: function (user, status) {
        return {
            username: user || null,
            created: new Date(),
            text: status,
            type: "status"
        };
    },

    render: function() {
        var currentUser = this.props.currentUser.username;

        return (
            <div className="chat-app-holder">
                <Messages messages={this.state.messages} user={currentUser}/>
                <Controls onMessageSent={this.onMessageSent} />
            </div>
        );
    }

});
