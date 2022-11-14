<?php

$connectionStatus = [
    'mysql'    => null,
    'mongo'    => null,
    'redis'    => null,
    'rabbitmq' => null,
];

try {
    $dbh = new PDO(
        sprintf('mysql:host=%s:3306;dbname=%s', getenv('MYSQL_HOST'), getenv('MYSQL_DATABASE')),
        getenv('MYSQL_USER'),
        getenv('MYSQL_PASSWORD'),
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    $connectionStatus['mysql'] = true;
} catch (PDOException $e) {
    $connectionStatus['mysql'] = false;
}

header('Content-Type: application/json');

echo json_encode($connectionStatus);