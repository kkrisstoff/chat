var ChatDispatcher = require('../dispatcher/ChatDispatcher');
var ChatConstants = require('../constants/ChatConstants');

var ActionTypes = ChatConstants.ActionTypes;

module.exports = {

    createMessage: function(text) {
        console.log("createMessage", text);

        ChatDispatcher.dispatch({
            type: ActionTypes.CREATE_MESSAGE,
            data: {
                text: text
            }
        });
    },

    setInitialMessages: function (messages) {
        ChatDispatcher.dispatch({
            type: ActionTypes.INIT_MESSAGES,
            data: {
                messages: messages
            }
        });
    }
};