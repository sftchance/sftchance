// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.18;

/**
 * @title MockDeployer
 * @notice This is just a basic contract that is meant to cause an ETH transfer to fail.
 */
contract MockDeployer {
    // Fallback function
    fallback() external payable {
        revert("NoEtherContract: No ETH accepted");
    }

    // Receive function (for newer Solidity versions)
    receive() external payable {
        revert("NoEtherContract: No ETH accepted");
    }
}
