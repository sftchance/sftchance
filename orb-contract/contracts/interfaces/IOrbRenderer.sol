// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.18;

interface IOrbRenderer {
    /**
     * @notice Returns the SVG representation of an Orb.
     * @param $id The token ID of the Orb.
     */
    function uri(uint256 $id) external view returns (string memory);
}
