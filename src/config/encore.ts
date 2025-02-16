import Client from '../lib/client';
// import { Environment, Local } from '../lib/client';

// Create a singleton instance of the Encore client
const client = new Client(
  "https://octopus-app-go4mu.ondigitalocean.app"
  // process.env.NODE_ENV === 'production'
  //   ? Environment('staging')
  //   : Local
);

export default client;
