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

        this.connection.on('open', function() {
            self.printStatus(null, 'the connection is established');
        });

        this.connection.on('disconnect', function() {
            self.printStatus(null, 'the connection is broken');
        });

        this.connection.on('message', function(message) {
            if (message.type == 'message') {
                self.onMessageReceive(message);
            }
            else if (message.type == 'status') {
                self.printStatus(message.username, message.text);
            }
            else {
                throw new Error("Bad message: " + message);
            }
        });

        this.connection.on('close', function(e) {
            self.printStatus(null, 'connection is broken');
        });
    },

    _onChange: function(messages) {
        this.onStateChanged(messages);
    },

    /**
     * Controls --> Message Sent
     * @param {string} text
     */
    onMessageSent: function (text) {
        const message = this.createMessage(text);

        this.connection.send({text: text});
        MessageActions.addMessage(message);
    },

    /**
     * Connection --> Receive Message
     * @param {object} message
     */
    onMessageReceive(message) {
        MessageActions.addMessage(message);
    },

    /**
     *
     * @param {string} message
     * @returns {{username, created: Date, text: string, type: string}}
     */
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
        const currentUser = this.props.currentUser.username;

        return (
            <div className="chat-app-holder">
                <Messages messages={this.state.messages} user={currentUser}/>
                <Controls onMessageSent={this.onMessageSent} />
            </div>
        );
    }

});
