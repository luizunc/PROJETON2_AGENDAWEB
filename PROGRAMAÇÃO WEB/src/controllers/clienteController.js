const clienteService = require('../services/clienteService');

class ClienteController {
    async listar(req, res) {
        try {
            const clientes = await clienteService.listarClientes();
            res.render('admin/clientes.html', { clientes, erro: req.query.erro, sucesso: req.query.sucesso });
        } catch (error) {
            res.render('admin/clientes.html', { erro: 'Erro ao buscar clientes.' });
        }
    }

    async criar(req, res) {
        try {
            const dados = {
                nome: req.body.nome,
                email: req.body.email,
                telefone: req.body.telefone
            };
            await clienteService.criarCliente(dados);
            res.redirect('/admin/clientes?sucesso=Cliente criado com sucesso!');
        } catch (error) {
            res.redirect('/admin/clientes?erro=Erro ao criar cliente.');
        }
    }

    async editar(req, res) {
        try {
            await clienteService.editarCliente(req.params.id, req.body);
            res.redirect('/admin/clientes?sucesso=Cliente atualizado com sucesso!');
        } catch (error) {
            res.redirect('/admin/clientes?erro=Erro ao atualizar cliente.');
        }
    }

    async deletar(req, res) {
        try {
            await clienteService.deletarCliente(req.params.id);
            res.redirect('/admin/clientes?sucesso=Cliente removido com sucesso!');
        } catch (error) {
            res.redirect('/admin/clientes?erro=Erro ao remover cliente.');
        }
    }
}

module.exports = new ClienteController();
