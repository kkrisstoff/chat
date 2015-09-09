/** @jsx React.DOM */
var React = require('react');

var Form = React.createClass({
    views: {
        login: ["newUser", "First time here?", "Log In"],
        newUser: ["login", "User exist?", "Create"]
    },
    getInitialState: function (props) {
        return props || this.props;
    },
    onFormSubmit: function (e) {
        e.preventDefault();
        var form = e.target,
            inputName = form[0],
            inputPass = form[1],
            name = inputName.value,
            pass = inputPass.value,
            action = form.id;
        inputName.value = '';
        inputPass.value = '';

        this.props.onFormSubmit(action, name, pass);
    },
    onChangeView: function (e) {
        var newView = this.views[this.props.view][0];
        this.props.onViewChanged(newView);
    },
    render: function(){
        var view = this.props.view,
            NewViewText = this.views[view][1],
            submitText = this.views[view][2];

        return (
            <div className="controls-holder">
                <form id={view} name="login" className="login-form" onSubmit={this.onFormSubmit}>
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
                            <input className="btn btn-default btn-sm" type="submit" value={submitText}/>
                        </div>
                        <div className="col-md-6">
                            <div className="btn btn-default btn-sm" onClick={this.onChangeView} role="button">{NewViewText}</div>
                        </div>
                    </div>
                </form>
            </div>
            );
    }
});

module.exports = Form;