/* Imports: External */
import { DeployFunction } from 'hardhat-deploy/dist/types'
import { Contract, ContractFactory } from 'ethers'
import { getContractFactory } from '@eth-optimism/contracts'
import { registerHabtorAddress } from './000-Messenger.deploy'

import DiscretionaryExitBurnJson from '../artifacts/contracts/DiscretionaryExitBurn.sol/DiscretionaryExitBurn.json'
let Factory__ExitBurn: ContractFactory
let ExitBurn: Contract

const deployFn: DeployFunction = async (hre) => {
  const addressManager = getContractFactory('Lib_AddressManager')
    .connect((hre as any).deployConfig.deployer_l1)
    .attach(process.env.ADDRESS_MANAGER_ADDRESS) as any

  Factory__ExitBurn = new ContractFactory(
    DiscretionaryExitBurnJson.abi,
    DiscretionaryExitBurnJson.bytecode,
    (hre as any).deployConfig.deployer_l2
  )
  ExitBurn = await Factory__ExitBurn.deploy((hre as any).deployConfig.L2StandardBridgeAddress)
  await ExitBurn.deployTransaction.wait()

  await hre.deployments.save('DiscretionaryExitBurn', {
    abi: DiscretionaryExitBurnJson.abi,
    address: ExitBurn.address,
    })
  await registerHabtorAddress(
    addressManager,
    'DiscretionaryExitBurn',
    ExitBurn.address
    )

  console.log(`DiscretionaryExitBurn is deployed at ${ExitBurn.address}`)

}

deployFn.tags = ['DiscretionaryExitBurn']

export default deployFn
