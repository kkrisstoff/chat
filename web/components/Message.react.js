/** @jsx React.DOM */

var React = require('react');

module.exports = Message = React.createClass({
    render: function(){
        var message = this.props.message;
        return (
            <li className="message">
                <span className="content">{message.username + '> ' + message.text}</span>
            </li>
            )
    }
});