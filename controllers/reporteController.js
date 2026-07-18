const EstacionamientoModel = require('../models/estacionamientoModel');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

exports.renderReportes = (req, res) => {
    res.render('reportes', { datos: [], filtrado: false, query: {} });
};

exports.generarReporte = async (req, res) => {
    const { fecha, hora_inicio, hora_fin } = req.query;
    try {
        const datos = await EstacionamientoModel.getReporte(fecha, hora_inicio, hora_fin);
        res.render('reportes', { datos, filtrado: true, query: req.query });
    } catch (err) {
        res.status(500).send("Error generando el reporte");
    }
};

exports.exportarExcel = async (req, res) => {
    const { fecha, hora_inicio, hora_fin } = req.query;
    const datos = await EstacionamientoModel.getReporte(fecha, hora_inicio, hora_fin);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte Estacionamiento');

    worksheet.columns = [
        { header: 'Núm. Placa', key: 'placa', width: 15 },
        { header: 'Tiempo', key: 'minutos', width: 15 },
        { header: 'Tipo', key: 'tipo', width: 15 },
        { header: 'Cantidad a Pagar', key: 'monto', width: 18 }
    ];

    datos.forEach(d => {
        worksheet.addRow({
            placa: d.placa,
            minutos: `${d.minutos} min`,
            tipo: d.tipo,
            monto: `$${d.monto_pagado}`
        });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Reporte_${fecha}.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
};

exports.exportarPDF = async (req, res) => {
    const { fecha, hora_inicio, hora_fin } = req.query;
    const datos = await EstacionamientoModel.getReporte(fecha, hora_inicio, hora_fin);

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Reporte_${fecha}.pdf`);
    doc.pipe(res);

    doc.fontSize(18).text('Reporte de Estacionamiento', { align: 'center' });
    doc.fontSize(12).text(`Fecha: ${fecha} | Rango: ${hora_inicio} - ${hora_fin}\n\n`, { align: 'center' });

    datos.forEach(d => {
        doc.text(`Placa: ${d.placa} | Tipo: ${d.tipo} | Tiempo: ${d.minutos} min | Total: $${d.monto_pagado}`);
    });

    doc.end();
};