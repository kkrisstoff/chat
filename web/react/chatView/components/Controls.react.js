/** @jsx React.DOM */

var React = require('react');
var MessageActions = require('../actions/MessageActions');

module.exports = Controls = React.createClass({


    _onFormSubmit: function (e) {
        e.preventDefault();
        var text = e.target[0].value;
        e.target[0].value = '';

        console.log("Form Submitted: ", text);
        MessageActions.createMessage(text);

    },


    render: function(){
        return (
            <div className="controls-holder">
                <form onSubmit={this._onFormSubmit}>
                    <input type="text" name="message" className="form-control" onChange={this.onChange} placeholder="Message..." />
                </form>
            </div>
            );
    }
});