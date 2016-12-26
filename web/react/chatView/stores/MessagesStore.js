
const EventEmitter = require('events').EventEmitter;
const assign = require('object-assign');

const ChatDispatcher = require('../dispatcher/ChatDispatcher');
const ChatConstants = require('../constants/ChatConstants');

const CHANGE_EVENT = 'change';
const ActionTypes = ChatConstants.ActionTypes;

let _messages = [];

let MessageStore = assign({}, EventEmitter.prototype, {
    emitChange: function() {
        this.emit(CHANGE_EVENT, this.getAll());
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function(callback) {
        this.addListener(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    addMessages: function (messages) {
        if (!messages || !messages.length) return false;

        messages.forEach(function (message) {
            _messages.push(message);
        });
    },

    addMessage: function (message) {
        _messages.push(message)
    },

    //TODO: implement it if it needs
    // getMessage: function(id) {
    //     return _messages[id];
    // },

    getAll: function() {
        return _messages;
    }

});

/**
 * Register action listener
 */
MessageStore.dispatchToken = ChatDispatcher.register(function(action) {
    const type = action.type;
    const data = action.data;
    
    switch(type) {
        case ActionTypes.INIT_MESSAGES:
            MessageStore.addMessages(data.messages);
            MessageStore.emitChange();
            break;
        case ActionTypes.CREATE_MESSAGE:
            MessageStore.addMessage(data.message);
            MessageStore.emitChange();
            break;

        default:
            // do nothing
    }

});

module.exports = MessageStore;