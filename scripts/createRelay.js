const { RelayClient } = require('defender-relay-client');
const { appendFileSync } = require('fs');

async function run() {
  require('dotenv').config();
  const { API_KEY: apiKey, API_SECRET: apiSecret } = process.env;
  const relayClient = new RelayClient({ apiKey, apiSecret });

  // create relay using defender client
  const requestParams = {
    name: 'LINK Low Balance Relayer',
    network: 'matic',
    minBalance: BigInt(1e17).toString(),
  };
  const relayer = await relayClient.create(requestParams);
  
  // store relayer info in file (optional)
  console.log("Relayer created with ID ", relayer.relayerId)
  appendFileSync('.env', `\nRELAYER_ID="${relayer.relayerId}"`)
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});