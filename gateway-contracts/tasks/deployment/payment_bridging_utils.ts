import { Wallet } from "ethers";
import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { loadEnvVarsFromFile, pascalCaseToAddressEnvVar } from "../utils";
import { getRequiredEnvVar } from "../utils/loadVariables";
import {
  appendAddressToEnvFile,
  appendAddressToSolidityFile,
  createEnvAddressesFile,
  createSolidityAddressesFile,
} from "./utils";

// Define the file names for registering the payment bridging contract addresses
const PAYMENT_BRIDGING_ADDRESSES_SOLIDITY_FILE_NAME = "PaymentBridgingAddresses.sol";
const MOCKED_PAYMENT_BRIDGING_ADDRESSES_ENV_FILE_NAME = ".env.mocked_payment_bridging";

async function deployMockedPaymentBridgingContract(
  name: string,
  hre: HardhatRuntimeEnvironment,
  initializeArgs?: unknown[],
): Promise<string> {
  // Compile the mocked payment bridging contract
  await hre.run("compile:specific", { contract: `contracts/mockedPaymentBridging/${name}` });

  // Get a deployer wallet
  const deployerPrivateKey = getRequiredEnvVar("DEPLOYER_PRIVATE_KEY");
  const deployer = new Wallet(deployerPrivateKey).connect(hre.ethers.provider);

  console.log(`Deploying ${name}...`);
  const contractFactory = await hre.ethers.getContractFactory(name, deployer);

  // If initializeArgs is a non-empty array, unpack the arguments, else directly call deploy
  const contract =
    Array.isArray(initializeArgs) && initializeArgs.length > 0
      ? await contractFactory.deploy(...initializeArgs)
      : await contractFactory.deploy();

  const contractAddress = await contract.getAddress();

  // Register the contract address in the env and solidity files
  appendAddressToEnvFile(name, contractAddress, MOCKED_PAYMENT_BRIDGING_ADDRESSES_ENV_FILE_NAME);
  appendAddressToSolidityFile(name, contractAddress, PAYMENT_BRIDGING_ADDRESSES_SOLIDITY_FILE_NAME);

  console.log(`${name} deployed successfully at address: ${contractAddress}\n`);

  return contractAddress;
}

// Deploy the mocked payment bridging contracts
task("task:deployMockedPaymentBridgingContracts").setAction(async function (_, hre) {
  // Empty the env and solidity files
  // The solidity file needs to be created here because the FeesSenderToBurner contract depends on
  // the ZamaOFT contract.
  // It will be re-created nonetheless when deploying all contracts later
  createEnvAddressesFile(MOCKED_PAYMENT_BRIDGING_ADDRESSES_ENV_FILE_NAME);
  createSolidityAddressesFile(PAYMENT_BRIDGING_ADDRESSES_SOLIDITY_FILE_NAME);

  // Deploy the mocked payment bridging contracts
  await deployMockedPaymentBridgingContract("ZamaOFT", hre, ["ZamaOFT", "ZAMA", BigInt(10 ** 24)]);
  await deployMockedPaymentBridgingContract("FeesSenderToBurner", hre, []);

  // Add the new addresses to env, as they will be already be deployed in real environment
  loadEnvVarsFromFile(MOCKED_PAYMENT_BRIDGING_ADDRESSES_ENV_FILE_NAME);
});

function setPaymentBridgingContractAddress(name: string) {
  const address = getRequiredEnvVar(pascalCaseToAddressEnvVar(name));

  console.log(`Setting ${name} address`);
  appendAddressToSolidityFile(name, address, PAYMENT_BRIDGING_ADDRESSES_SOLIDITY_FILE_NAME);

  console.log(`${name} address ${address} written successfully!\n`);
}

// Set the payment bridging contract addresses in the solidity file
export function setPaymentBridgingContractAddresses() {
  // Initialize the solidity file for payment bridging addresses
  createSolidityAddressesFile(PAYMENT_BRIDGING_ADDRESSES_SOLIDITY_FILE_NAME);

  // Set the payment bridging contract addresses in the solidity file
  setPaymentBridgingContractAddress("ZamaOFT");
  setPaymentBridgingContractAddress("FeesSenderToBurner");

  console.log("Payment bridging contract addresses set successfully!\n");
}
