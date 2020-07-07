const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');
const producto = require('../models/producto');

// Obtener todos los productos
app.get('/productos', verificaToken, (req, res) => {
    // trae todos los productos
    // populate: usuario y categoria
    // paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.status(200).json({
                ok: true,
                productos: productosDB
            });
        });
});

// Obtener un producto por id
app.get('/productos/:id', verificaToken, (req, res) => {
    // populate: usuario y categoria
    let id = req.params.id;


    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (!productoDB) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'El producto no existe en la base de datos'
                    }
                });
            }

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }


            res.status(200).json({
                ok: true,
                producto: productoDB
            });
        });

});

// buscar productos
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regExp = new RegExp(termino, 'i'); // la i es para que no sea sensible a mayusculas y minusculas

    Producto.find({ nombre: regExp, disponible: true })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });
        })

})

// Crear prodcuto
app.post('/productos/', verificaToken, (req, res) => {
    // grabar usuario
    // grabar categoria
    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });

});

// Actualizar prodcuto
app.put('/productos/:id', verificaToken, (req, res) => {
    // grabar usuario
    // grabar categoria
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                prodcuto: productoGuardado
            });
        });
    });

});

// Borrar prodcuto
app.delete('/productos/:id', verificaToken, (req, res) => {
    // Actualizar estado disponible a false

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if (!productoDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El producto no existe en la base de datos'
                }
            });
        }

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        productoDB.disponible = false;

        productoDB.save((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                message: `El producto ${productoDB.nombre} ya no esta disponible`,
                producto: productoDB
            });
        })
    })

});

module.exports = app;