// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.18;

import {LibString} from "solady/src/utils/LibString.sol";

/**
 * @title LibColor
 * @author sftchance.eth
 * @notice This library handles the bitpacking and unpacking of colors to use a
 *         single `uint256` as a colormap with bitpacked domains creating a
 *         native representation with managed stops.
 */
library LibColor {
    using LibString for uint8;

    // A look-up table to simplify the conversion from number to hexstring.
    bytes32 constant HEXADECIMAL_DIGITS = "0123456789ABCDEF";

    /// @dev The size of each color in the bitpacked sum.
    uint256 constant HEX_SIZE = 32;

    /// @dev The size of color index in each bitpacked value.
    uint256 constant SHORT_SIZE = 8;

    /// @dev The mask to extract the color from the bitpacked sum.
    uint256 constant HEX_MASK = 0xFFFFFFFF;

    /// @dev The mask to extract the color from the bitpacked sum.
    uint256 constant HEX_TAIL_MASK = 0xF;

    /// @dev The size of color index in each bitpacked value.
    uint256 constant SHORT_MASK = 0xFF;

    /// @dev The size of the domain index in each bitpacked value.
    uint256 constant DOMAIN_OFFSET = SHORT_SIZE * 3;

    function color(
        uint32,
        uint256 $map,
        uint8 $index
    ) public pure returns (uint32 $color) {
        /// @dev Extract the color from the bitpacked sum.
        $color = uint32(($map >> ($index * HEX_SIZE)) & HEX_MASK);
    }

    function r(uint32 $color) public pure returns (uint8 $r) {
        /// @dev Extract the rgb values from the bitpacked color.
        $r = uint8($color & SHORT_MASK);
    }

    function g(uint32 $color) public pure returns (uint8 $g) {
        /// @dev Extract the rgb values from the bitpacked color.
        $g = uint8(($color >> SHORT_SIZE) & SHORT_MASK);
    }

    function b(uint32 $color) public pure returns (uint8 $b) {
        /// @dev Extract the rgb values from the bitpacked color.
        $b = uint8(($color >> (SHORT_SIZE * 2)) & SHORT_MASK);
    }

    function rgb(
        uint32 $color
    ) public pure returns (uint8 $r, uint8 $g, uint8 $b) {
        /// @dev Extract the rgb values from the bitpacked color.
        $r = r($color);
        $g = g($color);
        $b = b($color);
    }

    function domain(uint32 $color) public pure returns (string memory $domain) {
        /// @dev Get the last 8 bits from `$color` and convert it to a `uint8`
        ///      value representing the domain of the color.
        $domain = uint8(($color >> DOMAIN_OFFSET) & SHORT_MASK).toString();
    }

    function empty(uint32 $color) public pure returns (bool $empty) {
        /// @dev Get the last bit and determine if it has been toggled to signal
        ///      that the color is empty.
        $empty = ($color >> (HEX_SIZE - 1)) == 1;
    }

    function hexadecimal(
        uint32 $color
    ) public pure returns (string memory $hex) {
        /// @dev Extract the rgb values from the bitpacked color.
        (uint8 $r, uint8 $g, uint8 $b) = rgb($color);

        /// @dev Convert the rgb values to a hexadecimal string representation.
        $hex = string(
            abi.encodePacked(
                HEXADECIMAL_DIGITS[$r >> 4],
                HEXADECIMAL_DIGITS[$r & HEX_TAIL_MASK],
                HEXADECIMAL_DIGITS[$g >> 4],
                HEXADECIMAL_DIGITS[$g & HEX_TAIL_MASK],
                HEXADECIMAL_DIGITS[$b >> 4],
                HEXADECIMAL_DIGITS[$b & HEX_TAIL_MASK]
            )
        );
    }
}
