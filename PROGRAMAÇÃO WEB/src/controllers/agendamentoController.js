const agendamentoService = require('../services/agendamentoService');
const horarioService = require('../services/horarioService');
const servicoService = require('../services/servicoService');
const clienteService = require('../services/clienteService');

class AgendamentoController {

    async getIndex(req, res) {
        if (!req.session || !req.session.autorizado) {
            return res.redirect('/login?erro=Você precisa estar logado para fazer um agendamento.');
        }

        try {
            const servicosRaw = await servicoService.listarServicos(true);
            const servicos = servicosRaw.map(s => {
                const item = s.get ? s.get({ plain: true }) : s;
                item.precoFormatado = Number(item.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                return item;
            });
            const dataConsulta = req.query.data || new Date().toISOString().split('T')[0];
            const horariosDisponiveis = await horarioService.gerarHorariosDisponiveis(dataConsulta, 30);

            res.render('cliente/agendamento.html', {
                servicos,
                horariosDisponiveis,
                dataSelecionada: dataConsulta,
                erro: req.query.erro,
                sucesso: req.query.sucesso,
                autorizado: req.session ? req.session.autorizado : false,
                usuario_nome: req.session ? req.session.usuario_nome : '',
                usuario_email: req.session ? req.session.usuario_email : '',
                isAdmin: req.session ? (req.session.isAdmin || false) : false
            });
        } catch (error) {
            res.render('cliente/agendamento.html', { erro: 'Erro ao carregar os dados de agendamento.' });
        }
    }

    async getMeusAgendamentos(req, res) {
        if (!req.session || !req.session.autorizado) {
            return res.redirect('/login?erro=Você precisa estar logado para visualizar a agenda.');
        }

        try {
            const ClienteModel = require('../models/ClienteModel');
            const ServicoModel = require('../models/ServicoModel');
            const AgendamentoModel = require('../models/AgendamentoModel');
            
            const cliente = await ClienteModel.findOne({ where: { email: req.session.usuario_email } });
            
            let agendamentos = [];
            if (cliente) {
                agendamentos = await AgendamentoModel.findAll({
                    where: { clienteId: cliente.id },
                    include: [ServicoModel],
                    order: [['data', 'DESC'], ['horario', 'DESC']],
                    raw: true,
                    nest: true
                });
            }


            agendamentos = agendamentos.map(a => {
                a.status = { [a.status]: true };
                return a;
            });

            res.render('cliente/meus_agendamentos.html', {
                agendamentos,
                autorizado: req.session.autorizado,
                usuario_nome: req.session.usuario_nome.split(' ')[0],
                isAdmin: req.session.isAdmin || false
            });
        } catch (error) {
            console.error(error);
            res.render('cliente/meus_agendamentos.html', { erro: 'Erro ao carregar seus agendamentos.' });
        }
    }

    async postAgendamento(req, res) {
        if (!req.session || !req.session.autorizado) {
            return res.redirect('/login?erro=Você precisa estar logado para agendar.');
        }

        try {
            const { nome, email, telefone, data, horario, servicoId } = req.body;
            


            const ClienteModel = require('../models/ClienteModel');
            let cliente = await ClienteModel.findOne({ where: { email } });
            if (!cliente) {
                cliente = await clienteService.criarCliente({ nome, email, telefone });
            }

            const dadosAgendamento = {
                data,
                horario,
                servicoId,
                clienteId: cliente.id,
                status: 'pendente'
            };

            await agendamentoService.criarAgendamento(dadosAgendamento);
            res.redirect('/agendamento?sucesso=Agendamento realizado com sucesso!');
        } catch (error) {
            res.redirect('/agendamento?erro=' + encodeURIComponent(error.message || 'Erro ao realizar agendamento.'));
        }
    }

    async getEditar(req, res) {
        if (!req.session || !req.session.autorizado) {
            return res.redirect('/login?erro=Você precisa estar logado para editar um agendamento.');
        }
        try {
            const agendamento = await agendamentoService.buscarAgendamentoPorId(req.params.id);
            if (!agendamento) {
                return res.redirect('/meus_agendamentos?erro=Agendamento não encontrado.');
            }

            const ClienteModel = require('../models/ClienteModel');
            const cliente = await ClienteModel.findOne({ where: { email: req.session.usuario_email } });
            if (!cliente || agendamento.clienteId !== cliente.id) {
                return res.redirect('/meus_agendamentos?erro=Sem permissão para editar este agendamento.');
            }
            if (agendamento.status !== 'pendente') {
                return res.redirect('/meus_agendamentos?erro=Apenas agendamentos pendentes podem ser editados.');
            }

            const servicosRaw = await servicoService.listarServicos(true);
            const servicos = servicosRaw.map(s => {
                const item = s.get ? s.get({ plain: true }) : s;
                item.precoFormatado = Number(item.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                item.selected = item.id === agendamento.servicoId;
                return item;
            });

            const dataConsulta = req.query.data || agendamento.data;
            const horariosDisponiveis = await horarioService.gerarHorariosDisponiveis(dataConsulta, 30);
            
            let horarios = horariosDisponiveis;
            if (dataConsulta === agendamento.data && !horarios.includes(agendamento.horario)) {
                horarios.push(agendamento.horario);
                horarios.sort();
            }
            
            const horariosObjetos = horarios.map(h => ({
                hora: h,
                selected: h === agendamento.horario
            }));

            res.render('cliente/editar_agendamento.html', {
                agendamento,
                servicos,
                horariosDisponiveis: horariosObjetos,
                dataSelecionada: dataConsulta,
                erro: req.query.erro,
                sucesso: req.query.sucesso,
                autorizado: req.session.autorizado,
                usuario_nome: req.session.usuario_nome.split(' ')[0],
                isAdmin: req.session.isAdmin || false
            });
        } catch (error) {
            res.redirect('/meus_agendamentos?erro=Erro ao carregar dados para edição.');
        }
    }

    async postEditar(req, res) {
        if (!req.session || !req.session.autorizado) {
            return res.redirect('/login?erro=Você precisa estar logado para editar.');
        }
        try {
            const agendamento = await agendamentoService.buscarAgendamentoPorId(req.params.id);
            const ClienteModel = require('../models/ClienteModel');
            const cliente = await ClienteModel.findOne({ where: { email: req.session.usuario_email } });
            
            if (!cliente || agendamento.clienteId !== cliente.id || agendamento.status !== 'pendente') {
                return res.redirect('/meus_agendamentos?erro=Ação não permitida.');
            }

            const { data, horario, servicoId } = req.body;
            await agendamentoService.atualizarAgendamento(req.params.id, { data, horario, servicoId });
            res.redirect('/meus_agendamentos?sucesso=Agendamento atualizado com sucesso!');
        } catch (error) {
            res.redirect('/agendamento/editar/' + req.params.id + '?erro=' + encodeURIComponent(error.message || 'Erro ao editar agendamento.'));
        }
    }

    async postExcluir(req, res) {
        if (!req.session || !req.session.autorizado) {
            return res.redirect('/login?erro=Você precisa estar logado para excluir.');
        }
        try {
            const agendamento = await agendamentoService.buscarAgendamentoPorId(req.params.id);
            const ClienteModel = require('../models/ClienteModel');
            const cliente = await ClienteModel.findOne({ where: { email: req.session.usuario_email } });
            
            if (!cliente || agendamento.clienteId !== cliente.id || agendamento.status !== 'pendente') {
                return res.redirect('/meus_agendamentos?erro=Ação não permitida ou agendamento já processado.');
            }

            await agendamentoService.excluirAgendamento(req.params.id);
            res.redirect('/meus_agendamentos?sucesso=Agendamento cancelado (excluído) com sucesso!');
        } catch (error) {
            res.redirect('/meus_agendamentos?erro=Erro ao excluir agendamento.');
        }
    }

    async listarAdmin(req, res) {
        try {
            const agendamentos = await agendamentoService.listarAgendamentos();
            res.render('admin/horarios.html', { agendamentos, erro: req.query.erro, sucesso: req.query.sucesso });
        } catch (error) {
            res.render('admin/horarios.html', { erro: 'Erro ao buscar agendamentos.' });
        }
    }

    async confirmar(req, res) {
        try {
            await agendamentoService.confirmarAgendamento(req.params.id);
            res.redirect('/admin/horarios?sucesso=Agendamento confirmado!');
        } catch (error) {
            res.redirect('/admin/horarios?erro=Erro ao confirmar agendamento.');
        }
    }

    async cancelar(req, res) {
        try {
            await agendamentoService.cancelarAgendamento(req.params.id);
            res.redirect('/admin/horarios?sucesso=Agendamento cancelado!');
        } catch (error) {
            res.redirect('/admin/horarios?erro=Erro ao cancelar agendamento.');
        }
    }

    async getDetalharAgendamento(req, res) {
        try {
            const agendamento = await agendamentoService.buscarAgendamentoPorId(req.params.id);
            res.render('admin/detalha_agendamento.html', { agendamento });
        } catch (error) {
            res.redirect('/admin/horarios?erro=Erro ao buscar detalhes.');
        }
    }
}

module.exports = new AgendamentoController();
