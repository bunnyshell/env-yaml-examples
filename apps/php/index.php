<?php

require_once __DIR__ . '/vendor/autoload.php';


$connectionStatus = [
    'mysql'    => null,
    'mongo'    => null,
    'redis'    => null,
    'rabbitmq' => null,
];

/**
 * Check MySQL connectivity
 */
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

/**
 * Check MongoDB connectivity
 */
$mongoClient = new MongoDB\Client(
    sprintf(
        'mongodb://%s:%s@%s:27017',
        getenv('MONGO_USER'),
        getenv('MONGO_PASS'),
        getenv('MONGO_HOST')
    )
);

try {
    $dbs = $mongoClient->listDatabases();

    $connectionStatus['mongo'] = true;
}
catch(Exception $e){
    $connectionStatus['mongo'] = false;
}

header('Content-Type: application/json');

echo json_encode($connectionStatus);