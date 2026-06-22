const Sequelize = require('sequelize');
const db = require('../config/database');
const ClienteModel = require('./ClienteModel');
const ServicoModel = require('./ServicoModel');

const AgendamentoModel = db.define('agendamento', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    data: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    horario: {
        type: Sequelize.TIME,
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM('pendente', 'confirmado', 'cancelado'),
        defaultValue: 'pendente',
        allowNull: false
    }
}, {
    indexes: [
        { fields: ['data'] },
        { fields: ['horario'] },
        { fields: ['status'] },
        { fields: ['clienteId'] },
        { fields: ['servicoId'] }
    ]
});

ClienteModel.hasMany(AgendamentoModel, { foreignKey: 'clienteId' });
AgendamentoModel.belongsTo(ClienteModel, { foreignKey: 'clienteId' });

ServicoModel.hasMany(AgendamentoModel, { foreignKey: 'servicoId' });
AgendamentoModel.belongsTo(ServicoModel, { foreignKey: 'servicoId' });

module.exports = AgendamentoModel;
