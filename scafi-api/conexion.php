<?php

$conexion = new mysqli(
    "db",             // Host (Nombre del servicio en Docker)
    "root",           // Usuario
    "rootpassword",   // Contraseña
    "scafi",          // Nombre de la base de datos
    3307              // Puerto
);

if ($conexion->connect_error) {
    die("Error conexión: " . $conexion->connect_error);
}

// IMPORTANTE PARA EMOJIS
$conexion->set_charset("utf8mb4");
