

const { contractAt,  } = require("../shared/helpers")

const MULTISIG = "0x9f50221ea9Cb120807121c930a2B8583Fc567e66"


const VAULT = "0x736Cad071Fdb5ce7B17F35bB22f68Ad53F55C207"
async function generateSetAdminData() {
    const vault = await contractAt("Vault", VAULT)
    const timelock = await contractAt("Timelock", await vault.gov())
    
    const interface = new ethers.utils.Interface([
      "function setAdmin(address _admin)"
    ])
   
    const data = interface.encodeFunctionData("setAdmin", [MULTISIG])
   
    const tx = {
      to: timelock.address,
      data: data,
      value: 0
    }
   
    console.log("Transaction data:")
    console.log(tx)
   }
   
   generateSetAdminData()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error)
      process.exit(1)
    })

    // npx hardhat run scripts/core/generateSetAdminData.js --network core-mainnet