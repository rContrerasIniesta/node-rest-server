const express = require('express');
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');


// lista de categorias
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .populate('usuario', 'nombre email') // con esto cargamos la informacion a la tabla asociada al id del usuario, segundo parametro es el select
        .sort('-descripcion') // sin el menos lo ordena al reves
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categorias
            });
        })
});


// Mostrar una categoria por ID
app.get('/categoria/:id', verificaToken, (req, res) => {
    // Categoria.findById()
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'La categoria indicada no existe'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });
});

// Crear nueva categoria
app.post('/categoria', verificaToken, (req, res) => {
    // devuelve la nueva categoria
    // req.usuario._id --> tiene el id del usuario
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id // esto lo incluye el verifica token
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });


});

// Actualizar el nombre de la categoria
app.put('/categoria/:id', (req, res) => {
    // devuelve la nueva categoria
    // req.usuario._id --> tiene el id del usuario

    let id = req.params.id;

    let body = req.body;
    console.log(body);
    let desCategoria = {
        descripcion: body.descripcion
    }
    Categoria.findByIdAndUpdate(id, desCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// Borrado de categoria
// solo un administrador puede borrar las categorias
app.delete('/categoria/:id', [verificaToken, verificaAdminRol], (req, res) => {
    // Categoria.findByIdAndRemove
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB,
            message: 'Categoria borrada'
        });
    });


});

module.exports = app;