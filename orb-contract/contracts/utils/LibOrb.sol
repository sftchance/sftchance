// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.18;

/// @dev Helper libraries.
import {LibString} from "solady/src/utils/LibString.sol";

library LibOrb {
    /// @dev The bit shift needed to extract the coordinate value.
    uint256 constant COORD_OFFSET = 9;

    /// @dev The mask used with bitwise `&` to extract the coordinate value.
    uint256 constant COORD_MASK = 0x1FF;

    /// @dev The bit shift needed to extract the speed value.
    uint256 constant SPEED_OFFSET = 18;

    /// @dev The mask used with bitwise `&` to extract the speed value.
    uint256 constant SPEED_MASK = 0x3;

    /// @dev The bit shift needed to extract the color count value.
    uint256 constant COLOR_COUNT_OFFSET = 20;

    /// @dev The mask used with bitwise `&` to extract the color count value.
    uint256 constant COLOR_COUNT_MASK = 0x7;

    /// @dev The bit shift needed to extract the bg transparent value.
    uint256 constant BG_TRANSPARENT_OFFSET = 23;

    /// @dev The mask used with bitwise `&` to extract the bg transparent value.
    uint256 constant BG_TRANSPARENT_MASK = 0x1;

    /// @dev The bit shift needed to extract the bg scalar value.
    uint256 constant BG_SCALAR_OFFSET = 24;

    /// @dev The mask used with bitwise `&` to extract the bg scalar value.
    uint256 constant BG_SCALAR_MASK = 0xFF;

    /**
     * @notice Get the [0-359] value positional data of a color.
     * @param $color The bitpacked color to extract the hue channel from.
     * @param $index The index of the position in the color.
     * @return $coordinate The [0-359] value of the coordinate.
     */
    function coordinate(
        uint32 $color,
        uint8 $index
    ) public pure returns (uint8 $coordinate) {
        /// @dev Extract a uint9 value from the bitpacked color at a specific
        ///      color index and coordinate position withtin that segment.
        $coordinate = uint8(($color >> ($index * COORD_OFFSET)) & COORD_MASK);
    }

    /**
     * @notice Get the [0-3] value of the speed channel of the color.
     * @param $color The bitpacked color to extract the speed channel from.
     * @return $speed The [0-3] value of the speed channel of the color.
     */
    function speed(uint32 $color) public pure returns (uint8 $speed) {
        $speed = uint8(($color >> SPEED_OFFSET) & SPEED_MASK);
    }

    /**
     * @notice Get the [0-7] value of the color count channel of the color.
     * @param $color The bitpacked color to extract the color count channel from.
     * @return $colorCount The [0-7] value of the color count channel of the color.
     */
    function colorCount(uint32 $color) public pure returns (uint8 $colorCount) {
        $colorCount = uint8(($color >> COLOR_COUNT_OFFSET) & COLOR_COUNT_MASK);
    }

    /**
     * @notice Get the [0-255] value of the bg scalar channel of the color.
     * @dev When the background is set to be transparent, the use of the bg scalar
     *      is ignored and remains as stale state data with only packing validation.
     * @param $color The bitpacked color to extract the bg scalar channel from.
     * @return $bgTransparent `true` if the background is transparent, `false` otherwise.
     */
    function bgTransparent(
        uint32 $color
    ) public pure returns (bool $bgTransparent) {
        $bgTransparent =
            (($color >> BG_TRANSPARENT_OFFSET) & BG_TRANSPARENT_MASK) == 1;
    }

    /**
     * @notice Get the [0-255] value of the bg scalar channel of the color.
     * @dev The bg scalar is a unidirectional color channel that has only mangitude,
     *      and no specific alpha direction. This single value is copied into each
     *      channel of the `rgb` representation of the color.
     * @dev To set a white background, the value for the scalar shuld be a bitpacked `255`
     *      into the Color head. To set a black background, the value for the scalar should
     *      be a bitpacked `0` into the Color head.
     * @param $color The bitpacked color to extract the bg scalar channel from.
     * @return $scalar The [0-255] value of the bg scalar channel of the color.
     */
    function bgScalar(uint32 $color) public pure returns (uint8 $scalar) {
        $scalar = uint8(($color >> BG_SCALAR_OFFSET) & BG_SCALAR_MASK);
    }
}
