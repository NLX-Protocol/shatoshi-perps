const { ethers, upgrades, network } = require("hardhat");
const { writeTmpAddresses, sendTxn, verifyUpgradeable, deployContract, contractAt } = require("../shared/helpers");
const { expandDecimals } = require("../../test/shared/utilities");
const tokens = require('../core/tokens')[network.name];

const VAULT = "0x736Cad071Fdb5ce7B17F35bB22f68Ad53F55C207" //BTC
const VAULT_PRICE_FEED = "0x0eE402630B89A38325dcEAf3c0cF9cac933142D8"
//pyth contract address
// const PRICE_FEED_CONTRACT_ADDRESS = "0x8D254a21b3C86D32F7179855531CE99164721933" //testnet
const PRICE_FEED_CONTRACT_ADDRESS = "0xA2aa501b19aff244D90cc15a4Cf739D2725B5729" //mainnet

async function main() {

  const {
    BTC, CORE, ETH, SOL, BNB, DOGE, TRX, SUI, AVAX, XRP, SHIB, BONK, FLOKI, ENA, LINK, POPCAT, SolvBTC, PumpBTC, nativeToken
  } = tokens
  const tokenArr = [BTC, CORE, ETH, SOL, BNB, DOGE, TRX, SUI, AVAX, XRP, SHIB, BONK, FLOKI, ENA, LINK, POPCAT, SolvBTC, PumpBTC, nativeToken]
  // const pythMaxStalePeriod = 60 * 60 * 24 // 24 hours
  const pythMaxStalePeriod = 60 * 60 // 1 hour

  const vaultPriceFeed = await contractAt("VaultPriceFeed", VAULT_PRICE_FEED)
  const vault = await contractAt("Vault", VAULT)




  const signers = await ethers.getSigners()
  const wallet = signers[0]
  const userAddress = wallet.address;
  console.log("userAddress: ", userAddress);




  const boundValidator = await deployContract("BoundValidator", []);

  console.log("BoundValidator deployed to: " + boundValidator.address);


  const validateConfigs = []
  const pythTokenConfigs = []
  const resilientOracleConfigs = []

  // BTC
  for (const token of tokenArr) {
    validateConfigs.push({
      asset: token.address,
      upperBoundRatio: ethers.utils.parseUnits("1.05", 18), // Upper bound - reported price can be up to 5% higher
      lowerBoundRatio: ethers.utils.parseUnits("0.95", 18), // Lower bound - reported price can be up to 5% lower
    })
    pythTokenConfigs.push({
      pythId: token.priceFeed.pyth,
      asset: token.address,
      maxStalePeriod: pythMaxStalePeriod
    })
  }


  // deploy pyth oracle
  const pythOracle = await deployContract("PythOracle", [PRICE_FEED_CONTRACT_ADDRESS]);

  console.log("pythOracle deployed to: " + pythOracle.address);

  // deploy ResilientOracle 
  const resilientOracle = await deployContract("ResilientOracle", [boundValidator.address]);

  console.log("resilientOracle deployed to: " + resilientOracle.address);

  // resilientOracle
  for (const token of tokenArr) {
    resilientOracleConfigs.push({
      asset: token.address,
      oracles: [pythOracle.address, ethers.constants.AddressZero, ethers.constants.AddressZero,],
      enableFlagsForOracles: [true, false, false]
    })
  }
  //  setConfigs
  await sendTxn(boundValidator.setValidateConfigs(validateConfigs), "boundValidator.setValidateConfig")
  await sendTxn(pythOracle.setTokenConfigs(pythTokenConfigs), "pythOracle.setTokenConfigs")
  await sendTxn(resilientOracle.setTokenConfigs(resilientOracleConfigs), "resilientOracle.setTokenConfigs")




  
  // await sendTxn(vaultPriceFeed.setMaxStrictPriceDeviation(expandDecimals(5, 28)), "vaultPriceFeed.setMaxStrictPriceDeviation") // 0.01 USD
    // await sendTxn(vaultPriceFeed.setResilientOracle(resilientOracle.address), "vaultPriceFeed.setResilientOracle")
    // await sendTxn(vault.setPriceFeed(vaultPriceFeed.address), "vault.setPriceFeed")
  // writeTmpAddresses({
  //   boundValidator: boundValidator.address,
  //   pythOracle: pythOracle.address,
  //   resilientOracle: resilientOracle.address,
  // })

  console.log({
    boundValidator: boundValidator.address,
    pythOracle: pythOracle.address,
    resilientOracle: resilientOracle.address,
  })

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })


// npx hardhat run scripts/oracle/deployResilientOracle.js --network core-testnet