const express = require('express');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const agendamentoRouter = require('./src/routes/agendamentoRouter');
const usuarioRouter = require('./src/routes/usuarioRouter');
const homeRouter = require('./src/routes/homeRouter');
const clienteRouter = require('./src/routes/clienteRouter');
const servicoRouter = require('./src/routes/servicoRouter');
const dashboardRouter = require('./src/routes/dashboardRouter');
const configuracaoRouter = require('./src/routes/configuracaoRouter');
const db = require('./src/config/database');

const PORT = 8080;
const app = express();

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: 'secret-token',
    name: 'sessionId',
    resave: false,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    if (req.session && req.session.usuario_nome) {
        res.locals.primeiro_nome = req.session.usuario_nome.split(' ')[0];
    }
    next();
});

app.use('/', homeRouter);
app.use('/', agendamentoRouter);
app.use('/', usuarioRouter);
app.use('/', clienteRouter);
app.use('/', servicoRouter);
app.use('/', dashboardRouter);
app.use('/', configuracaoRouter);

require('./src/models/ConfiguracaoModel');
require('./src/models/AgendamentoModel');

db.sync();

app.listen(PORT, ()=>{
    console.log('app rodando na porta ' + PORT);
});
