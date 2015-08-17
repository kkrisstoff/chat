/** @jsx React.DOM */

var React = require('react');
var ChatApp = require('./components/ChatApp.react');
//var TodoApp = require('./components/TodoApp.react');

// Snag the initial state that was passed from the server side
var initialState = JSON.parse(document.getElementById('initial-state').innerHTML);

// Render the components, picking up where react left off on the server
var mountNode = document.getElementById('react-app');

React.render(React.createElement(ChatApp, {messages: initialState}), mountNode);
//Invariant Violation: React.render(): Invalid component element.
//Instead of passing a component class, make sure to instantiate it by passing it to React.createElement.