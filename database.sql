-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS estacionamiento_db;
USE estacionamiento_db;

-- 1. Crear la tabla de tipos de vehículos
CREATE TABLE IF NOT EXISTS tipos_vehiculo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    tarifa_por_minuto DECIMAL(10, 2) NOT NULL DEFAULT 0.00
);

-- 2. Crear la tabla de estancias (control de entradas y salidas)
CREATE TABLE IF NOT EXISTS estancias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    placa VARCHAR(10) NOT NULL,
    tipo_vehiculo_id INT,
    hora_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    hora_salida TIMESTAMP NULL DEFAULT NULL,
    monto_pagado DECIMAL(10, 2) DEFAULT 0.00,
    FOREIGN KEY (tipo_vehiculo_id) REFERENCES tipos_vehiculo(id) ON DELETE SET NULL
);

-- 3. Insertar los datos iniciales de configuración
INSERT INTO tipos_vehiculo (nombre, tarifa_por_minuto) VALUES
('Oficial', 0.00),
('Residente', 1.00),
('No Residente', 3.00)
ON DUPLICATE KEY UPDATE tarifa_por_minuto = VALUES(tarifa_por_minuto);