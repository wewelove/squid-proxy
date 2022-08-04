import { randomUUID } from 'node:crypto';
import start from './proxy';

/**
 * Connect the proxy to the main server
 */
export async function connect() {
  // Prepare the request payload
  const payload = {
    id: randomUUID(),
    username: process.env.MINECRAFT_USERNAME,
    proxy: await start(),
  };

  // Send the request
  const response = await fetch(process.env.API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }).then((res) => res.json());

  // Handle the response
  if (response.error) {
    console.error('[CONNECTION] An error occured while connecting to the proxy server:');
    console.error(response.error);
  }

  return response;
}

export function disconnect() {}
