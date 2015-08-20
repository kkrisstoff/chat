/** @jsx React.DOM */

var React = require('react');
var ChatApp = require('./components/ChatApp.react');
//var TodoApp = require('./components/TodoApp.react');

var initialStateHolder = document.getElementById('initial-state'),
    initialState = JSON.parse(initialStateHolder.innerHTML),
    mountNode = document.getElementById('react-app');
initialStateHolder.innerHTML = '';

React.render(React.createElement(ChatApp, initialState), mountNode);