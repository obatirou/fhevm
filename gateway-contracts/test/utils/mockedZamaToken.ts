import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { Wallet } from "ethers";
import { ethers } from "hardhat";

import { getRequiredEnvVar } from "../../tasks/utils/loadVariables";

/**
 * Funds the signer with mocked $ZAMA tokens using the owner's balance
 * @param owner The owner who initially owns the tokens and will transfer them
 * @param signer The signer who will receive the tokens
 * @param amount The amount of tokens to transfer, using 18 decimals. Defaults to 10^22 (10 000 mocked $ZAMA tokens)
 */
export async function fundSignerWithMockedZamaToken(
  owner: Wallet,
  signer: HardhatEthersSigner,
  amount: bigint = BigInt(10 ** 22),
  verbose: boolean = false,
) {
  // Get the ZamaOFT contract
  const zamaOFT = await ethers.getContractAt("ZamaOFT", getRequiredEnvVar("ZAMA_OFT_ADDRESS"), owner);

  // Transfer the tokens to the signer
  const tx = await zamaOFT.connect(owner).transfer(signer.address, amount);
  const receipt = await tx.wait();

  if (receipt?.status !== 1) {
    throw new Error(`Transfer failed from owner address ${owner.address} to signer address ${signer.address}`);
  }

  if (verbose) {
    // Convert the amount to mocked $ZAMA tokens using 18 decimals
    const amountInMockedZamaTokens = amount / BigInt(10 ** 18);
    console.log(
      `Funding successful: ${amountInMockedZamaTokens} mocked $ZAMA tokens transferred from owner ${owner.address} to signer ${signer.address}\n`,
    );
  }
}

/**
 * Approves the specified contract with maximum allowance over the signer's tokens
 * @param signer The signer who owns the tokens and will give the approval
 * @param contractAddressToApprove The address of the contract to be approved
 */
export async function approveContractWithMaxAllowance(
  signer: HardhatEthersSigner,
  contractAddressToApprove: string,
  verbose: boolean = false,
) {
  // Get the ZamaOFT contract
  const zamaOFT = await ethers.getContractAt("ZamaOFT", getRequiredEnvVar("ZAMA_OFT_ADDRESS"));

  // Approve the spender with the maximum uint256 value
  const tx = await zamaOFT.connect(signer).approve(contractAddressToApprove, ethers.MaxUint256);
  const receipt = await tx.wait();

  if (receipt?.status !== 1) {
    throw new Error(`Max allowance approval failed for contract ${contractAddressToApprove}`);
  }

  if (verbose) {
    console.log(
      `Max allowance approval successful: contract ${contractAddressToApprove} approved by signer ${signer.address}\n`,
    );
  }
}
