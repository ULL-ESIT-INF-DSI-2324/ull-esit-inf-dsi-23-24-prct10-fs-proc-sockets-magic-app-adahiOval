import net from 'net';
import chalk from 'chalk';
import { EventEmitterServer } from './classes/EventEmitterServer.js';

net.createServer((connection) => {
  console.log(chalk.green('A client has connected.'));
  const server = new EventEmitterServer(connection);

  server.on('message', (message) => {
    console.log(message);
    connection.write(JSON.stringify({'success': true, 'message': 'Hello Client'}));
    connection.end();
  });

  connection.on('close', () => {
    console.log(chalk.red('Un cliente se ha desconectado.'));
  });

}).listen(60300, () => {
  console.log(chalk.blue('Waiting for clients to connect...'));
});