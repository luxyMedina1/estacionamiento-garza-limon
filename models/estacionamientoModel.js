const pool = require('../config/db');

const EstacionamientoModel = {
    // Obtener tipos de vehículos para el select de la vista
    getTipos: async () => {
        const [rows] = await pool.query('SELECT * FROM tipos_vehiculo');
        return rows;
    },

    // Registrar entrada de un auto
    registrarEntrada: async (placa, tipoVehiculoId) => {
        const query = 'INSERT INTO estancias (placa, tipo_vehiculo_id) VALUES (?, ?)';
        const [result] = await pool.query(query, [placa, tipoVehiculoId]);
        return result;
    },

    // Buscar si un auto está adentro (sin hora de salida)
    buscarEstanciaActiva: async (placa) => {
        const query = `
            SELECT e.*, t.nombre as tipo_nombre, t.tarifa_por_minuto 
            FROM estancias e 
            JOIN tipos_vehiculo t ON e.tipo_vehiculo_id = t.id 
            WHERE e.placa = ? AND e.hora_salida IS NULL
        `;
        const [rows] = await pool.query(query, [placa]);
        return rows[0];
    },

    // Registrar la salida y guardar el cobro total
    registrarSalida: async (id, monto) => {
        const query = 'UPDATE estancias SET hora_salida = NOW(), monto_pagado = ? WHERE id = ?';
        const [result] = await pool.query(query, [monto, id]);
        return result;
    },

    // Lista de autos actualmente estacionados
    getVehiculosActivos: async () => {
        const query = `
            SELECT e.placa, t.nombre as tipo 
            FROM estancias e 
            JOIN tipos_vehiculo t ON e.tipo_vehiculo_id = t.id 
            WHERE e.hora_salida IS NULL
        `;
        const [rows] = await pool.query(query);
        return rows;
    },

    // Obtener los datos filtrados para el reporte solicitado
    getReporte: async (fecha, horaInicio, horaFin) => {
        const desde = `${fecha} ${horaInicio}`;
        const hasta = `${fecha} ${horaFin}`;
        const query = `
            SELECT e.placa, 
                   t.nombre as tipo, 
                   e.hora_entrada, 
                   e.hora_salida,
                   CEIL(TIMESTAMPDIFF(MINUTE, e.hora_entrada, e.hora_salida)) as minutos,
                   e.monto_pagado
            FROM estancias e
            JOIN tipos_vehiculo t ON e.tipo_vehiculo_id = t.id
            WHERE e.hora_entrada BETWEEN ? AND ? AND e.hora_salida IS NOT NULL
        `;
        const [rows] = await pool.query(query, [desde, hasta]);
        return rows;
    }
};

module.exports = EstacionamientoModel;