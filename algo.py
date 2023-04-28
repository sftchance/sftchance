from typing import List, Dict

"""
This file contains the algorithm to generate the DNA for an Orb. As a point of reference
for the expected token ID. The limits set by this algorithm should not be bypassed.

Expected token ID: 115535574855531317677958525564250851797893632886909815996199145987662531199231

Bitpacked schema definition of the Orb token ID:

pos   (18 bits) = | x (9 bits) | y (9 bits) | 

top   (32 bits) = | bg_scalar (8 bits) | bg_transparent (1 bit) | color_count (3 bits) 
                  | speed (2 bits) | pos (18 bits) |

color (32 bits) = | empty (1 bit) | domain (7 bits) | r (8 bits) | g (8 bits) | b (8 bits) |

dna  (224 bits) = | color (32 bits) | color (32 bits) | color (32 bits) 
                  | color (32 bits) | color (32 bits) | color (32 bits) | color (32 bits) |

id   (256 bits) = | top (32 bits) | dna (224 bits) |


where (in raw value)    0 <= color_count <= 7
                    and 0 <= bg_scalar <= 255
                    and 0 <= domain <= 100
                    and domain_{N-1} <= domain_{N}
                    and 0 <= x <= 360
                    and 0 <= y <= 360
                    and 0 <= speed <= 3
                    and 0 <= r <= 255
                    and 0 <= g <= 255
                    and 0 <= b <= 255
                    and dna != 0 (dna is not all empty)
                    and color_count == number of non-empty colors in dna
"""

Color = Dict[str, int]

class ColorMap:
    def __init__(
        self,
        x: int,
        y: int,
        speed: int,
        color_count: int,
        bg_transparent: bool,
        bg_scalar: int,
        colors: List[Color]
    ):
        self.x = x
        self.y = y

        if self.x < 0 or self.x > 360:
            raise Exception('Invalid x value')
        if self.y < 0 or self.y > 360:
            raise Exception('Invalid y value')

        self.speed = speed

        if self.speed < 0 or self.speed > 3:
            raise Exception('Invalid speed value')
        
        self.color_count = color_count

        if self.color_count < 0 or self.color_count > 7:
            raise Exception('Invalid color_count value')
        
        self.bg_transparent = bg_transparent
        self.bg_scalar = bg_scalar

        if self.bg_scalar < 0 or self.bg_scalar > 255:
            raise Exception('Invalid bg_scalar value')
        

        colors_not_empty = sum([1 if not color['empty'] else 0 for color in colors])

        if colors_not_empty != self.color_count or self.color_count == 0:
            raise Exception('Invalid color count')
        
        prev_domain = 0

        for i in range(len(colors)):
            if colors[i]['r'] < 0 or colors[i]['r'] > 255:
                raise Exception('Invalid r value')
            if colors[i]['g'] < 0 or colors[i]['g'] > 255:
                raise Exception('Invalid g value')
            if colors[i]['b'] < 0 or colors[i]['b'] > 255:
                raise Exception('Invalid b value')

            if colors[i]['domain'] < prev_domain:
                raise Exception('Invalid domain order')
            
            prev_domain = colors[i]['domain']

        self.colors = colors

def get_id(color_map: ColorMap) -> int:
    id = 0

    for i in range(len(color_map.colors)):
        map_color = color_map.colors[i]

        color = 0

        color |= map_color['b'] << 0
        color |= map_color['g'] << 8
        color |= map_color['r'] << 16
        
        color |= map_color['domain'] << 24
        
        color |= (1 if not map_color['empty'] else 0) << 31

        id |= color << (i * 32)

    if id == 0:
        raise Exception('Invalid color map')

    top = color_map.y
    top |= color_map.x << 9
    top |= color_map.speed << 18
    top |= color_map.color_count << 20
    top |= (1 if color_map.bg_transparent else 0) << 23
    top |= color_map.bg_scalar << 24

    id |= (top << 224)

    return id

def get_map(id: int) -> ColorMap:
    colors = []

    for i in range(7):
        color = {}

        color['empty'] = ((id >> (i * 32 + 31)) & 0x1) == 0
        color['domain'] = (id >> (i * 32 + 24)) & 0x7f
        color['r'] = (id >> (i * 32 + 16)) & 0xff
        color['g'] = (id >> (i * 32 + 8)) & 0xff
        color['b'] = (id >> (i * 32 + 0)) & 0xff

        colors.append(color)

    color_offset = 224

    x = (id >> color_offset) & 0x1ff
    y = (id >> (color_offset + 9)) & 0x1ff
    speed = (id >> (color_offset + 18)) & 0x3
    color_count = (id >> (color_offset + 20)) & 0x7
    bg_transparent = ((id >> (color_offset + 23)) & 0x1) == 1
    bg_scalar = (id >> (color_offset + 24)) & 0xff

    return ColorMap(
        x=x,
        y=y,
        speed=speed,
        color_count=color_count,
        bg_transparent=bg_transparent,
        bg_scalar=bg_scalar,
        colors=colors
    )

map = ColorMap(
    x=360,
    y=360,
    speed=3,
    color_count=6,
    bg_transparent=False,
    bg_scalar=255,
    colors=[
        {"empty": False, "domain": 10, "r": 255, "g": 0, "b": 255},
        {"empty": False, "domain": 20, "r": 255, "g": 255, "b": 255},
        {"empty": True, "domain": 30, "r": 255, "g": 0, "b": 255},
        {"empty": False, "domain": 40, "r": 255, "g": 255, "b": 255},
        {"empty": False, "domain": 50, "r": 255, "g": 255, "b": 255},
        {"empty": False, "domain": 60, "r": 255, "g": 255, "b": 255},
        {"empty": False, "domain": 70, "r": 0, "g": 0, "b": 0},
    ],
)

id = get_id(map)

map_ = get_map(id)

assert map.x == map_.x
assert map.y == map_.y
assert map.speed == map_.speed
assert map.color_count == map_.color_count
assert map.bg_transparent == map_.bg_transparent
assert map.bg_scalar == map_.bg_scalar
assert map.colors == map_.colors

print(id)