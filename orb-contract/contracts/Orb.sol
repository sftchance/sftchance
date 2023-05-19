// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.18;

/// @dev Core dependencies.
import {IOrb} from "./interfaces/IOrb.sol";
import {ERC1155} from "solady/src/tokens/ERC1155.sol";

/// @dev Interface dependencies.
import {OrbRenderer} from "./OrbRenderer.sol";

/// @dev Helper libraries.
import {LibColor} from "./utils/LibColor.sol";
import {LibOrb} from "./utils/LibOrb.sol";

/**
 * @title Orb: An Orb is the visualization of its holder's aura.
 * @author sftchance.eth
 * @notice This contract enables an open market of familial-based Orbs. Through optional and social
 *         coordination of forking it is possible to create a new Orb from an existing one
 *         to denote a generational inspiration even when the genes are not directly passed down.
 *
 * @notice CHANCE Orbs are a study in how identity is represented onchain and the Digital
 *         Diaspora that emerges from the introduction of digital races and ethnicities. With a homage
 *         to those before, Orbs are a reflection of the past, present, and future for all those who
 *         have been, are, and will be. All that mint, scroll by, and fork are a part of the CHANCE
 *         family and geography presenting a new way to experience related digital identities.
 *         To protect the outcome, every action is acknowledged and accounted for in detail.
 */
contract Orb is IOrb, ERC1155 {
    using LibColor for uint32;
    using LibOrb for uint32;

    /// @dev The address of the deployer of the contract.
    address payable public immutable deployer;

    /// @dev The address of the renderer contract.
    OrbRenderer public immutable renderer;

    /// @dev Keep track of the color mappings minted.
    mapping(uint256 => Provenance) public provenance;

    /**
     * @notice Constructs the Orb ERC-1155 contract with the renderer.
     */
    constructor(OrbRenderer $renderer) ERC1155() {
        /// @dev Store the deployer address.
        deployer = payable(msg.sender);

        /// @dev Store the renderer.
        renderer = $renderer;
    }

    /**
     * @notice Enforce the quality of a token ID to minimize the amount of
     *         birth defects in the Orb population.
     * @param $id The token ID to validate.
     */
    modifier onlyValidID(uint256 $id) {
        /// @dev Confirm the token ID is valid.
        require(isValid($id), "Orb::onlyValidID: invalid ID");

        /// @dev We love the cursed modifier <3.
        _;
    }

    /**
     * See {IOrb-load}.
     */
    function load(
        uint256 $id,
        Provenance memory $provenance
    ) public payable virtual onlyValidID($id) {
        /// @dev Warming up the provenance mappings.
        Provenance storage provenanceRef = provenance[$id];

        /// @dev Determine if the caller is the natural Aura source.
        bool isAuraSource = provenanceRef.vault == address(0) &&
            balanceOf(msg.sender, $id) > provenanceRef.totalSupply / 2;

        /// @dev Confirm the message sender has permission to set the provenance.
        /// @notice Confirms the caller holds the majority of the Orb that is being
        ///         loaded -- An Orb cannot be rugged from a natural Aura source.
        require(
            isAuraSource || provenanceRef.vault == msg.sender,
            "Orb::load: invalid vault configuration"
        );

        /// @dev Determine if an infinite amount of the Orb can be minted.
        bool isInfinite = provenanceRef.maxSupply == 0 &&
            $provenance.maxSupply == 0;

        /// @dev Recover the bitpacked max supply of the Orb.
        uint32 $uMaxSupply = LibOrb.maxSupply($provenance.maxSupply);

        /// @dev Determine if the max supply is within the range of the previous max supply
        ///      while confirming the maximum slot value is not exceeded and is not already reached.
        bool isRangeBound = $uMaxSupply >=
            LibOrb.maxSupply(provenanceRef.maxSupply) &&
            $uMaxSupply >= provenanceRef.totalSupply &&
            $uMaxSupply <= type(uint32).max;

        /// @dev Confirm the max supply is not already reached.
        /// @notice When `maxSupply` is 0, it is unlimited.
        require(
            isInfinite || isRangeBound,
            "Orb::load: invalid max supply configuration"
        );

        /// @dev Determine if the minting of the Orb has no expiration.
        isInfinite = $provenance.closure == 0 && provenanceRef.closure == 0;

        /// @dev Determine if the minting of the Orb has a valid expiration.
        bool isFuture = $provenance.closure >= block.timestamp &&
            $provenance.closure >= provenanceRef.closure;

        /// @dev Confirm the closure of minting has yet been set or is being increased.
        /// @notice When `closure` is 0, there is no expiration.
        require(
            isInfinite || isFuture,
            "Orb::load: invalid closure configuration"
        );

        /// @dev Determine the payment owed for the price change to the ecosystem.
        /// @notice This is merely a fee to prevent spam.
        uint256 priceDiff = $provenance.price > 0
            ? LibOrb.price($provenance.price) -
                LibOrb.price(provenanceRef.price)
            : 0;

        /// @dev Confirm the correct funding has been provided.
        require(msg.value == priceDiff, "Orb::load: invalid funding");

        /// @dev Set the max supply of the Orb.
        provenanceRef.maxSupply = $provenance.maxSupply;

        /// @dev Set the closure of minting the Orb.
        provenanceRef.closure = $provenance.closure;

        /// @dev Set the price to mint the Orb.
        provenanceRef.price = $provenance.price;

        /// @dev Set the vault address of the Orb.
        provenanceRef.vault = $provenance.vault;

        /// @dev Emit the load event of the Orb.
        emit Load(
            msg.sender,
            $id,
            $provenance.maxSupply,
            $provenance.price,
            $provenance.closure,
            $provenance.vault
        );

        /// @dev Pay the difference in price to the deployer of the Orbs.
        /// @notice We use standard `transfer` here because we know the deployer
        ///        to be safe and not malicious.
        if (priceDiff > 0) deployer.transfer(priceDiff);
    }

    /**
     * See {IOrb-fork}.
     */
    function fork(
        uint256 $forkedId,
        uint256 $id,
        Provenance memory $provenance
    ) public payable virtual onlyValidID($forkedId) {
        /// @dev Confirm the forked provenance exists.
        require($forkedId != 0, "Orb::load: forked provenance not found");

        /// @dev Confirm the `forkedId` has been minted.
        require(
            provenance[$forkedId].totalSupply > 0,
            "Orb::load: forked provenance not found"
        );

        /// @dev Load the provenance into a new token ID.
        load($id, $provenance);

        /// @dev Emit the fork event.
        emit Fork(msg.sender, $forkedId, $id);
    }

    /**
     * See {IOrb-forfeit}.
     */
    function forfeit(uint256 $id) public virtual {
        /// @dev Warming up the provenance mappings.
        Provenance storage provenanceRef = provenance[$id];

        /// @dev Confirm the message sender has permission to forfeit the provenance.
        require(
            provenanceRef.vault == msg.sender,
            "Orb::forfeit: vault already set"
        );

        /// @dev Set the vault to the ETH Dolphin address.
        /// @notice "Be the change you want to see." - horsefacts
        provenanceRef.vault = payable(
            address(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE)
        );

        /// @dev Reset the price to 0.
        delete provenanceRef.price;
    }

    /**
     * See {IOrb-mint}.
     */
    function mint(
        address $to,
        uint256 $id,
        uint32 $amount,
        bytes memory $data
    ) public payable virtual onlyValidID($id) {
        /// @dev Warming up the provenance mappings.
        Provenance storage provenanceRef = provenance[$id];

        /// @dev Confirm the totalSupply will not be exceeded.
        /// @notice When `maxSupply` is 0, the total supply is unlimited.
        require(
            provenanceRef.maxSupply == 0 ||
                provenanceRef.totalSupply + $amount <= provenanceRef.maxSupply,
            "Orb::mint: totalSupply exceeded"
        );

        /// @dev Transfer the funds to the vault if the price is greater than 0.
        if (provenanceRef.price != 0) {
            /// @dev Confirm the proper value has been provided.
            require(
                msg.value == provenanceRef.price * $amount,
                "Orb::mint: incorrect value"
            );

            /// @dev Transfer the funds to the vault.
            (bool success, ) = provenanceRef.vault.call{value: msg.value}("");

            /// @dev Confirm the transfer was successful.
            require(success, "Orb::mint: transfer failed");
        }

        /// @dev Increment the total supply of the Orb.
        unchecked {
            provenanceRef.totalSupply += $amount;
        }

        /// @dev Call the internal mint function having validated payment.
        super._mint($to, $id, $amount, $data);
    }

    /**
     * See {IOrb-burn}.
     */
    function burn(uint256 $id, uint32 $amount) public virtual {
        /// @dev Warming up the provenance mappings.
        Provenance storage provenanceRef = provenance[$id];

        /// @dev Decrement the total supply of the Orb.
        unchecked {
            provenanceRef.totalSupply -= $amount;
        }

        /// @dev Call the internal burn function.
        super._burn(msg.sender, $id, $amount);
    }

    /**
     * @notice Withdraw the ETH balance of the contract.
     * @dev Only the deployer can call this function.
     */
    function withdraw() public virtual {
        /// @dev Confirm the message sender is the deployer.
        require(msg.sender == deployer, "Orb::withdraw: unauthorized");

        /// @dev Transfer the funds to the deployer.
        (bool success, ) = deployer.call{value: address(this).balance}("");

        /// @dev Confirm the transfer was successful.
        require(success, "Orb::withdraw: transfer failed");
    }

    /**
     * See {IOrb-isValid}.
     */
    function isValid(uint256 $id) public view virtual returns (bool $valid) {
        /// @dev If a token has already been minted, we know it to be valid.
        if (provenance[$id].totalSupply > 0) return true;

        /// @dev Warming up the temporary color storage slot.
        uint32 $color;

        /// @dev Tracking the last domain used to prevent broken Orbs.
        uint8 prevDomain;

        /// @dev Counting the number of colors in the provided Orb color definition.
        uint8 colors;

        /// @dev Truncate the 256 bits to 224, trimming the map to exclude the last
        ///      32 bits which are used for the positional data of the Orb gradient.
        uint224 id = uint224($id);

        /// @dev Loading a slot for the domain.
        uint256 domain;

        /// @dev Truncate the 256 bits to 224, trimming the map to exclude the last
        ///      32 bits which are used for the positional data of the Orb gradient.
        for (id; id > 0; id >>= LibColor.HEX_OFFSET) {
            /// @dev The color is the last 32 bits of the ID.
            $color = uint32(id & LibColor.HEX_MASK);

            /// @dev Get the domain of the active stop.
            domain = $color.domain();

            /// @dev Confirm 0 <= domain <= 100 and domain_N < domain_N+1.
            require(
                domain > prevDomain && domain <= LibOrb.MAX_DOMAIN,
                "Orb::isValid: invalid color domain"
            );

            /// @dev Keep track when there is a color to render.
            unchecked {
                if (!$color.empty()) {
                    ++colors;
                }
            }
        }

        /// @dev Prevent empty Orbs from being drawn.
        require(colors > 0, "Orb::isValid: no colors");

        /// @dev Get the chromosone head of of the DNA declaration.
        $color = uint32(($id >> 224) & LibColor.HEX_MASK);

        /// @dev Confirm 0 <= x & y <= 100.
        require(
            $color.coordinate(0) <= LibOrb.MAX_COORDINATE &&
                $color.coordinate(1) <= LibOrb.MAX_COORDINATE,
            "Orb::isValid: invalid gradient coordinates"
        );

        /// @dev Confirm colorCount == count of non-empty colors.
        require(
            $color.colorCount() == colors,
            "Orb::isValid: invalid color count"
        );

        /// @dev The ID is valid.
        return true;
    }

    /**
     * See {ERC1155-uri}.
     */
    function uri(
        uint256 $id
    ) public view override onlyValidID($id) returns (string memory $uri) {
        /// @dev Render the Orb using the onchain engine.
        $uri = renderer.uri($id);
    }
}
