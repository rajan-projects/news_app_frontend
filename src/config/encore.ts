import Client, { Environment, Local } from '../lib/client';

// Create a singleton instance of the Encore client
const client = new Client(
  process.env.NODE_ENV === 'production'
    ? Environment('staging')
    : Local
);

export default client;
