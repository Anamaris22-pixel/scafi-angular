<?php
header("Content-Type: application/json");
session_start();

// destruir sesión
session_unset();
session_destroy();

echo json_encode([
    "status" => "ok",
    "mensaje" => "Sesión cerrada"
]);
?>