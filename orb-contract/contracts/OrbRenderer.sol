// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.18;

/// @dev Core dependencies.
import {IOrbRenderer} from "./interfaces/IOrbRenderer.sol";

/// @dev Helper libraries.
import {Base64} from "solady/src/utils/Base64.sol";
import {LibColor} from "./utils/LibColor.sol";
import {LibString} from "solady/src/utils/LibString.sol";

/**
 * @title OrbRender
 * @author sftchance.eth
 * @notice This contract handles the rendering of Orbs onchain creating a native SVG representation.
 *         Built on top of a DNA-like system, the rendering is deterministic and can be used to
 *         create a unique visual representation of an Orb simply by manipulating the token ID.
 *
 * @notice (We are reading bits right to left, so the first 8 bits are the last 8 bits of the token ID)

 * @notice The token ID is a 256-bit unsigned integer that is broken up into 32-bit unsigned integers
 *         summed together to create the output gradient. 
 * 
 * @notice An Orb may have up to 7 gradient stops, each represented by a 32-bit unsigned integer but 
 *         there must be at least one.
 * @notice The first 24 bits of the 32-bit unsigned integer represent the color and the last 8 bits
 *         represent the domain of the gradient stop.
 *             - The color is represented as a `uint24` filled leaving 8 empty.
 *             - The domain is a percentage of the gradient that the stop should be placed at stored in
 *               `uint8` that only ever has 7 bits filled leaving one empty.
 *             - The color may be empty, which means the stop should not be rendered and is represented
 *               by a `1` in the final bit of the colors `uint32`.
 *
 * @notice The definition of an Orb may have up to 7 color gradient stops while the last 32 bits of 
 *         the token ID are reserved for supporting metadata.
 */
contract OrbRenderer is IOrbRenderer {
    using Base64 for bytes;
    using LibColor for uint32;
    using LibString for uint256;

    /// @dev The maximum number of gradient stops an Orb can have.
    uint8 public constant MAX_STOPS = 7;

    /// @dev The IPFS hash of the ERC-1155 token metadata.
    bytes public ipfsHashBytes;

    /// @dev The layers of the Orb visualization.
    string[] public layers;

    /**
     * @notice Constructs the Orb renderer.
     * @param $ifpsHashBytes The IPFS hash of the ERC-1155 token metadata.
     * @param $layers The layers of the Orb visualization.
     */
    constructor(bytes memory $ifpsHashBytes, string[] memory $layers) {
        /// @dev Set the IPFS hash of the ERC-1155 token metadata.
        ipfsHashBytes = $ifpsHashBytes;

        /// @dev Set the layers of the Orb visualization.
        layers = $layers;
    }

    /**
     * @notice Builds the SVG representation of the gradient.
     * @param $id The token ID of the Orb.
     * @return $gradient The SVG representation of the gradient.
     */
    function gradient(
        uint256 $id
    ) internal pure returns (string memory $gradient) {
        /// @dev Prepare the metadata information slots.
        uint8 i;
        uint32 color;

        /// @dev Extract the first 32 bits of the token ID.
        /// @notice The last segment in a token ID contains two coordinates that
        ///         are each 9 bits in length. The first coordinate is the
        ///         x-coordinate and the second coordinate is the y-coordinate
        ///         for the center of the radial gradient.
        uint32 coords = color.color($id, MAX_STOPS);

        /// @dev Prepare the head of the Orb gradient declaration.
        $gradient = string.concat(
            '<defs><radialGradient id="gradient" gradientUnits="userSpaceOnUse" gradientTransform="translate(',
            uint256(coords.coordinate(0)).toString(),
            " ",
            uint256(coords.coordinate(1)).toString(),
            ') rotate(135) scale(251 263)">'
        );

        /// @dev Iterate over the gradient stops.
        for (i; i < MAX_STOPS; i++) {
            /// @dev Extract the first 24 bits of the active value of `$i` and
            ///      convert it to a single `uint24` value representing a color.
            color = color.color($id, i);

            /// @dev Confirm the color is not empty and intended to be used.
            if (color.empty()) continue;

            /// @dev Add the color to the gradient map.
            $gradient = string.concat(
                $gradient,
                '<stop stop-color="#',
                color.hexadecimal(),
                '" offset="',
                uint256(color.domain()).toString(),
                '%"/>'
            );
        }

        /// @dev Add the tail of the gradient declaration.
        $gradient = string.concat($gradient, "</radialGradient></defs>");
    }

    /**
     * See {IOrbRenderer-svg}.
     */
    function svg(uint256 $id) public view virtual returns (string memory $svg) {
        /// @dev Initialize the SVG.
        $svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">';

        /// @dev Add a black background to the SVG.
        $svg = string.concat(
            $svg,
            '<rect width="100" height="100" fill="#000"/>'
        );

        /// @dev Add a circle to the gradient that has the gradient the fill.
        $svg = string.concat(
            $svg,
            gradient($id),
            '<circle cx="50" cy="50" r="50" fill="url(#gradient)"/>'
        );

        /// @dev Add the layers to the SVG.
        for (uint256 i; i < layers.length; i++) {
            $svg = string.concat($svg, layers[i]);
        }

        /// @dev Encode and return the SVG in base64.
        $svg = string.concat(
            "data:image/svg+xml;base64,",
            abi.encodePacked(string.concat($svg, "</svg>")).encode()
        );
    }

    /**
     * See {IOrbRenderer-uri}.
     */
    function uri(
        uint256 $id
    ) public view virtual returns (string memory metadata) {
        /// @dev Build the SVG metadata.
        metadata = svg($id);

        /// @dev Build the JSON metadata.
        metadata = string.concat(
            '{ "name": "Orb #',
            $id.toString(),
            '", "description": "Orbs are a reflection of the CHANCE you are given.", "image": "',
            metadata,
            '", "attributes": [], external_url": "',
            uriIPFS($id),
            '" }'
        );

        /// @dev Encode and return the JSON metadata in base64.
        metadata = string.concat(
            "data:application/json;base64,",
            abi.encodePacked(metadata).encode()
        );
    }

    /**
     * See {IOrbRenderer-uriIPFS}.
     */
    function uriIPFS(uint256 $id) public view virtual returns (string memory) {
        /// @dev Convert the IPFS hash bytes to a string.
        string memory ipfsHashString = string(ipfsHashBytes);

        /// @dev Build the IPFS URI.
        return
            string.concat(
                "ipfs://",
                string.concat(
                    string.concat(ipfsHashString, "/?id="),
                    $id.toString()
                )
            );
    }
}
