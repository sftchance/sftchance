// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.18;

/// @dev Core dependencies.
import {IOrbRenderer} from "./interfaces/IOrbRenderer.sol";

/// @dev Helper libraries.
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

    function gradient(
        uint256 $id
    ) internal pure returns (string memory $gradient) {
        /// @dev Initialize the top of the gradient.
        $gradient = '<defs><radialGradient id="gradient" gradientUnits="userSpaceOnUse" gradientTransform="translate(186.276 6.31085) rotate(134.804) scale(250.809 263.344)">';

        /// @dev Prepare the metadata information slots.
        uint8 i;
        uint32 color;

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
                color.domain(),
                '%"/>'
            );
        }

        /// @dev Add the tail of the gradient declaration.
        $gradient = string.concat($gradient, "</radialGradient></defs>");
    }

    function uri(uint256 $id) public view virtual returns (string memory svg) {
        /// @dev Initialize the SVG.
        svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">';

        /// @dev Add a black background to the SVG.
        svg = string.concat(
            svg,
            '<rect width="100" height="100" fill="#000"/>'
        );

        /// @dev Register the gradient in the SVG.
        svg = string.concat(svg, gradient($id));

        /// @dev Add a circle to the gradient that has the gradient the fill.
        svg = string.concat(
            svg,
            '<circle cx="50" cy="50" r="50" fill="url(#gradient)"/>'
        );

        /// @dev Add the layers to the SVG.
        for (uint256 i; i < layers.length; i++) {
            svg = string.concat(svg, layers[i]);
        }

        /// @dev Close the SVG.
        svg = string.concat(svg, "</svg>");
    }

    function uriIPFS(uint256 $id) public view virtual returns (string memory) {
        /// @dev Convert the IPFS hash bytes to a string.
        string memory ipfsHashString = string(ipfsHashBytes);

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
