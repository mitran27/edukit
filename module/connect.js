var mysql = require('mysql');
var config = {
    host: ,
    user: ,
    password: ,
    database: ,
    port: 3306


}
var connection;

function handledisconnect() {
    connection = mysql.createPool(config); // Recreate the connection, since
    // the old one cannot be reused.

    connection.getConnection(function(err) { // The server is either down
        if (err) { // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        } else {
            console.log('mysql connected.', Date())
        }

    });
    connection.on('error', function(err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') { // Connection to the MySQL server is usually
            handleDisconnect(); // lost due to either server restart, or a
        } else { // connnection idle timeout (the wait_timeout
            throw err;
        } // server variable configures this)
    });
}

//PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR
handledisconnect();





module.exports = connection;