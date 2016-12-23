/** @jsx React.DOM */

const React = require('react');

module.exports = Message = React.createClass({

    shownUsername: function (username) {
        if (!username) return "";

        return (username == this.props.user ? "Me" : username) + ' > ';
    },

    render: function(){
        var message = this.props.message,
            username = this.shownUsername(message.username),
            textClass = message.type == "status"? "status" : "message";

        return (
            <li className="message-item">
                <span className="user">{username}</span>
                <span className={textClass}>{message.text}</span>
            </li>
        );
    }
});