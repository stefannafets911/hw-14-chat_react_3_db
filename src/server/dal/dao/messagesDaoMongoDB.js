const DAO = require('./dao');
const config = require('../../config');
const mongoose = require('mongoose');
const express = require('express');
const messageSchema = new mongoose.Schema({

        text: {type: String,required: false},
        username: {type: String, required: false},
        receiver: {type: String, required: false},
        time: {type: String, required: false},
        type: {type: String, required: false},
    },
    {collection: 'messages'});

function MessagesDaoMongoDB() {
    this.connection = null;
    this.model = null;
}

MessagesDaoMongoDB.prototype = Object.create(DAO.prototype);
MessagesDaoMongoDB.prototype.constructor = MessagesDaoMongoDB;
MessagesDaoMongoDB.prototype.initialize = function () {
    if (this.connection) {
        return;
    }
    const url = `${config.settings.mongo.connectionString}/chatDB`;

    mongoose.createConnection(url)
        .then(connection => {
            this.connection = connection;
            this.model = connection.model('message', messageSchema);
            console.log('Database messages is connected');
        })
        .catch((error) => {
            console.log('Can not connect to the database' + error);
        });
};
//
MessagesDaoMongoDB.prototype.create = async function (object) {
    const message = this.model(object);
    await message.save();
};

MessagesDaoMongoDB.prototype.readByReceiver = async function (ws) {
    let validate = await this.model.find({ receiver: 'all' });
    validate.forEach(message => {
        // console.log(message, 55);
        ws.send(JSON.stringify(message));
    });
};

module.exports = MessagesDaoMongoDB;