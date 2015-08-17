var mongoose = require('lib/mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    username: {
        type: String
    },
    room: {
        type: String
    },
    message: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    }
});

schema.methods.getMessage = function() {
    return {
        username: this.username,
        text: this.message,
        created: this.created,
        id: this.id
    };
};

exports.Chat = mongoose.model('Chat', schema);