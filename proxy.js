import ora from 'ora';
import { Server } from 'proxy-chain';
import connect from './ngrok.js';

// Create a proxy server
const server = new Server({ port: process.env.PROXY_PORT });

// Listen for incoming requests and proxy them
server.listen((err) => {
  // Inform the user that the proxy server is running
  const spinner = ora('Starting Squid proxy server').start();
  if (err) {
    spinner.fail('An error occured while starting the proxy server');
    console.error(err);
  } else {
    spinner.succeed(`Proxy ready at ${server.server.address().address}:${server.server.address().port}`);
  }
});

/**
 * Connect to a ngrok tunnel and return the public url
 * @returns {Promise<string>} The public proxy url
 */
const start = connect({ port: process.env.PROXY_PORT, protocol: 'tcp' });
export default start;
