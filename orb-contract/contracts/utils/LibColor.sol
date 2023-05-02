// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.18;

/**
 * @title LibColor
 * @author sftchance.eth
 * @notice This library handles the bitpacking and unpacking of colors to use a
 *         single `uint256` as a colormap with bitpacked domains creating a
 *         native representation with managed stops.
 */
library LibColor {
    // A look-up table to simplify the conversion from number to hexstring.
    bytes32 constant HEXADECIMAL_DIGITS = "0123456789ABCDEF";

    /// @dev The size of each color in the bitpacked sum.
    uint256 constant HEX_OFFSET = 32;

    /// @dev The mask to extract the color from the bitpacked sum.
    uint256 constant HEX_MASK = 0xFFFFFFFF;

    /// @dev The mask to extract the color from the bitpacked sum.
    uint256 constant HEX_TAIL_MASK = 0xF;

    /// @dev The size of color index in each bitpacked value.
    uint256 constant SHORT_OFFSET = 8;

    /// @dev The size of color index in each bitpacked value.
    uint256 constant SHORT_MASK = 0xFF;

    /// @dev The size of the domain index in each bitpacked value.
    uint256 constant DOMAIN_OFFSET = SHORT_OFFSET * 3;

    /// @dev The mask to extract the domain from the bitpacked sum.
    uint256 constant DOMAIN_MASK = 0x7F;

    /**
     * @notice Get the bitpacked value of the color extracted from the
     *         colormap at the given index.
     * @param $map The colormap to extract the color from.
     * @param $index The index of the color in the colormap.
     * @return $color The extracted, but still bitpacked color.
     */
    function color(
        uint32,
        uint256 $map,
        uint8 $index
    ) public pure returns (uint32 $color) {
        /// @dev Extract the color from the bitpacked sum.
        $color = uint32(($map >> ($index * HEX_OFFSET)) & HEX_MASK);
    }

    /**
     * @notice Get the [0-255] value of the blue channel of the color.
     * @param $color The bitpacked color to extract the blue channel from.
     * @return $r The [0-255] value of the blue channel of the color.
     */
    function r(uint32 $color) public pure returns (uint8 $r) {
        /// @dev Extract the rgb values from the bitpacked color.
        $r = uint8(($color >> (SHORT_OFFSET * 2)) & SHORT_MASK);
    }

    /**
     * @notice Get the [0-255] value of the green channel of the color.
     * @param $color The bitpacked color to extract the green channel from.
     * @return $g The [0-255] value of the green channel of the color.
     */
    function g(uint32 $color) public pure returns (uint8 $g) {
        /// @dev Extract the rgb values from the bitpacked color.
        $g = uint8(($color >> SHORT_OFFSET) & SHORT_MASK);
    }

    /**
     * @notice Get the [0-255] value of the red channel of the color.
     * @param $color The bitpacked color to extract the red channel from.
     * @return $b The [0-255] value of the red channel of the color.
     */
    function b(uint32 $color) public pure returns (uint8 $b) {
        /// @dev Extract the rgb values from the bitpacked color.
        $b = uint8($color & SHORT_MASK);
    }

    /**
     * @notice Get the [0-255] value of the red, green, and blue channels of the
     *        color.
     * @param $color The bitpacked color to extract the rgb channels from.
     * @return $r The [0-255] value of the red channel of the color.
     * @return $g The [0-255] value of the green channel of the color.
     * @return $b The [0-255] value of the blue channel of the color.
     */
    function rgb(
        uint32 $color
    ) public pure returns (uint8 $r, uint8 $g, uint8 $b) {
        /// @dev Extract the rgb values from the bitpacked color.
        $r = r($color);
        $g = g($color);
        $b = b($color);
    }

    /**
     * @notice Get the [0-100] value of the red channel of the color.
     * @param $color The bitpacked color to extract the red channel from.
     * @return $domain The [0-100] value of the color in the gradient.
     */
    function domain(uint32 $color) public pure returns (uint8 $domain) {
        /// @dev Get the last 8 bits from `$color` and convert it to a `uint8`
        ///      value representing the domain of the color.
        $domain = uint8(($color >> DOMAIN_OFFSET) & DOMAIN_MASK);
    }

    /**
     * @notice Determine if a color has been purposefully set to empty.
     * @param $color The bitpacked color to check if it is empty.
     * @return $empty Whether or not the color is empty.
     */
    function empty(uint32 $color) public pure returns (bool $empty) {
        /// @dev Get the last bit and determine if it has been toggled to signal
        ///      that the color is empty.
        $empty = ($color >> (HEX_OFFSET - 1)) == 0;
    }

    /**
     * @notice Get the hexadecimal string representation of the color.
     * @param $color The bitpacked color to convert to a hexadecimal string.
     * @return $hex The hexadecimal string representation of the color.
     */
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
