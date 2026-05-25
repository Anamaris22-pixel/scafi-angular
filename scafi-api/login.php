<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

// =========================
// PREVENIR ERROR CORS
// =========================

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {

    http_response_code(200);
    exit();

}

// =========================
// CONEXION
// =========================

include 'conexion.php';

// =========================
// RECIBIR DATOS
// =========================

$data = json_decode(
    file_get_contents("php://input"),
    true
);

$correo =
$data['correo'] ?? '';

$password =
$data['password'] ?? '';

// =========================
// LOGIN
// =========================

$sql = "

    SELECT

        u.id,
        u.nombre,
        u.correo,
        u.contrasena,
        u.idRol,
        r.nombreRol

    FROM usuario u

    INNER JOIN rol r
    ON u.idRol = r.idRol

    WHERE u.correo = '$correo'

    LIMIT 1

";

$resultado =
mysqli_query($conexion, $sql);

// =========================
// USUARIO EXISTE
// =========================

if (
    mysqli_num_rows($resultado) > 0
) {

    $usuario =
    mysqli_fetch_assoc($resultado);

    // =========================
    // PASSWORD CORRECTA
    // =========================

    if (
        $password ===
        $usuario['contrasena']
    ) {

        echo json_encode([

            "ok" => true,

            "usuario" => [

                "id" =>
                $usuario['id'],

                "nombre" =>
                $usuario['nombre'],

                "correo" =>
                $usuario['correo'],

                "idRol" =>
                $usuario['idRol'],

                "rol" =>
                $usuario['nombreRol']

            ]

        ]);

    }

    // =========================
    // PASSWORD INCORRECTA
    // =========================

    else {

        echo json_encode([

            "ok" => false,

            "mensaje" =>
            "Contraseña incorrecta"

        ]);

    }

}

// =========================
// USUARIO NO EXISTE
// =========================

else {

    echo json_encode([

        "ok" => false,

        "mensaje" =>
        "Usuario no encontrado"

    ]);

}

// =========================
// CERRAR CONEXION
// =========================

$conexion->close();

?>