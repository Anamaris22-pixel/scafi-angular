<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

include 'conexion.php';

require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$data = json_decode(
    file_get_contents("php://input"),
    true
);

if (!$data) {

    echo json_encode([
        "ok" => false,
        "mensaje" => "No llegaron datos"
    ]);

    exit;
}

$correo = $data['correo'];

$sql = "
SELECT * FROM usuario
WHERE correo='$correo'
";

$resultado = mysqli_query($conexion, $sql);

if (mysqli_num_rows($resultado) == 0) {

    echo json_encode([
        "ok" => false,
        "mensaje" => "Correo no encontrado"
    ]);

    exit;
}

$token = bin2hex(
    random_bytes(32)
);

$expira = date(
    'Y-m-d H:i:s',
    strtotime('+1 hour')
);

$update = "
UPDATE usuario
SET
token_recuperacion='$token',
token_expira='$expira'
WHERE correo='$correo'
";

mysqli_query($conexion, $update);

$link = "
http://localhost:4200/recuperar-password?token=$token
";

$mail = new PHPMailer(true);

try {

    $mail->isSMTP();

    $mail->Host = 'smtp.gmail.com';

    $mail->SMTPAuth = true;

    $mail->Username =
        'ceciliavargas8812@gmail.com';

    $mail->Password =
        'rrgu bnyo hlrd dvhl';

    $mail->SMTPSecure = 'tls';

    $mail->Port = 587;

    $mail->setFrom(
        'ceciliavargas8812@gmail.com',
        'SCAFI RECUPERAR'
    );

    $mail->addAddress($correo);

    $mail->isHTML(true);

    $mail->Subject =
        'Recuperar contraseña';

    $mail->Body = "
        <h2>Recuperar contraseña</h2>

        <p>
            Haz click en el siguiente enlace:
        </p>

        <a href='$link'>
            Recuperar contraseña
        </a>
    ";

    $mail->send();

    echo json_encode([
        "ok" => true,
        "mensaje" => "Correo enviado"
    ]);

} catch (Exception $e) {

    echo json_encode([
        "ok" => false,
        "mensaje" => $mail->ErrorInfo
    ]);
}
?>