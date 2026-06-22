const ConfiguracaoModel = require('../models/ConfiguracaoModel');
const AgendamentoModel = require('../models/AgendamentoModel');

class HorarioService {
    async getParametroConfig(chave, valorPadrao) {
        const config = await ConfiguracaoModel.findOne({ where: { chave } });
        return config ? config.valor : valorPadrao;
    }

    async gerarHorariosDisponiveis(data, servicoDuracaoMinutos = 30) {
        const horarioInicio = await this.getParametroConfig('horario_inicio', '09:00');
        const horarioFim = await this.getParametroConfig('horario_fim', '18:00');
        const intervaloMinutos = parseInt(await this.getParametroConfig('intervalo_minutos', '30'));

        const horarios = [];
        let [horaAtual, minutoAtual] = horarioInicio.split(':').map(Number);
        const [horaFim, minutoFim] = horarioFim.split(':').map(Number);

        const limiteFimMinutos = horaFim * 60 + minutoFim;

        while (horaAtual * 60 + minutoAtual + servicoDuracaoMinutos <= limiteFimMinutos) {
            const hStr = horaAtual.toString().padStart(2, '0');
            const mStr = minutoAtual.toString().padStart(2, '0');
            const horario = `${hStr}:${mStr}`;
            

            const agendamentoExistente = await AgendamentoModel.findOne({
                where: {
                    data: data,
                    horario: horario,
                    status: ['pendente', 'confirmado']
                }
            });

            if (!agendamentoExistente) {
                horarios.push(horario);
            }


            minutoAtual += intervaloMinutos;
            if (minutoAtual >= 60) {
                horaAtual += Math.floor(minutoAtual / 60);
                minutoAtual = minutoAtual % 60;
            }
        }

        return horarios;
    }

    async validarDisponibilidade(data, horario, servicoId) {
        const disponiveis = await this.gerarHorariosDisponiveis(data, 30);
        return disponiveis.includes(horario);
    }
}

module.exports = new HorarioService();
