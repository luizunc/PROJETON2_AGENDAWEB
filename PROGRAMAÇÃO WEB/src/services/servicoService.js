const ServicoModel = require('../models/ServicoModel');

class ServicoService {
    async listarServicos(apenasAtivos = true) {
        const condicao = apenasAtivos ? { where: { ativo: true } } : {};
        return await ServicoModel.findAll(condicao);
    }

    async buscarServicoPorId(id) {
        return await ServicoModel.findByPk(id);
    }

    async criarServico(dados) {
        return await ServicoModel.create(dados);
    }

    async editarServico(id, dados) {
        const servico = await this.buscarServicoPorId(id);
        if (servico) {
            return await servico.update(dados);
        }
        return null;
    }

    async deletarServico(id) {

        const servico = await this.buscarServicoPorId(id);
        if (servico) {
            return await servico.update({ ativo: false });
        }
        return false;
    }
}

module.exports = new ServicoService();
