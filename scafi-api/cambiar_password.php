<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'conexion.php';

$data = json_decode(file_get_contents("php://input"), true);

if(!$data){

    echo json_encode([
        "ok" => false
    ]);

    exit;
}

$correo = $data['correo'];
$password = $data['password'];

$sql = "UPDATE usuario 
        SET contrasena='$password'
        WHERE correo='$correo'";

if(mysqli_query($conn, $sql)){

    echo json_encode([
        "ok" => true
    ]);

}else{

    echo json_encode([
        "ok" => false
    ]);

}
?>