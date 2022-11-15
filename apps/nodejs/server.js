const http = require('http');
const process = require('process');
const mysql = require('mysql2');
const {MongoClient} = require('mongodb');
const redis = require('redis');

const requestListener = async function (req, res) {
    const statuses = await getConnectivityStatuses();

    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(JSON.stringify(statuses));
}

const server = http.createServer(requestListener);
server.listen(8080);

/**
 * Gets the statuses for each of the checked connections
 *
 * @returns {Promise<{mongo: null, mysql: null, rabbitmq: null, redis: null}>}
 */
const getConnectivityStatuses = async function() {
    var connectionStatus = {
        mysql:    null,
        mongo:    null,
        redis:    null,
        rabbitmq: null
    }

    await checkMySQL()
        .then((mysqlClient) => { connectionStatus.mysql = true })
        .catch((err) => { console.log(err); connectionStatus.mysql = false });

    await checkMongo()
        .then((mongoClient) => { connectionStatus.mongo = true })
        .catch((err) => { console.log(err); connectionStatus.mongo = false; });

    await checkRedis()
        .then((redisClient) => { connectionStatus.redis = true })
        .catch((err) => { console.log(err); connectionStatus.redis = false; });

    console.log('Checked statuses', JSON.stringify(connectionStatus));

    return connectionStatus;
}

/**
 * Checks MySQL
 *
 * @returns {Promise<unknown>}
 */
const checkMySQL = function () {
    return new Promise((resolve, reject) => {
        const mysqlClient = mysql.createConnection( {
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER ,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE
        });

        mysqlClient.connect((err) => {
            if (err) {
                reject(err);
            }

            resolve(mysqlClient);
        });
    });
}

/**
 * Checks Mongo
 *
 * @returns {Promise<unknown>}
 */
const checkMongo = function () {
    const MONGO_URL = 'mongodb://' + process.env.MONGO_USER + ':' + process.env.MONGO_PASS + '@' + process.env.MONGO_HOST + ':27017/admin';
    const mongoClient = new MongoClient(MONGO_URL, {serverSelectionTimeoutMS: 500});

    return mongoClient.connect();
}

/**
 * Checks Redis
 *
 * @returns {Promise<unknown>}
 */
const checkRedis = function () {
    const redisClient = redis.createClient({
        url: 'redis://' + process.env.REDIS_HOST + ':6379'
    });

    return redisClient.connect()
}