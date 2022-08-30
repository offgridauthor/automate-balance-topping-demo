const { AutotaskClient } = require('defender-autotask-client')
const { appendFileSync } = require('fs')

async function main() {
  require('dotenv').config()
  const credentials = {
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
  }
  const autotaskClient = new AutotaskClient(credentials)

  const params = {
    name: 'LINK low balance transfer',
    encodedZippedCode: await autotaskClient.getEncodedZippedCodeFromFolder(
      './autotasks'
    ),
    trigger: {
      type: 'webhook',
    },
    paused: false,
    relayerId: process.env.RELAYER_ID,
  }

  const createdAutotask = await autotaskClient.create(params)
  console.log('Created Autotask with ID: ', createdAutotask.autotaskId)

  appendFileSync('.env', `\nAUTOTASK_ID="${createdAutotask.autotaskId}"`)
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}