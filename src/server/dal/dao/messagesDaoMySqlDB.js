const DAO = require('./dao');
const config = require('../../config');
const mysql = require('mysql2/promise');

function MessagesDaoMySqlDB() {
    this.mysql = null;
}

MessagesDaoMySqlDB.prototype = Object.create(DAO.prototype);
MessagesDaoMySqlDB.prototype.constructor = MessagesDaoMySqlDB;

MessagesDaoMySqlDB.prototype.initialize = function () {
    if (this.mysql) {
        return;
    }

    this.pool = mysql.createPool({
        host: 'localhost',
        port: '3306',
        user: 'root',
        database: 'chat',
        password: 'admin',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
};

MessagesDaoMySqlDB.prototype.readByReceiver = async function (ws) {
    let validate = await this.pool.query('SELECT * FROM message ORDER BY time');
    validate[0].forEach(message => {
        ws.send(JSON.stringify(message));
    });
};

MessagesDaoMySqlDB.prototype.create = async function (object) {
    await this.pool.query(`INSERT INTO message SET username = ?, time = ?, receiver = ?, text = ?`,
        [object.username, [object.time], object.receiver, object.text]);
};

module.exports = MessagesDaoMySqlDB;

