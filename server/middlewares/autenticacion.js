const jwt = require('jsonwebtoken');
// Verificar token
// el parametro next es para que se siga ejecutando el codigo que hay en la funcion que utiliza el middleware
let verificaToken = (req, res, next) => {

    let token = req.get('token'); // nombre del header que le demos en Postman

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });

};

let verificaAdminRol = (req, res, next) => {

    let usuario = req.usuario;
    console.log(usuario.role);
    if (usuario.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El rol del usuario no permite esta operacion'
            }
        });
    } else {
        next();
    }

};

let verificaTokenImg = (req, res, next) => {

    let token = req.query.token; // nombre del parametro ? en la url

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });

};

module.exports = {
    verificaToken,
    verificaAdminRol,
    verificaTokenImg
}