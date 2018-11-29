const {DATABASE} = require('./config');
const Sequelize = require('sequelize');

const {database, username, password, config} = DATABASE;
const db = new Sequelize(database, username, password, config);

const User = db.define('user', {
    username: {
        type: Sequelize.STRING,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    password: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: true
        }
    }
});

const Note = db.define('note', {
    name: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: true
        }
    },
    content: {
        type: Sequelize.TEXT,
        validate: {
            notEmpty: true
        }
    }
});

User.hasMany(Note);
Note.belongsTo(User);

module.exports = {
    db,
    User,
    Note
};