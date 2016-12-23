var ChatDispatcher = require('../dispatcher/ChatDispatcher');
var ChatConstants = require('../constants/ChatConstants');

var ActionTypes = ChatConstants.ActionTypes;

module.exports = {

    addMessage: function(message) {
        ChatDispatcher.dispatch({
            type: ActionTypes.CREATE_MESSAGE,
            data: {
                message: message
            }
        });
    },

    /**
     * get Initial State from the server
     */
    addMessages: function (messages) {
        ChatDispatcher.dispatch({
            type: ActionTypes.INIT_MESSAGES,
            data: {
                messages: messages
            }
        });
    }
};