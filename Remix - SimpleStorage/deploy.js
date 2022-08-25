require("dotenv").config();

const ethers = require("ethers");
const fs = require("fs-extra");

async function main() {
  // Connect to Ganache RPC i.e. a blockchain
  const provider = new ethers.providers.JsonRpcBatchProvider(
    "http://127.0.0.1:7545"
  );

  // Connecting and providing main wallet to deploy contracts to Blockchain
  //   const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const encryptedJson = fs.readFileSync("./.encryptedKey.json");
  let wallet = new ethers.Wallet.fromEncryptedJsonSync(
    encryptedJson,
    process.env.PRIVATE_KEY_PASSWORD
  );

  //   Get abi and binary to interact with contract
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "UTF8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "UTF8"
  );

  // Contract Factory in ethers helps to load contracts in them
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);

  //   Now all the loaded contracts in contract factory will be deployed
  console.log("Deploying please wait...");
  const contract = await contractFactory.deploy();
  console.log("Here is your contract", contract);
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
