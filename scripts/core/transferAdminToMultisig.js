// 0x9f50221ea9Cb120807121c930a2B8583Fc567e66


const { contractAt, sendTxn } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")
const { toUsd } = require("../../test/shared/units")

const MULTISIG = "0x9f50221ea9Cb120807121c930a2B8583Fc567e66"


const SHORTS_TRACKER = "0x76d870fe862a7951dF969E84B4c0C05E5FE028f8"
const VAULT_PRICE_FEED = "0x0eE402630B89A38325dcEAf3c0cF9cac933142D8"
const VAULT = "0x736Cad071Fdb5ce7B17F35bB22f68Ad53F55C207"

const READER = "0xF8c3435Aa7334eeD367C3Df75eE69a037a5783c8" 
const ORDERBOOK = "0xDd2c29cfeb1444dB6575CcEB64D9A6177769B98f" 
const USDG = "0xa60DC7bAb41c8BdB7F0ae762aEdCE13DE0909e73" 
const SLP = "0x6E1fbF9bb6f94567aC6Fe4bC0F262b7058e9785B"
const ROUTER = "0xd910dE6Ac0ED5a5085EF41bFCfDEaB3B3ba39c96"
const SLP_MANAGER = "0x7C393006729b18FD63346138f9E730CF812529a4"
const VAULT_ERROR_CONTROLLER = "0x10B72FCfCDd56316c1e77B031b76671B073045f6"
const VAULT_UTILS = "0xE90EaaD7E33eE4d772907273De33252C0E6663BA"
const SLP_MANAGER_ROUTER = "0xB88E6455Ff8Cd69E9C5A4e11bda0181df5C2e6d7"

async function main() {

    // const shortsTracker = await contractAt("ShortsTracker", SHORTS_TRACKER)
    // const vault = await contractAt("Vault", VAULT)
    // const vaultPriceFeed = await contractAt("VaultPriceFeed", VAULT_PRICE_FEED)

    // const timelock = await contractAt("Timelock", await vault.gov())
    // const vaultPriceFeedTimelock = await contractAt("PriceFeedTimelock", await vaultPriceFeed.gov())
    // const shortsTrackerTimelock = await contractAt("ShortsTrackerTimelock", await shortsTracker.gov())
    const reader = await contractAt("Reader", READER)
    const orderbook = await contractAt("OrderBook", ORDERBOOK)
    const usdg = await contractAt("USDG", USDG)
    const slp = await contractAt("SLP", SLP)
    const router = await contractAt("Router", ROUTER)
    const slpManager = await contractAt("SlpManager", SLP_MANAGER)
    const vaultErrorController = await contractAt("VaultErrorController", VAULT_ERROR_CONTROLLER)
    const vaultUtils = await contractAt("VaultUtils", VAULT_UTILS)
    const slpManagerRouter = await contractAt("SlpManagerRouter", SLP_MANAGER_ROUTER)

    // await sendTxn(vaultPriceFeedTimelock.setAdmin(MULTISIG), `vaultPriceFeedTimelock.setAdmin(${MULTISIG})`)
    // await sendTxn(vaultPriceFeedTimelock.setTokenManger(MULTISIG), `vaultPriceFeedTimelock.setTokenManger(${MULTISIG})`)

    // await sendTxn(shortsTrackerTimelock.signalSetAdmin(MULTISIG), `shortsTrackerTimelock.signalSetAdmin(${MULTISIG})`)
    // await sendTxn(shortsTrackerTimelock.setAdmin(MULTISIG), `shortsTrackerTimelock.setAdmin(${MULTISIG})`)

    // await sendTxn(timelock.setAdmin(MULTISIG), `timelock.setAdmin(${MULTISIG})`)
    // await sendTxn(timelock.setTokenManger(MULTISIG), `timelock.setTokenManger(${MULTISIG})`)

    await sendTxn(reader.setGov(MULTISIG), `reader.setGov(${MULTISIG})`)
    await sendTxn(orderbook.setGov(MULTISIG), `orderbook.setGov(${MULTISIG})`)
    await sendTxn(usdg.setGov(MULTISIG), `usdg.setGov(${MULTISIG})`)
    await sendTxn(slp.setGov(MULTISIG), `slp.setGov(${MULTISIG})`)
    await sendTxn(router.setGov(MULTISIG), `router.setGov(${MULTISIG})`)
    await sendTxn(slpManager.setGov(MULTISIG), `slpManager.setGov(${MULTISIG})`)
    await sendTxn(vaultErrorController.setGov(MULTISIG), `vaultErrorController.setGov(${MULTISIG})`)
    await sendTxn(vaultUtils.setGov(MULTISIG), `vaultUtils.setGov(${MULTISIG})`)
    await sendTxn(slpManagerRouter.setGov(MULTISIG), `slpManagerRouter.setGov(${MULTISIG})`)



}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
    // npx hardhat run scripts/core/transferAdminToMultisig.js --network core-mainnet