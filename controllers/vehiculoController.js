const EstacionamientoModel = require('../models/estacionamientoModel');

exports.renderDashboard = async (req, res) => {
    try {
        const tipos = await EstacionamientoModel.getTipos();
        const activos = await EstacionamientoModel.getVehiculosActivos();
        res.render('index', { tipos, activos, mensaje: null, error: null });
    } catch (err) {
        res.status(500).send("Error en el servidor");
    }
};

exports.entrada = async (req, res) => {
    const { placa, tipo_id } = req.body;
    const tipos = await EstacionamientoModel.getTipos();
    const activos = await EstacionamientoModel.getVehiculosActivos();

    try {
        const existe = await EstacionamientoModel.buscarEstanciaActiva(placa);
        if (existe) {
            return res.render('index', { tipos, activos, mensaje: null, error: `El vehículo con placa ${placa} ya está dentro.` });
        }
        await EstacionamientoModel.registrarEntrada(placa, tipo_id);
        res.redirect('/');
    } catch (err) {
        res.render('index', { tipos, activos, mensaje: null, error: "Error al registrar entrada." });
    }
};

exports.salida = async (req, res) => {
    const { placa } = req.body;
    const tipos = await EstacionamientoModel.getTipos();
    const activos = await EstacionamientoModel.getVehiculosActivos();

    try {
        const estancia = await EstacionamientoModel.buscarEstanciaActiva(placa);
        if (!estancia) {
            return res.render('index', { tipos, activos, mensaje: null, error: `No se encontró vehículo activo con placa ${placa}.` });
        }

        const ahora = new Date();
        const entrada = new Date(estancia.hora_entrada);
        const minutos = Math.ceil((ahora - entrada) / 60000);

        let total = 0;
        if (estancia.tipo_nombre === 'Residente') {
            total = minutos * 1.00;
        } else if (estancia.tipo_nombre === 'No Residente') {
            total = minutos * 3.00; // Corregido: de 'minutes' a 'minutos'
        } // Oficial se queda en 0.00

        await EstacionamientoModel.registrarSalida(estancia.id, total);
        
        const activosActualizados = await EstacionamientoModel.getVehiculosActivos();
        res.render('index', { 
            tipos, 
            activos: activosActualizados, 
            mensaje: `Salida exitosa de ${placa}. Tiempo: ${minutos} min. Total a pagar: $${total.toFixed(2)} MXN`, 
            error: null 
        });
    } catch (err) {
        res.render('index', { tipos, activos, mensaje: null, error: "Error al registrar salida." });
    }
};