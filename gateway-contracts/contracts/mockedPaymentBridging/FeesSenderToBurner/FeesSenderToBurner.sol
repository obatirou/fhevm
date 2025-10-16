// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.20;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import { zamaOFTAddress } from "../../../addresses/PaymentBridgingAddresses.sol";

contract FeesSenderToBurner {
    /**
     * @notice The interface of the $ZAMA token contract as an ERC20.
     */
    IERC20 private constant ZAMA_OFT = IERC20(zamaOFTAddress);

    constructor() {}

    // Transfer the fees to the itself
    function sendFeesToBurner(uint256 amount) external {
        ZAMA_OFT.transferFrom(msg.sender, address(this), amount);
    }
}
