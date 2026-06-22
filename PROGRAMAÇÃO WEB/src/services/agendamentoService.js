const AgendamentoModel = require('../models/AgendamentoModel');
const ClienteModel = require('../models/ClienteModel');
const ServicoModel = require('../models/ServicoModel');
const horarioService = require('./horarioService');

class AgendamentoService {
    async listarAgendamentos() {
        return await AgendamentoModel.findAll({
            include: [ClienteModel, ServicoModel],
            order: [['data', 'ASC'], ['horario', 'ASC']],
            raw: true,
            nest: true
        });
    }

    async buscarAgendamentoPorId(id) {
        return await AgendamentoModel.findByPk(id);
    }

    async criarAgendamento(dados) {

        const disponivel = await horarioService.validarDisponibilidade(dados.data, dados.horario, dados.servicoId);
        if (!disponivel) {
            throw new Error('Horário não disponível');
        }
        return await AgendamentoModel.create(dados);
    }

    async confirmarAgendamento(id) {
        const agendamento = await this.buscarAgendamentoPorId(id);
        if (agendamento) {
            return await agendamento.update({ status: 'confirmado' });
        }
        return null;
    }

    async cancelarAgendamento(id) {
        const agendamento = await this.buscarAgendamentoPorId(id);
        if (agendamento) {
            return await agendamento.update({ status: 'cancelado' });
        }
        return null;
    }

    async atualizarAgendamento(id, dados) {
        const agendamento = await this.buscarAgendamentoPorId(id);
        if (agendamento) {

            if (dados.data || dados.horario || dados.servicoId) {
                const novaData = dados.data || agendamento.data;
                const novoHorario = dados.horario || agendamento.horario;
                const novoServico = dados.servicoId || agendamento.servicoId;
                

                if (novaData !== agendamento.data || novoHorario !== agendamento.horario) {
                    const disponivel = await horarioService.validarDisponibilidade(novaData, novoHorario, novoServico);
                    if (!disponivel) {
                        throw new Error('O novo horário selecionado não está disponível.');
                    }
                }
            }
            return await agendamento.update(dados);
        }
        throw new Error('Agendamento não encontrado');
    }

    async excluirAgendamento(id) {
        const agendamento = await this.buscarAgendamentoPorId(id);
        if (agendamento) {
            return await agendamento.destroy();
        }
        throw new Error('Agendamento não encontrado');
    }
}

module.exports = new AgendamentoService();
