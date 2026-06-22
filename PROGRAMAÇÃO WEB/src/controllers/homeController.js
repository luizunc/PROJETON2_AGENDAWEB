const servicoService = require('../services/servicoService');

class HomeController {
    async index(req, res) {
        try {

            const servicosRaw = await servicoService.listarServicos(true);
            const servicos = servicosRaw.map(s => {
                const item = s.get ? s.get({ plain: true }) : s;
                item.precoFormatado = Number(item.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                return item;
            });
            
            res.render('site/index.html', {
                servicos,
                autorizado: req.session ? req.session.autorizado : false,
                usuario_nome: req.session && req.session.usuario_nome ? req.session.usuario_nome.split(' ')[0] : '',
                isAdmin: req.session ? (req.session.isAdmin || false) : false
            });
        } catch (error) {
            console.error("Erro ao carregar a home:", error);
            res.render('site/index.html', { erro: 'Não foi possível carregar os dados.' });
        }
    }
}

module.exports = new HomeController();
