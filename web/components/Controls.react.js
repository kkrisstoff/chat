/** @jsx React.DOM */

var React = require('react');

module.exports = Controls = React.createClass({
    onFormSubmit: function (e) {
        e.preventDefault();
        var text = e.target[0].value;
        e.target[0].value = '';

        this.props.onMessageSent(text);
    },
    render: function(){
        return (
            <div className="controls-holder">
                <form onSubmit={this.onFormSubmit}>
                    <input type="text" name="message" className="form-control" onChange={this.onChange} placeholder="Message..." />
                </form>
            </div>
            );
    }
});