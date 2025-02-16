import Client from '../lib/client';
import { Environment, Local } from '../lib/client';

// Create a singleton instance of the Encore client
const client = new Client(
  import.meta.env.VITE_ENCORE_API_URL || (
    process.env.NODE_ENV === 'production'
      ? Environment('staging')
      : Local
  )
);

export default client;
