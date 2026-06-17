const Sequelize = require('sequelize');
const db = require('../config/database');

const ConfiguracaoModel = db.define('configuracao', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    chave: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    valor: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = ConfiguracaoModel;
