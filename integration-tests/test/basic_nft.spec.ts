import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)
const expect = chai.expect
import chalk from 'chalk'

import { Contract, ContractFactory, BigNumber } from 'ethers'

import L2ERC721Json from '@boba/contracts/artifacts/contracts/ERC721Genesis.sol/ERC721Genesis.json'
import L2ERC721RegJson from '@boba/contracts/artifacts/contracts/ERC721Registry.sol/ERC721Registry.json'

import { OptimismEnv } from './shared/env'

describe('NFT Test\n', async () => {
  let env: OptimismEnv

  let ERC721: Contract
  let ERC721_D: Contract

  let ERC721Reg: Contract

  let a1a
  let a2a
  let a3a

  let Factory__ERC721: ContractFactory

  const nftName_D = 'TestNFT_D'
  const nftSymbol_D = 'TST_D'

  before(async () => {
    env = await OptimismEnv.new()

    a1a = env.l2Wallet.address
    a2a = env.l2Wallet_2.address
    a3a = env.l2Wallet_3.address

    ERC721 = new Contract(
      env.addressesBOBA.L2ERC721,
      L2ERC721Json.abi,
      env.l2Wallet
    )

    ERC721Reg = new Contract(
      env.addressesBOBA.L2ERC721Reg,
      L2ERC721RegJson.abi,
      env.l2Wallet
    )

    const balanceOwner = await ERC721.balanceOf(a1a)
    //console.log('Owner balance:', balanceOwner)

    const symbol = await ERC721.symbol()
    //console.log('NFT Symbol:', symbol)

    const name = await ERC721.name()
    //console.log('NFT Name:', name)

    const genesis = await ERC721.getGenesis()
    //console.log('NFT Genesis:', genesis)

    //console.log(` 🔒 ${chalk.red('ERC721 owner:')} ${chalk.green(a1a)}`)
  })

  it(`should have a name`, async () => {
    const tokenName = await ERC721.name()
    expect(tokenName).to.equal('TestNFT')
  })

  it('should generate a new ERC721 and transfer it from Bob (a1a) to Alice (a2a)', async () => {

    let meta = 'https://boredapeyachtclub.com/api/mutants/111'

    //console.log(`meta: ${meta}`)
    //console.log('Alice (a1a):', a2a)

    //mint one NFT
    let nft = await ERC721.mintNFT(a2a, meta)
    await nft.wait()

    const balanceBob = await ERC721.balanceOf(a1a)
    const balanceAlice = await ERC721.balanceOf(a2a)

    //console.log(`balanceOwner: ${balanceBob.toString()}`)
    //console.log(`balanceAlice: ${balanceAlice.toString()}`)

    //Get the URL
    const nftURL = await ERC721.tokenURI(BigNumber.from(String(0)))
    //console.log(`nftURL: ${nftURL}`)

    //Should be 1
    let TID = await ERC721.getLastTID()
    //console.log(`TID:${TID.toString()}`)

    //mint a second NFT for account3 aka recipient2
    meta = 'ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/6190'
    nft = await ERC721.mintNFT(a3a, meta)
    await nft.wait()

    //mint a third NFT, this time for account2 aka recipient
    meta = 'https://boredapeyachtclub.com/api/mutants/121'
    nft = await ERC721.mintNFT(a2a, meta)
    await nft.wait()

    //Should be 3
    TID = await ERC721.getLastTID()
    //console.log(`TID:${TID.toString()}`)

    expect(await ERC721.balanceOf(a1a)).to.deep.eq(BigNumber.from(String(0)))

    // Alice (a1a) should have two NFTs, and the tokenID of the first one should be zero, and the second one
    // should be 2
    expect(await ERC721.ownerOf(BigNumber.from(String(0)))).to.deep.eq(a2a)
    expect(await ERC721.ownerOf(BigNumber.from(String(1)))).to.deep.eq(a3a)
    expect(await ERC721.ownerOf(BigNumber.from(String(2)))).to.deep.eq(a2a)

    // Token 50 should not exist (at this point)
    expect(
      ERC721.ownerOf(BigNumber.from(String(50)))
    ).to.be.eventually.rejectedWith('ERC721: owner query for nonexistent token')
  })

  it('should derive an NFT Factory from a genesis NFT', async () => {

    //Alice (a2a) Account #2 wishes to create a derivative NFT factory from a genesis NFT
    const tokenID = await ERC721.tokenOfOwnerByIndex(a2a, 0)
    //determine the UUID
    const UUID =
      ERC721.address.substring(1, 6) +
      '_' +
      tokenID.toString() +
      '_' +
      a2a.substring(1, 6)

    //console.log(`Alice's UUID: ${UUID}`)

    Factory__ERC721 = new ContractFactory(
      L2ERC721Json.abi,
      L2ERC721Json.bytecode,
      env.l2Wallet
    )

    ERC721_D = await Factory__ERC721.deploy(
      nftName_D,
      nftSymbol_D,
      BigNumber.from(String(0)), //starting index for the tokenIDs
      ERC721.address,
      UUID,
      'BOBA_Rinkeby_28'
    )
    await ERC721_D.deployTransaction.wait()
    // console.log(
    //   ` 🌕 ${chalk.red('NFT ERC721_D deployed to:')} ${chalk.green(
    //     ERC721_D.address
    //   )}`
    // )
    // console.log(`Derived NFT deployed to: ${ERC721_D.address}`)

    const meta = 'http://blogs.bodleian.ox.ac.uk/wp-content/uploads/sites/163/2015/10/AdaByron-1850-1000x1200-e1444805848856.jpg'

    const nft = await ERC721_D.mintNFT(a3a, meta)
    await nft.wait()
  })

  it('should register the NFTs address in users wallet', async () => {

    await ERC721Reg.registerAddress(a2a, ERC721.address)
    //but, a3a should have two flavors of NFT...
    await ERC721Reg.registerAddress(a3a, ERC721.address)
    await ERC721Reg.registerAddress(a3a, ERC721_D.address)

    // const addresses_a2a = await ERC721Reg.lookupAddress(a2a)
    // const addresses_a3a = await ERC721Reg.lookupAddress(a3a)

    // console.log(`Addresses a2a: ${addresses_a2a}`)
    // console.log(`Addresses a3a: ${addresses_a3a}`)
  })
})
