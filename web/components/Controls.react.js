/** @jsx React.DOM */

var React = require('react');

var Form = React.createClass({
    onFormSubmit: function (e) {
        e.preventDefault();
        console.log(e);

        return false;
    },
    onChange: function (e) {
        console.log(e);
    },
    render: function () {
        return (
            <form onSubmit={this.onFormSubmit}>
                <input type="text" name="message" className="form-control" onChange={this.onChange} placeholder="Message..." />
                <button className="btn">Add</button>
            </form>
            );
    }
});

module.exports = Controls = React.createClass({

    render: function(){

        return (
            <div className="contrils">
                <Form />
            </div>
            );
    }
});