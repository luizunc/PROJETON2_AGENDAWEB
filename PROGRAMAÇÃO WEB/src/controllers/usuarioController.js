const Usuario = require('../models/UsuarioModel');

function getLoginView(req, res) {
    let codigoErro = req.query.erro;
    let erro = null;
    if (codigoErro === 'credenciais_invalidas') {
        erro = 'Login ou senha inválidos';
    } else if (codigoErro === 'nao_logado') {
        erro = 'Você precisa estar logado para acessar esta página.';
    } else if (codigoErro) {
        erro = codigoErro;
    }
    res.render('auth/login.html', { erro });
}

function getCadastroView(req, res) {
    let codigoErro = req.query.erro;
    let erro = null;
    if (codigoErro === 'email_cadastrado') {
        erro = 'Este e-mail já está cadastrado';
    } else if (codigoErro === 'erro_cadastro' || codigoErro === '1') {
        erro = 'Não foi possível realizar o cadastro. Tente novamente.';
    } else if (codigoErro) {
        erro = codigoErro;
    }
    res.render('auth/cadastro.html', { erro });
}

function postCadastrarUsuario(req, res) {
    let dados_usuario = {
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        isAdmin: false
    }
    Usuario.create(dados_usuario).then(() => {
        res.redirect('/login');
    }).catch((err) => {
        console.error("Erro ao cadastrar usuário:", err);
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.redirect('/cadastrar_usuario?erro=email_cadastrado');
        } else {
            res.redirect('/cadastrar_usuario?erro=erro_cadastro');
        }
    });
}

async function postLogin(req, res) {
    dados_login = {
        email: req.body.email,
        senha: req.body.senha
    }

    let usuario = await Usuario.findOne({
        where: {
            email: dados_login.email,
            senha: dados_login.senha
        }
    });

    if (usuario != null) {
        console.log('USUÁRIO AUTENTICADO');
        req.session.autorizado = true;
        req.session.usuario_nome = usuario.nome;
        req.session.usuario_email = usuario.email;
        req.session.isAdmin = usuario.isAdmin;

        res.redirect('/');
    }
    else {
        console.log('USUÁRIO NÃO AUTENTICADO');
        res.redirect('/login?erro=credenciais_invalidas');
    }

}

function verificarAutenticacao(req, res, next) {
    if (req.session.autorizado) {

        console.log('usuário autorizado');
        next();
    }
    else {
        console.log('usuário NÃO autorizado');
        res.redirect('/login?erro=nao_logado');
    }
}

function getLogoutView(req, res) {
    req.session.destroy();
    res.redirect('/');
}

module.exports = {
    getLoginView,
    getCadastroView,
    postCadastrarUsuario,
    postLogin,
    verificarAutenticacao,
    getLogoutView
}
