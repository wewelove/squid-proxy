import ngrok from 'ngrok';
import ora from 'ora';

/**
 * Switch the protocol used in the URL (from TCP to HTTP)
 * @param {string} url The URL to switch
 * @returns {string} The URL with the protocol switched
 */
function switchProtocol(url) {
  return url?.replace('tcp://', 'http://');
}

/**
 * Connect to a ngrok tunnel.
 * If a tunnel is already running, it will return the public url of the tunnel.
 * If not, it will create a new tunnel.
 * @param {{
 *  port: number,
 *  protocol: 'http' | 'tcp',
 *  service: string
 * }} options The options to use for the tunnel
 * @returns {() => Promise<string>} An async function that returns the public url of the tunnel
 */
export default ({ port, protocol }) => async () => {
  // Check if a tunnel is already running
  const response = await ngrok.getApi()?.listTunnels();
  const tunnel = response?.tunnels?.find((value) => value.proto === protocol);
  if (tunnel) return switchProtocol(tunnel.public_url);
  // Inform the user that a tunnel is being created
  const spinner = ora(`Creating ${protocol.toUpperCase()} tunnel using ngrok`).start();
  try {
  // Create a tunnel to the proxy server
    const url = switchProtocol(
      await ngrok.connect({
        addr: port,
        proto: protocol,
      }),
    );
    // Inform the user that the tunnel has been created
    spinner.succeed(`${protocol.toUpperCase()} tunnel ready at ${url}`);
    return url;
  } catch (error) {
    spinner.fail('An error occured while creating the ngrok tunnel');
    console.error(error);
  }
};
