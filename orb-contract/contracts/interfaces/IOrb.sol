// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.18;

interface IOrb {
    /// @dev The provenance metadata of an Orb.
    struct Provenance {
        uint32 maxSupply;
        uint32 totalSupply;
        uint32 price;
        uint160 id;
        address payable vault;
    }

    /// @dev Enables the tracking of inspired Orbs.
    event Fork(
        address indexed $by,
        uint256 indexed $id,
        uint256 indexed $forkId
    );

    /**
     * @notice Loads the provenance data for an Orb (can be creation and updating).
     * @param $colors The colors of the Orb.
     * @param $provenance The provenance data of the Orb.
     */
    function load(
        bytes memory $colors,
        Provenance memory $provenance
    ) external payable returns (uint160);

    /**
     * @notice Enables the forking of an existing Orb.
     * @param $forkedColors The colors of the Orb to fork.
     * @param $colors The colors of the new Orb.
     * @param $provenance The provenance data to set.
     */
    function fork(
        bytes memory $forkedColors,
        bytes memory $colors,
        Provenance memory $provenance
    ) external payable returns (uint160);

    /**
     * @notice Forfeits the provenance of an Orb.
     * @param $id The token ID to forfeit.
     */
    function forfeit(uint256 $id) external;

    /**
     * @notice Mints the ERC-1155 Orb.
     * @param $to The address to mint the tokens to.
     * @param $id The token ID to mint.
     * @param $amount The amount of tokens to mint.
     * @param $data Additional data with no specified format.
     */
    function mint(
        address $to,
        uint256 $id,
        uint32 $amount,
        bytes memory $data
    ) external payable;

    /**
     * @notice Burns the ERC-1155 Orb.
     * @param $id The token ID to burn.
     * @param $amount The amount of tokens to burn.
     */
    function burn(uint256 $id, uint32 $amount) external;
}
