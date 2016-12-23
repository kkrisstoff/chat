/** @jsx React.DOM */

const React = require('react');

module.exports = Message = React.createClass({

    render: function(){
        var message = this.props.message,
            username = message.username? message.username + '> ' : '',
            textClass = message.type == "status"? "status" : "message";
        console.log(message);

        return (
            <li className="message-item">
                <span className="user">{username}</span>
                <span className={textClass}>{message.text}</span>
            </li>
        );
    }
});