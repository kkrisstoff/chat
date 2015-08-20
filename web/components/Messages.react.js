/** @jsx React.DOM */

var React = require('react');
var Message = require('./Message.react.js');

module.exports = Messages = React.createClass({
    componentDidUpdate: function () {
        console.log("Messages: componentDidUpdate");
        var scrollElement = document.getElementById('scrollable');

        scrollElement.scrollTop = scrollElement.scrollHeight;
    },
    render: function(){
        var content = this.props.messages.map(function(message){
            return (
                <Message message={message} />
                )
        });

        return (
            <ul id="scrollable" className="messages-holder">{content}</ul>
        )
    }
});