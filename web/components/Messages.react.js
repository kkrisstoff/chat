/** @jsx React.DOM */

var React = require('react');
var Message = require('./Message.react.js');

module.exports = Messages = React.createClass({

    render: function(){
        console.log(this.props.messages);
        var content = this.props.messages.map(function(message){
            return (
                <Message message={message} />
                )
        });

        return (
            <ul className="message">{content}</ul>
            )
    }
});