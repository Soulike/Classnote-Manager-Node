// Server config file. Please specify all the item below before starting the server

// The port which the server listens
const PORT = 0;

// Database configs. Please refer to Sequelize documentations for further information
// English: http://docs.sequelizejs.com/#example-usage
// Simplified Chinese: https://demopark.github.io/sequelize-docs-Zh-CN/getting-started.html#%E5%BB%BA%E7%AB%8B%E8%BF%9E%E6%8E%A5
const DATABASE = {
    database: '',
    username: '',
    password: '',
    config: {
        host: '',
        dialect: '',// 'mysql'|'sqlite'|'postgres'|'mssql'
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        timezone: '+08:00',
        logging: null// logging function used by Sequelize. If you want to see all the SQLs executed by Sequelize, remove this line or specify a logging function like console.log
    }
};

module.exports = {
    DATABASE,
    PORT
};