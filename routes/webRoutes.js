const express = require('express');
const router = express.Router();
const vehiculoCtrl = require('../controllers/vehiculoController');
const reporteCtrl = require('../controllers/reporteController');

router.get('/', vehiculoCtrl.renderDashboard);
router.post('/entrada', vehiculoCtrl.entrada);
router.post('/salida', vehiculoCtrl.salida);

router.get('/reportes', reporteCtrl.renderReportes);
router.get('/reportes/buscar', reporteCtrl.generarReporte);
router.get('/reportes/excel', reporteCtrl.exportarExcel);
router.get('/reportes/pdf', reporteCtrl.exportarPDF);

module.exports = router;
