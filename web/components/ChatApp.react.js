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

module.exports = ChatApp = React.createClass({
    getInitialState: function (props) {
        var props = props || this.props;
        return {
            messages: props.messages,
            count: props.messages? props.messages.length : 0,
            value: 'Hello!'
        };

    },
    onFormSubmit: function (e) {
        e.preventDefault();
        this.state.messages.push({
            created: new Date(),
            id: "55cc83025878c79a2321ec5e",
            text: this.state.value,
            username: "user1"
        });
        var newState = {
                messages: this.state.messages,
                count: this.state.count++,
                value: ''
            };

        console.log(this.state);
        this.setState(newState);
    },
    onChange: function (e) {
        e.preventDefault();
        console.log(e);
        this.setState({value: e.target.value});
    },
    render: function() {
        var value = this.state.value;
        return (
                <div className="messages">
                    <Messages messages={this.state.messages} />

                    <form onSubmit={this.onFormSubmit} >
                        <input type="text" name="message" className="form-control" value={value} onChange={this.onChange} placeholder="Message..." />
                        <button className="btn">Add</button>
                    </form>
                </div>
            );
    }

});
