var ChatDispatcher = require('../dispatcher/ChatDispatcher');
var ChatConstants = require('../constants/ChatConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActionTypes = ChatConstants.ActionTypes;
var CHANGE_EVENT = 'change';

var _messages = {};

var MessageStore = assign({}, EventEmitter.prototype, {

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },
    /**
     *
     * @param {array} messages
     */
    setInitialMessages: function (messages) {
        if (!messages || !messages.length) return false;

        messages.forEach(function (message) {
            _messages[message['id']] = message;
        });
        console.log("setInitialMessages");
        console.log(_messages);
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    getMessage: function(id) {
        return _messages[id];
    },

    getAll: function() {
        return _messages;
    }

});

MessageStore.dispatchToken = ChatDispatcher.register(function(action) {
    console.log(action.type);
    var type = action.type,
        data = action.data;
    switch(type) {
        case ActionTypes.INIT_MESSAGES:
            MessageStore.setInitialMessages(data.messages);
            //MessageStore.emitChange();
            break;
        case ActionTypes.CREATE_MESSAGE:
            //doSomeStuff
            console.log(data);
            MessageStore.emitChange();
            break;

        default:
        // do nothing
    }

});

module.exports = MessageStore;