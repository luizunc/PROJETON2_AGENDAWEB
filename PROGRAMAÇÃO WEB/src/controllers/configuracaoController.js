const ConfiguracaoModel = require('../models/ConfiguracaoModel');

class ConfiguracaoController {
    async listar(req, res) {
        try {
            const configuracoes = await ConfiguracaoModel.findAll();
            res.render('admin/configuracoes.html', { configuracoes, erro: req.query.erro, sucesso: req.query.sucesso });
        } catch (error) {
            res.render('admin/configuracoes.html', { erro: 'Erro ao buscar configurações.' });
        }
    }

    async salvar(req, res) {
        try {


            const dados = req.body;
            
            for (const chave in dados) {
                if (Object.hasOwnProperty.call(dados, chave)) {
                    const valor = dados[chave];
                    let config = await ConfiguracaoModel.findOne({ where: { chave } });
                    
                    if (config) {
                        await config.update({ valor });
                    } else {
                        await ConfiguracaoModel.create({ chave, valor });
                    }
                }
            }
            
            res.redirect('/admin/configuracoes?sucesso=Configurações salvas com sucesso');
        } catch (error) {
            res.redirect('/admin/configuracoes?erro=Erro ao salvar configurações.');
        }
    }
}

module.exports = new ConfiguracaoController();
