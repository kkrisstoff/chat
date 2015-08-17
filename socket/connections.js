function Connections() {
    this.clients = {};
}

Connections.prototype.addClient = function (client) {
    var id = client.id;
    this.clients[id] = client;
};
Connections.prototype.removeClientById = function (clientId) {
    delete this.clients[clientId];
};

module.exports = new Connections();
