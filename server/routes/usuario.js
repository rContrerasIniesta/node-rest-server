const express = require('express');
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');


app.get('/usuario', verificaToken, (req, res) => {

    let desde = req.query.desde || 0; // sino viene en la consulta el parametro opcional(se recogen con req.query) ponemos desde el 0
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    // con el segundo parametro indicamos las columnas de la tabla que queremos devolver
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde) // con esto nos saltamos los primeros 5 registros
        .limit(limite) // Limita la busqueda a 5 registros
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // Tiene que tener el mismo parametro que el find para devolver el mismo filtro
            Usuario.countDocuments({ estado: true }, (err, cuenta) => {
                res.json({
                    ok: true,
                    usuarios,
                    total: cuenta
                });
            })

        });

});

app.post('/usuario', [verificaToken, verificaAdminRol], function(req, res) {
    let body = req.body;


    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        } else {
            res.json({
                ok: true,
                usuario: usuarioDB
            });
        }


    });
});

app.put('/usuario/:id', [verificaToken, verificaAdminRol], function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    // En este caso usuarioDB tiene el usuario original
    // para que devuelva el nuevo hay que incluir un tercer parametro { new:true }, runValidator para que 
    // la actualizacion use las validaciones definidas en el schema
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        } else {
            res.json({
                ok: true,
                usuario: usuarioDB
            });
        }

    });


});

app.delete('/usuario/:id', [verificaToken, verificaAdminRol], function(req, res) {

    let id = req.params.id;

    // Borrado fisico
    /* Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    }); */

    let body = { estado: false };

    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        } else {
            res.json({
                ok: true,
                usuario: usuarioDB
            });
        }

    });


});

module.exports = app;