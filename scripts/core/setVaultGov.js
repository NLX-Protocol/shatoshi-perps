const { contractAt, sendTxn } = require("../shared/helpers")

const MULTISIG = "0x9f50221ea9Cb120807121c930a2B8583Fc567e66"

async function main() {

  const vault = await contractAt("Vault", "0x736Cad071Fdb5ce7B17F35bB22f68Ad53F55C207")
  const positionRouter = await contractAt("PositionRouter", "0x6EdF4C4b15A53682E0461517C7c4C45405e4e9b3",undefined,{
    libraries: {
      PositionUtils:"0x859d66aD5C0dE79c1375326B9df6fC56A7145332",
    }
  })
  const referralStorage = await contractAt("ReferralStorage", "0x952c5Cb3355695Ed1DEDD72aD074c960C2D8ce03")
  const alreadyDeployedVaultTimelock = await contractAt("Timelock", "0x1c50FE94FAEB9443bc40eB02aFf4Df9f83C84F92")

  const governedProxyAdmin = await contractAt("GovernedProxyAdmin", "0x967D8782D7B6342bd7D7b677f9Ee3Ad68cFB4d00")
  
  const resilientOracle = await contractAt("ResilientOracle", "0x3e9b6c48A388e5d580e6D65bB2896D60b606CDaD")
  const boundValidator = await contractAt("BoundValidator", "0x47794688e555F03F64cd0b4A65fFcec7C7387cA2")
  const pythOracle = await contractAt("PythOracle", "0xAd1d1355be077B06D82fEA75eF3b9941EdE96958")
  
  await sendTxn(governedProxyAdmin.setGov(alreadyDeployedVaultTimelock.address), "governedProxyAdmin.setGov")
  
  await sendTxn(alreadyDeployedVaultTimelock.setContractHandler(positionRouter.address, true), "positionRouter.setContractHandler")
  
  await sendTxn(positionRouter.setGov(alreadyDeployedVaultTimelock.address), "positionRouter.setGov")
  
  await sendTxn(referralStorage.setGov(alreadyDeployedVaultTimelock.address), "referralStorage.setGov")
  await sendTxn(vault.setGov(alreadyDeployedVaultTimelock.address), "vault.setGov")
  
  await sendTxn(resilientOracle.setGov(MULTISIG), "resilientOracle.setGov")
  await sendTxn(boundValidator.setGov(MULTISIG), "boundValidator.setGov")
  await sendTxn(pythOracle.setGov(MULTISIG), "pythOracle.setGov")

}


main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })

  // npx hardhat run scripts/core/setVaultGov.js --network core-testnet 