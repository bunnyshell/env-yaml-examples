const http = require('http');
const process = require('process');
const mysql = require('mysql2');

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
        .catch((err) => { connectionStatus.mysql = false });

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