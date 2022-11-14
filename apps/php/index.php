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
        sprintf(
            'mysql:host=%s:3306;dbname=%s',
            getenv('MYSQL_HOST') ?: 'none',
            getenv('MYSQL_DATABASE') ?: 'none'
        ),
        getenv('MYSQL_USER') ?: 'none',
        getenv('MYSQL_PASSWORD') ?: 'none',
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
        getenv('MONGO_USER') ?: 'none',
        getenv('MONGO_PASS') ?: 'none',
        getenv('MONGO_HOST') ?: 'none'
    )
);

try {
    $dbs = $mongoClient->listDatabases();

    $connectionStatus['mongo'] = true;
} catch(Exception $e){
    $connectionStatus['mongo'] = false;
}

/**
 * Check Redis connectivity
 */
$redis = new Predis\Client([
    'host'    => getenv('REDIS_HOST') ?: 'none',
    'port'    => 6379,
    'timeout' => 0.5
]);

try {
    $redis->ping();

    $connectionStatus['redis'] = true;
} catch (Exception $e) {
    $connectionStatus['redis'] = false;
}

header('Content-Type: application/json');

echo json_encode($connectionStatus);