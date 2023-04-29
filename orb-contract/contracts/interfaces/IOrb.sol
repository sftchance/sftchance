// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.18;

interface IOrb {
    /// @dev The provenance metadata of an Orb.
    /// @notice With an address in the same slot, we only have 96 bits left for the rest of the data.
    struct Provenance {
        /// @notice  First 6 bits represents the power of the next 10.
        /// @notice To set it to `uint32.max` supply should be set to the value of `2^32`
        /// @notice Thanks to the wizardry of binary, 2^32 == 4,294,967,296 == uint32 max.
        /// @dev | supply (2 bits) | power (6 bits) |
        uint8 maxSupply;
        /// @dev The price of the Orb in wei.
        uint24 price;
        /// @dev The total supply of the Orb minted at any given time.
        uint32 totalSupply;
        /// @dev When calculated, `closure` is based upon `1672534861` as the Genesis Epoch.
        uint32 closure;
        /// @dev The address that funds are sent to upon minting.
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
