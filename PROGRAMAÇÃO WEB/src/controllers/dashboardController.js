const dashboardService = require('../services/dashboardService');

class DashboardController {
    async index(req, res) {
        try {
            const metricas = await dashboardService.obterMetricas();
            res.render('admin/dashboard.html', { metricas });
        } catch (error) {
            console.error(error);
            res.render('admin/dashboard.html', { erro: 'Não foi possível carregar as métricas.' });
        }
    }
}

module.exports = new DashboardController();
