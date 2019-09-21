const DAO = require('./dao');
const config = require('../../config');
const mysql = require('mysql2/promise');
const uuidv1 = require('uuid/v1');

function UsersDaoMySqlDB() {
    this.mysql = null;
}

UsersDaoMySqlDB.prototype = Object.create(DAO.prototype);
UsersDaoMySqlDB.prototype.constructor = UsersDaoMySqlDB;

UsersDaoMySqlDB.prototype.initialize = function () {
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

UsersDaoMySqlDB.prototype.readUser = async function (email, password) {
    const result = await this.pool.query('SELECT name FROM users WHERE email = ? AND password = ?', [email, password]);
    // console.log(result[0][0].name);

    if (result[0][0].name) {
        let User = {};
        User.name = result[0][0].name;
        User.email = email;
        return User;
    } else {
        throw new Error('invalid user');
    }

};

UsersDaoMySqlDB.prototype.create = async function (object) {
    let validate = await this.pool.query('SELECT COUNT(*) FROM users WHERE email = ?', [object.email]);

    if (Object.values(validate[0][0])[0] === 0) {
        await this.pool.query(`INSERT INTO users SET id = ?, name = ?, email = ?, password = ? `,
            [uuidv1(), object.name, object.email, object.password]);
        return 'user created';
    } else {
        throw new Error('invalid email');
    }
};

UsersDaoMySqlDB.prototype.readAll = async function () {
    let result = await this.pool.query('SELECT name, email FROM users');

    if (result[0].length < 0) {
        throw new Error('error with all users');
    } else {
        return result[0];
    }
};

module.exports = UsersDaoMySqlDB;

