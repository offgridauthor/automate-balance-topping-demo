import BigNumber from 'bignumber.js'
import { 
  BlockEvent, 
  Finding, 
  HandleBlock, 
  FindingSeverity, 
  FindingType,
  getEthersProvider,
  ethers
} from 'forta-agent'

export const ABI = `[ { "constant": true, "inputs": [ { "name": "_owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "balance", "type": "uint256" } ], "payable": false, "type": "function" } ]`
export const ACCOUNT = "0x3C89Fa18f6Cb70585b5831970E6B0C067Ae46598" 
export const MIN_BALANCE = "100000000000000000" // 0.1 LINK
export const LINK = "0xb0897686c545045afc77cf20ec7a532e3120e0f1" //  LINK address on polygon

const ethersProvider = getEthersProvider()

function provideHandleBlock(ethersProvider: ethers.providers.JsonRpcProvider): HandleBlock {
  return async function handleBlock(blockEvent: BlockEvent) {
    // report finding if specified account balance falls below threshold
    const findings: Finding[] = []

    const erc20Contract = new ethers.Contract(LINK, ABI, ethersProvider)
    const accountBalance = new BigNumber((await erc20Contract.balanceOf(ACCOUNT, {blockTag:blockEvent.blockNumber})).toString())

    if (accountBalance.isGreaterThanOrEqualTo(MIN_BALANCE)) return findings

    findings.push(
      Finding.fromObject({
        name: "Minimum Account Balance",
        description: `Account balance (${accountBalance.toString()}) below threshold (${MIN_BALANCE})`,
        alertId: "FORTA-6",
        severity: FindingSeverity.Info,
        type: FindingType.Suspicious,
        metadata: {
          balance: accountBalance.toString()
        }
      }
    ))

    return findings
  }
}


export default {
  provideHandleBlock,
  handleBlock: provideHandleBlock(ethersProvider)
}