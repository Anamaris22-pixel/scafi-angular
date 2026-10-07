<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

include 'conexion.php';

try {

    $id = intval($_POST['id'] ?? 0);

    if ($id <= 0) {
        throw new Exception("Usuario no válido");
    }

    $nombre = trim($_POST['nombre'] ?? '');
    $correo = trim($_POST['correo'] ?? '');
    $telefono = trim($_POST['telefono'] ?? '');
    $documento = trim($_POST['documento'] ?? '');
    $direccion = trim($_POST['direccion'] ?? '');
    $password = trim($_POST['contrasena'] ?? '');

    if ($nombre === '') {
        throw new Exception("El nombre es obligatorio");
    }

    if ($correo === '' || !filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        throw new Exception("El correo electrónico no es válido");
    }

    // Verificar que el correo no pertenezca a otro usuario.
    $check = $conexion->prepare(
        "SELECT id FROM usuario WHERE LOWER(TRIM(correo)) = LOWER(TRIM(?)) AND id <> ? LIMIT 1"
    );

    if (!$check) {
        throw new Exception("No fue posible validar el correo");
    }

    $check->bind_param("si", $correo, $id);
    $check->execute();
    $resultado = $check->get_result();

    if ($resultado->num_rows > 0) {
        throw new Exception("El correo ya está registrado por otro usuario");
    }

    $fotoRuta = null;

    if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {

        $permitidas = [
            'image/jpeg',
            'image/png',
            'image/webp'
        ];

        $tipo = mime_content_type($_FILES['foto']['tmp_name']);

        if (!in_array($tipo, $permitidas, true)) {
            throw new Exception("La foto debe ser JPG, PNG o WEBP");
        }

        if ($_FILES['foto']['size'] > 5 * 1024 * 1024) {
            throw new Exception("La foto no puede superar 5 MB");
        }

        $extension = strtolower(pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION));
        $nombreFoto = time() . '_perfil_' . $id . '.' . $extension;
        $directorio = __DIR__ . '/uploads/';

        if (!is_dir($directorio)) {
            mkdir($directorio, 0775, true);
        }

        if (!move_uploaded_file(
            $_FILES['foto']['tmp_name'],
            $directorio . $nombreFoto
        )) {
            throw new Exception("No fue posible guardar la foto");
        }

        $fotoRuta = 'uploads/' . $nombreFoto;
    }

    if ($fotoRuta !== null) {

        $sql = "
            UPDATE usuario
            SET nombre = ?,
                correo = ?,
                telefono = ?,
                documento = ?,
                direccion = ?,
                foto = ?
            WHERE id = ?
        ";

        $stmt = $conexion->prepare($sql);

        if (!$stmt) {
            throw new Exception("No fue posible actualizar el perfil");
        }

        $stmt->bind_param(
            "ssssssi",
            $nombre,
            $correo,
            $telefono,
            $documento,
            $direccion,
            $fotoRuta,
            $id
        );

    } else {

        $sql = "
            UPDATE usuario
            SET nombre = ?,
                correo = ?,
                telefono = ?,
                documento = ?,
                direccion = ?
            WHERE id = ?
        ";

        $stmt = $conexion->prepare($sql);

        if (!$stmt) {
            throw new Exception("No fue posible actualizar el perfil");
        }

        $stmt->bind_param(
            "sssssi",
            $nombre,
            $correo,
            $telefono,
            $documento,
            $direccion,
            $id
        );
    }

    $stmt->execute();

    if ($password !== '') {

        if (strlen($password) < 6) {
            throw new Exception("La contraseña debe tener mínimo 6 caracteres");
        }

        $stmtPassword = $conexion->prepare(
            "UPDATE usuario SET contrasena = ? WHERE id = ?"
        );

        if (!$stmtPassword) {
            throw new Exception("No fue posible actualizar la contraseña");
        }

        $stmtPassword->bind_param("si", $password, $id);
        $stmtPassword->execute();
    }

    $consulta = $conexion->prepare(
        "SELECT id, nombre, correo, telefono, documento, direccion, foto, idRol, estado
         FROM usuario
         WHERE id = ?
         LIMIT 1"
    );

    $consulta->bind_param("i", $id);
    $consulta->execute();

    $usuario = $consulta->get_result()->fetch_assoc();

    echo json_encode([
        "ok" => true,
        "mensaje" => "Perfil actualizado correctamente",
        "usuario" => $usuario
    ]);

} catch (Exception $e) {

    echo json_encode([
        "ok" => false,
        "error" => $e->getMessage()
    ]);
}
