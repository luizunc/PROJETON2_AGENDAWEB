const servicoService = require('../services/servicoService');

class ServicoController {
    async listar(req, res) {
        try {
            const servicos = await servicoService.listarServicos(false);
            res.render('admin/servicos.html', { servicos, erro: req.query.erro, sucesso: req.query.sucesso });
        } catch (error) {
            res.render('admin/servicos.html', { erro: 'Erro ao buscar serviços.' });
        }
    }

    async criar(req, res) {
        try {
            const dados = {
                nome: req.body.nome,
                duracao: parseInt(req.body.duracao),
                preco: parseFloat(req.body.preco),
                ativo: req.body.ativo === 'on'
            };
            await servicoService.criarServico(dados);
            res.redirect('/admin/servicos?sucesso=Serviço criado com sucesso!');
        } catch (error) {
            res.redirect('/admin/servicos?erro=Erro ao criar serviço.');
        }
    }

    async editar(req, res) {
        try {
            const dados = {
                nome: req.body.nome,
                duracao: parseInt(req.body.duracao),
                preco: parseFloat(req.body.preco),
                ativo: req.body.ativo === 'on'
            };
            await servicoService.editarServico(req.params.id, dados);
            res.redirect('/admin/servicos?sucesso=Serviço atualizado com sucesso!');
        } catch (error) {
            res.redirect('/admin/servicos?erro=Erro ao atualizar serviço.');
        }
    }

    async deletar(req, res) {
        try {
            await servicoService.deletarServico(req.params.id);
            res.redirect('/admin/servicos?sucesso=Serviço inativado com sucesso!');
        } catch (error) {
            res.redirect('/admin/servicos?erro=Erro ao inativar serviço.');
        }
    }
}

module.exports = new ServicoController();
