// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.18;

/// @dev Core dependencies.
import {IOrbRenderer} from "./interfaces/IOrbRenderer.sol";

/// @dev Helper libraries.
import {Base64} from "solady/src/utils/Base64.sol";
import {LibString} from "solady/src/utils/LibString.sol";

import {LibColor} from "./utils/LibColor.sol";
import {LibOrb} from "./utils/LibOrb.sol";

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
 * @notice The definition of an Orb may have up to 7 color gradient stops while the last 32 bits of 
 *         the token ID are reserved for supporting metadata.
 * @notice The first 24 bits of the 32-bit unsigned integer represent the color and the last 8 bits
 *         represent the domain of the gradient stop.
 *             - The color is represented as a `uint24` filled leaving 8 empty.
 *             - The domain is a percentage of the gradient that the stop should be placed at stored in
 *               `uint8` that only ever has 7 bits filled leaving one empty.
 *             - The color may be empty, which means the stop should not be rendered and is represented
 *               by a `1` in the final bit of the colors `uint32`.
 *
 * @dev Bitpacked schema definition of the Orb token ID:
 *
 *      pos   (18 bits) = | x (9 bits) | y (9 bits) | 
 * 
 *      top   (32 bits) = | bg_scalar (8 bits) | bg_transparent (1 bit) | color_count (3 bits) 
 *                        | speed (2 bits) | pos (18 bits) |
 * 
 *      color (32 bits) = | empty (1 bit) | domain (7 bits) | r (8 bits) | g (8 bits) | b (8 bits) |
 * 
 *      dna  (224 bits) = | color (32 bits) | color (32 bits) | color (32 bits) 
 *                        | color (32 bits) | color (32 bits) | color (32 bits) | color (32 bits) |
 *
 *      id   (256 bits) = | top (32 bits) | dna (224 bits) |
 *
 *      where (in raw value)    0 <= color_count <= 7
 *                          and 0 <= bg_scalar <= 255
 *                          and 0 <= domain <= 100
 *                          and domain_{N-1} <= domain_{N}
 *                          and 0 <= x <= 360
 *                          and 0 <= y <= 360
 *                          and 0 <= speed <= 3
 *                          and 0 <= r <= 255
 *                          and 0 <= g <= 255
 *                          and 0 <= b <= 255
 *                          and dna != 0 (dna is not all empty)
 *                          and color_count == number of non-empty colors in dna
 */
contract OrbRenderer is IOrbRenderer {
    /// @dev Type libraries.
    using Base64 for bytes;
    using LibString for bytes;
    using LibString for uint256;

    /// @dev Color utility libraries.
    using LibColor for uint32;
    using LibOrb for uint32;

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
     * See {IOrbRenderer-svg}.
     */
    function svg(uint256 $id, uint32 $config) public view virtual returns (string memory $svg) {
        /// @dev Determine the length of the animation.
        string memory animationDuration = (5 - $config.speed()).toString();

        /// @dev Initialize the SVG.
        $svg = string.concat(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet"><style>.f{animation:',
            animationDuration,
            's cubic-bezier(.42,0,.58,1) infinite float}.b{animation:',
            animationDuration,
            layers[0]
        );

        /// @dev Determine the polar coordinates of the radial gradient in the Orb.
        uint256 fx = $config.coordinate(0);
        uint256 fy = $config.coordinate(1);

        /// @dev Create the re-usable radial gradient instance.
        string memory radialTop = string.concat(
            '<radialGradient id="og" cx="50%" cy="50%" r="65%" fx="',
            fx.toString(),
            '%" fy="',
            fy.toString(),
            '%">'
        );

        /// @dev Prepare the radial gradient positioning.
        $svg = string.concat(
            $svg, 
            radialTop 
        );

        /// @dev Load the stack-space for the gradient.
        uint8 i;
        uint32 color;

        /// @dev Iterate over the gradient stops.
        for(i; i < MAX_STOPS; i++) { 
            /// @dev Extract the first 24 bits of the active value of `i`. 
            color = color.color($id, i);

            /// @dev Confirm the color is not empty and intended to be used.
            if (color.empty()) continue;

            /// @dev Add the color stop to the gradient map.
            $svg = string.concat(
                $svg,
                '<stop offset="',
                color.domain().toString(),
                '%" stop-color="#',
                color.hexadecimal(),
                '"/>'
            );
        }

        /// @dev Close the radial gradient.
        $svg = string.concat(
            $svg,
            "</radialGradient>"
        );

        /// @dev Prepare the slot for the maybe background.
        string memory background;

        /// @dev Add a background if the background is not transparent.
        if(!$config.bgTransparent()) { 
            /// @dev Recover the value of the background scalar and convert it to a bitpacked value.
            uint32 backgroundColor = $config.bgScalar().scalar();

            /// @dev Set the background string to a colored rectangle.
            background = string.concat(
                '<rect width="100%" height="100%" fill="#',
                backgroundColor.hexadecimal(),
                '"/>'
            );
        }

        /// @dev Append the gradient representing the shadow of the Orb.
        $svg = string.concat(
            $svg,
            radialTop,
            layers[1],
            // $id.toString(), /// @dev Seed used for the noise function.
            layers[2],
            background, /// @dev Maybe add a background.
            layers[3]
        );

        /// @dev Encode and return the SVG in base64.
        $svg = string.concat(
            "data:image/svg+xml;base64,",
            abi.encodePacked(string.concat($svg, "</svg>")).encode()
        );
    }

    /**
     * See {IOrbRenderer-attributes}.
     */
    function attributes(uint256 $id, uint32 $config) public pure virtual returns (string memory $attributes) { 
        /// @dev Append a coordinate string that represents the 'x' and 'y' coordinates of the Orb radial gradient.
        $attributes = string.concat(
            '{"trait_type": "Coordinates", "value": "(',
            $config.coordinate(0).toString(),
            ', ',
            $config.coordinate(1).toString(),
            ')"}'
        );

        /// @dev Append a value that represents the speed of the Orb.
        $attributes = string.concat(
            $attributes,
            ',{"display_type": "number", "trait_type": "Speed", "value": ',
            $config.speed().toString(),
            '}'
        );

        /// @dev Append a value that represents the number of colors in the Orb.
        $attributes = string.concat(
            $attributes,
            ',{"display_type": "number", "trait_type": "Colors", "value": ',
            uint256($config.colorCount()).toString(),
            '}'
        );

        /// @dev Recover the value of the background scalar and convert it to a bitpacked value.
        uint32 backgroundColor = $config.bgScalar().scalar();

        /// @dev Append the color of the background.
        if (!$config.bgTransparent()) {
            /// @dev Append the background as a hexadecimal.
            $attributes = string.concat(
                $attributes,
                ',{"trait_type": "Background", "value": "#',
                backgroundColor.hexadecimal(),
                '"}'
            );
        } else { 
            /// @dev Append the background as transparent.
            $attributes = string.concat(
                $attributes,
                ',{"trait_type": "Background", "value": "Transparent"}'
            );
        }

        /// @dev Load the stack-space for the gradient.
        uint8 i;
        uint32 color;
        
        /// @dev Append the hexadecimal of each color.
        for (i; i < $config.colorCount(); i++) {
            /// @dev Extract the first 24 bits of the active value of `i`. 
            color = color.color($id, i);

            /// @dev Confirm the color is not empty and intended to be used.
            if (color.empty()) continue;

            /// @dev Append the hexadecimal of the color.
            $attributes = string.concat(
                $attributes,
                ',{"trait_type": "Color #',
                uint256(i + 1).toString(),
                '", "value": "#',
                color.hexadecimal(),
                ':',
                color.domain().toString(),
                '"}'
            );
        }    
    }

    /**
     * See {IOrbRenderer-uri}.
     */
    function uri(
        uint256 $id
    ) public view virtual returns (string memory metadata) {
        /// @dev Extract the configuration from the Orb ID.
        uint32 config = uint32($id >> 224);

        /// @dev Build the Orb metadata.
        metadata = string.concat(
            '{ "name": "Orb #',
            $id.toString(),
            '", "description": "This Orb captures the aura of the holder.", "attributes": [',
            attributes($id, config),
            '], "image": "',
            svg($id, config),
            '", "external_url": "',
            uriIPFS($id),
            '"}'
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
