const Usuario = require('../models/UsuarioModel');

function getLoginView(req, res){
    let erro = req.query.erro;
    res.render('auth/login.html', {erro});
}

function getCadastroView(req, res){
    let erro = req.query.erro;
    res.render('auth/cadastro.html', {erro});
}

function postCadastrarUsuario(req, res){
    let dados_usuario = {
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        isAdmin: false
    }
    Usuario.create(dados_usuario).then(()=>{
        res.redirect('/login');
    }).catch((err)=>{
        res.redirect('/cadastrar_usuario?erro=1');
    });
}

async function postLogin(req, res){
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

    if(usuario != null){
        console.log('USUÁRIO AUTENTICADO');
        req.session.autorizado = true;
        req.session.usuario_nome = usuario.nome;
        req.session.usuario_email = usuario.email;
        req.session.isAdmin = usuario.isAdmin;
        
        if(usuario.isAdmin) {
            res.redirect('/admin/dashboard');
        } else {
            res.redirect('/');
        }
    }
    else{
        console.log('USUÁRIO NÃO AUTENTICADO');
        res.redirect('/login?erro=Login ou senha inválidos!');
    }

}

function verificarAutenticacao(req, res, next){
    if(req.session.autorizado){

        console.log('usuário autorizado');
        next();
    }
    else{
        console.log('usuário NÃO autorizado');
        res.redirect('/login?erro=Você precisa estar logado para acessar esta página.');
    }
}

function getLogoutView(req, res){
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
