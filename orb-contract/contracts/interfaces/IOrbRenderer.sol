// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.18;

interface IOrbRenderer {
    /**
     * @notice Returns the SVG representation of an Orb.
     * @param $id The token ID of the Orb.
     * @return svg The SVG representation of the Orb.
     */
    function svg(uint256 $id) external view returns (string memory);

    /**
     * @notice Returns the URI of an Orb.
     * @param $id The token ID of the Orb.
     * @return The URI of the Orb.
     */
    function uri(uint256 $id) external view returns (string memory);

    /**
     * @notice Returns the IPFS URI of an Orb.
     * @param $id The token ID of the Orb.
     * @return The IPFS URI of the Orb.
     */
    function uriIPFS(uint256 $id) external view returns (string memory);
}
