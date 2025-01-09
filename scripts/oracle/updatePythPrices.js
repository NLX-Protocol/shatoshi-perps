const { contractAt } = require('../shared/helpers');

const tokens = require('../core/tokens')[network.name];

const PYTH_ORACLE_ADAPTER = "0xAd1d1355be077B06D82fEA75eF3b9941EdE96958"

async function main() {

    const {
        BTC, CORE, ETH, SOL, BNB, DOGE, TRX, SUI, AVAX, XRP, SHIB, BONK, FLOKI, ENA, LINK, POPCAT, SolvBTC, PumpBTC, nativeToken
    } = tokens
    const tokenArr = [
        BTC,
        CORE, ETH, SOL,
        BNB, DOGE, TRX,
        SUI, AVAX, XRP,
        SHIB, BONK,
        FLOKI, ENA,
        LINK, POPCAT,
        SolvBTC, PumpBTC, nativeToken
    ]

    const pythOracleAdapter = await contractAt("PythOracle", PYTH_ORACLE_ADAPTER)

    try {
        console.time("token pyth prices updated");


        const priceFeedIds = await pythOracleAdapter.getPriceFeedIds(tokenArr.map(token => token.address))

        let priceFeedQuery = priceFeedIds.reduce((priceFeedIdsConcat, priceDeedId) => {
            return priceFeedIdsConcat + `&ids[]=${priceDeedId}`;
        }, "").replace("&", "?").concat("&encoding=hex&parsed=true&ignore_invalid_price_ids=true");

        // const response = await fetch(`${EnvKeys.hermes}/api/latest_price_feeds${priceFeedQuery}`) .then(res => res.json())
        const response = await fetch(`https://hermes.pyth.network/v2/updates/price/latest${priceFeedQuery}`).then(res => res.json())

        const pythUpdateData = response.binary.data.map(data => `0x${data}`)


        const updateFee = BigInt(tokenArr.length)

        const updatePythPricesStaticRes = await pythOracleAdapter.callStatic.updatePythPrices(tokenArr.map(token => token.address), pythUpdateData, {
            value: updateFee,
        })

        console.log({ updatePythPricesStaticRes });

        await pythOracleAdapter.updatePythPrices(tokenArr.map(token => token.address), pythUpdateData, {
            value: updateFee * BigInt(2),
        })


        console.timeEnd("token pyth prices updated");
    } catch (error) {
        console.log(error);

    }

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })


    //  npx hardhat run scripts/oracle/updatePythPrices.js --network core-testnet 