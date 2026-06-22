const Sequelize = require('sequelize');
const db = require('../config/database');

const ClienteModel = db.define('cliente', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    telefone: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = ClienteModel;
