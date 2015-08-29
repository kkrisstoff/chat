/** @jsx React.DOM */

var React = require('react');

module.exports = Form = React.createClass({
    getInitialState: function (props) {
        return props || this.props;
    },
    onFormSubmit: function (e) {
        e.preventDefault();
        var form = e.target,
            inputName = form[0],
            inputPass = form[1],
            name = inputName.value,
            pass = inputPass.value;
        inputName.value = '';
        inputPass.value = '';

        this.props.onFormSubmit(name, pass);
    },
    onNewUser: function () {

        this.props.onViewChanged("newUser");
    },
    render: function(){
        return (
            <div className="controls-holder">
                <form id="logIn" name="login" className="login-form" onSubmit={this.onFormSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input className="form-control" id="name" type="text" onChange={this.onChange} name="username" placeholder="Name"/>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="pass">Password</label>
                                <input className="form-control" id="pass" type="password" name="password" placeholder="Password"/>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="error">
                            <span className="error-msg"></span>
                        </div>
                    </div>
                    <div className="row controls">
                        <div className="col-md-6">
                            <input className="btn btn-default btn-sm" type="submit" value="Log In"/>
                        </div>
                        <div className="col-md-6">
                            <div className="btn btn-default btn-sm" onClick={this.onNewUser} role="button">first time here</div>
                        </div>
                    </div>
                </form>
            </div>
            );
    }
});