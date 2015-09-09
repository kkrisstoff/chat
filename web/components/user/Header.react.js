/** @jsx React.DOM */
var React = require('react');

var Header = React.createClass({
    getInitialState: function (props) {
        return props || this.props;
    },
    getViewName: function () {
        var view = this.props.view,
            views = {
                login: "User Log In",
                newUser: "First Time Here?"
            };
        return views[view] || "User View";
    },
    onNewUser: function () {
        this.props.onViewChanged("newUser");
    },
    render: function(){
        return (
            <div className="view-name">
                <p>{this.getViewName()}</p>
            </div>
            );
    }
});

module.exports = Header;