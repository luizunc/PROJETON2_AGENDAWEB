function autenticacaoAdmin(req, res, next) {
    if (req.session && req.session.autorizado && req.session.isAdmin) {
        next();
    } else {
        res.redirect('/login?erro=Acesso restrito a administradores.');
    }
}

module.exports = autenticacaoAdmin;
