const ClienteModel = require('../models/ClienteModel');
const ServicoModel = require('../models/ServicoModel');
const AgendamentoModel = require('../models/AgendamentoModel');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class DashboardService {
    async obterMetricas() {
        const totalClientes = await ClienteModel.count();
        const totalServicos = await ServicoModel.count();
        const totalAgendamentos = await AgendamentoModel.count();


        const hojeObj = new Date();
        const ano = hojeObj.getFullYear();
        const mes = String(hojeObj.getMonth() + 1).padStart(2, '0');
        const dia = String(hojeObj.getDate()).padStart(2, '0');
        const dataHojeStr = `${ano}-${mes}-${dia}`;

        const agendamentosHoje = await AgendamentoModel.count({
            where: { data: dataHojeStr }
        });

        const agendamentosPendentes = await AgendamentoModel.count({
            where: { status: 'pendente' }
        });

        const agendamentosConfirmados = await AgendamentoModel.count({
            where: { status: 'confirmado' }
        });

        const agendamentosCancelados = await AgendamentoModel.count({
            where: { status: 'cancelado' }
        });

        return {
            totalClientes,
            totalServicos,
            totalAgendamentos,
            agendamentosHoje,
            agendamentosPendentes,
            agendamentosConfirmados,
            agendamentosCancelados
        };
    }
}

module.exports = new DashboardService();
