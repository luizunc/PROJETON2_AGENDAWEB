const Sequelize = require('sequelize');
const db = require('../config/database');

const ServicoModel = db.define('servico', {
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
    duracao: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    preco: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    ativo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    }
});

module.exports = ServicoModel;
