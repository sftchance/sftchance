// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.18;

interface IOrb {
    /// @dev The provenance metadata of an Orb.
    struct Provenance {
        uint8 useIPFS;
        uint32 maxSupply;
        uint32 totalSupply;
        uint48 closure;
        uint136 price;
        address payable vault;
    }

    /// dev Enables the tracking of loaded Orbs.
    event Load(address indexed $by, uint256 indexed $id);

    /// @dev Enables the tracking of inspired Orbs.
    event Fork(
        address indexed $by,
        uint256 indexed $id,
        uint256 indexed $forkId
    );

    /**
     * @notice Loads the provenance data for an Orb (can be creation and updating).
     * @param $id The token ID of the Orb being minted reprsenting the DNA of the colors.
     * @param $provenance The provenance data of the Orb.
     */
    function load(uint256 $id, Provenance memory $provenance) external payable;

    /**
     * @notice Enables the forking of an existing Orb.
     * @param $forkedId The token ID of the Orb to fork.
     * @param $id The token ID of the Orb being minted reprsenting the DNA of the colors.
     * @param $provenance The provenance data to set.
     */
    function fork(
        uint256 $forkedId,
        uint256 $id,
        Provenance memory $provenance
    ) external payable;

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
