require('dotenv').config()
const { SentinelClient } = require('defender-sentinel-client')

const BOT = process.env.BOT_ID

async function main() {
  require('dotenv').config()
  const client = new SentinelClient({
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
  })

  const notificationChannels = await client.listNotificationChannels();
  const { notificationId, type } = notificationChannels[0];

  const requestParams = {
    type: 'FORTA',
    name: 'Low balance alert',
    agentIDs: [BOT],
    fortaConditions: {
      alertIDs: undefined, // string[]
      minimumScannerCount: 1, 
      severity: 2, // (unknown=0, info=1, low=2, medium=3, high=4, critical=5)
    },
    autotaskTrigger: process.env.AUTOTASK_ID,
    alertThreshold: {
      amount: 2,
      windowSeconds: 3600,
    },
    alertTimeoutMs: 0,
    notificationChannels: [notificationChannels[0].notificationId],
  }

  const newSentinel = await client.create(requestParams)
  console.log(newSentinel)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})