// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.18;

/// @dev Core dependencies.
import {IOrb} from "./interfaces/IOrb.sol";
import {ERC1155} from "solady/src/tokens/ERC1155.sol";

/// @dev Interface dependencies.
import {OrbRenderer} from "./OrbRenderer.sol";

/**
 * @title Orb: The identity representation of a CHANCE reflected in an abstract Orb form.
 * @author sftchance.eth
 * @notice This contract enables an open market of familial-based Orbs. Through optional and social
 *         coordination of forking it is possible to create a new Orb from an existing one
 *         to denote a generational inspiration even when the genes are not directly passed down.
 *
 * @notice CHANCE Orbs are meant to be a study in how identity is represented onchain and the Digital
 *         Diaspora that emerges from the introduction of digital races and ethnicities. With a homage
 *         to those before, Orbs are a reflection of the past, present, and future for all those who
 *         have been, are, and will be. All that mint, scroll by, and fork are a part of the CHANCE
 *         family and geography presenting a new way to experience related digital identities.
 *         To protect the outcome, every action is acknowledged and accounted for in detail.
 */
contract Orb is IOrb, ERC1155 {
    /// @dev The address of the deployer of the contract.
    address payable public deployer;

    /// @dev The address of the renderer contract.
    OrbRenderer public renderer;

    /// @dev Keep track of the color mappings minted.
    mapping(uint256 => Provenance) public provenance;

    /**
     * @notice Constructs the Orb ERC-1155 contract.
     * @dev The IPFS hash is stored as bytes to save gas.
     */
    constructor(OrbRenderer $renderer) ERC1155() {
        /// @dev Store the deployer address.
        deployer = payable(msg.sender);

        /// @dev Store the renderer.
        renderer = $renderer;
    }

    /**
     * See {IOrb-load}.
     */
    function load(
        uint256 $id,
        Provenance memory $provenance
    ) public payable virtual returns (uint256) {
        /// @dev Warming up the provenance mappings.
        Provenance storage provenanceRef = provenance[$id];

        /// @dev Confirm the message sender has permission to set the provenance.
        require(
            provenanceRef.vault == address(0) ||
                provenanceRef.vault == msg.sender,
            "Orb::load: vault already set"
        );

        /// @dev Confirm the max supply is not already reached.
        /// @notice When `maxSupply` is 0, it is unlimited.
        require(
            provenanceRef.maxSupply == 0 ||
                $provenance.maxSupply >= provenanceRef.totalSupply,
            "Orb::load: can only increase max supply"
        );

        /// @dev Confirm the closure of minting has not already passed.
        require(
            provenanceRef.closure == 0 ||
                $provenance.closure >= provenanceRef.closure,
            "Orb::load: can only increase closure"
        );

        /// @dev Confirm the caller holds the majority of the Orb that is being
        ///      loaded -- An Orb cannot be rugged from a natural Aura source.
        require(
            balanceOf(msg.sender, $id) > provenanceRef.totalSupply / 2,
            "Orb::load: caller does not hold Orb"
        );

        /// @dev Set `uri` to use the IPFS hash and token ID for the metadata.
        provenanceRef.useIPFS = $provenance.useIPFS;

        /// @dev Set the max supply of the Orb.
        provenanceRef.maxSupply = $provenance.maxSupply;

        /// @dev Set the closure of minting the Orb.
        provenanceRef.closure = $provenance.closure;

        /// @dev Set the price to mint the Orb.
        provenanceRef.price = $provenance.price;

        /// @dev Set the vault address of the Orb.
        provenanceRef.vault = $provenance.vault;

        /// @dev Pay the difference in price to the deployer of the Orbs.
        if (provenanceRef.price < $provenance.price) {
            /// @dev Transfer the funds to the deployer.
            (bool success, ) = deployer.call{
                value: ($provenance.price - provenanceRef.price)
            }("Orb::load: transfer failed");

            /// @dev Confirm the transfer was successful.
            require(success, "Orb::load: transfer failed");
        }

        /// @dev Emit the load event.
        emit Load(msg.sender, $id);

        /// @dev Return the token ID of the loaded Orb.
        return $id;
    }

    /**
     * See {IOrb-fork}.
     */
    function fork(
        uint256 $forkedId,
        uint256 $id,
        Provenance memory $provenance
    ) public payable virtual returns (uint256 forkId) {
        /// @dev Confirm the forked provenance exists.
        require($forkedId != 0, "Orb::load: forked provenance not found");

        /// @dev Load the provenance into a new token ID.
        forkId = load($id, $provenance);

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
    ) public payable virtual {
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
            (bool success, ) = provenanceRef.vault.call{value: msg.value}(
                "Orb::mint: transfer failed"
            );

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
     * See {ERC1155-uri}.
     */
    function uri(uint256 $id) public view override returns (string memory) {
        /// @dev Guard against the Onchain Renderer being used when disabled.
        if (provenance[$id].useIPFS > 0)
            /// @dev Return the built URI.
            return renderer.uriIPFS($id);

        /// @dev Render the Orb using the onchain engine.
        return renderer.uri($id);
    }
}
