/** @jsx React.DOM */

const React = require('react');
const Message = require('./Message.react.js');

module.exports = Messages = React.createClass({

    componentDidUpdate: function () {
        var scrollElement = document.getElementById('scrollable');

        scrollElement.scrollTop = scrollElement.scrollHeight;
    },

    render: function(){
        var content = this.props.messages.map(function(message, index){
            return (
                <Message  key={'message_' + index} message={message} />
            );
        });

        return (
            <ul id="scrollable" className="messages-holder">{content}</ul>
        );
    }
});