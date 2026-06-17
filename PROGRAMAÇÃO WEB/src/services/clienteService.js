const ClienteModel = require('../models/ClienteModel');

class ClienteService {
    async listarClientes() {
        return await ClienteModel.findAll();
    }

    async buscarClientePorId(id) {
        return await ClienteModel.findByPk(id);
    }

    async criarCliente(dados) {
        return await ClienteModel.create(dados);
    }

    async editarCliente(id, dados) {
        const cliente = await this.buscarClientePorId(id);
        if (cliente) {
            return await cliente.update(dados);
        }
        return null;
    }

    async deletarCliente(id) {
        const cliente = await this.buscarClientePorId(id);
        if (cliente) {
            return await cliente.destroy();
        }
        return false;
    }
}

module.exports = new ClienteService();
