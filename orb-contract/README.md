# ⚪ CHANCE Orb Contract

This smart contract repository contains a straightforward ERC-1155 token that enables the creation of **CHANCE** orbs.

As the key to access the **CHANCE** universe, Orbs by default are free to mint. However, the owner of an Orb genealogy may choose to define a maximum supply as well as the price to mint the definition of a respective Orb in the future.

## 🤝 Orb Minting & Ownership

Orbs are an ERC-1155 token built on top of the gas-optimized framework offered by [Solady](https://github.com/Vectorized/solady/). Building on top of this, a typical user has the ability to:

- Mint an Orb that has an active remaining population supply.
- Burn an Orb held.

There are no royalties or taxes of any kind applied to the ownership or sell of Orbs. All goods are immediately transferred to the new owner upon minting or burning and will remain under the absolute ownership of the new owner until actions speak otherwise.

The only way to be removed from populus of an Orb is by removing oneself from the Orb's genealogy. The effects of Digital Diaspora are studied here to understand the implications of providing a system of digital races, ethniticies and cultures with the ability to define their own population.

> Commonly, we refer to protocols built in this manner as `metacols`. Protocols that are yet dependent on internal sparks of growth and life that create a living form of the native protocol that exists by the deployment onto the blockchain.

## 📖 Orb Provenance

At the time of creating a new Orb, the caller has the ability to take ownership of the DNA declared within the definition of the Orb. With defined lineage, the community of users has the ability to take ownership of a respective Orb's DNA and:

- Set the maximum supply that can be minted of this Orb.
- Set the price to mint this Orb.
- Set the time at which no more Orbs of this definition can be minted.
- Set the vault that money is sent to upon minting a paid Orb.

Additionally inside the provenance, the total supply of the Orb is actively tracked at the time of minting and burning. This allows for the community to understand the current population of a respective Orb.

## 🧬 Orb DNA

The DNA of an Orb is a single [bitpacked](https://kinematicsoup.com/news/2016/9/6/data-compression-bit-packing-101) `uint256` that represents a series of 7 rgb colors (`[...,[255,255,255],...]`) and several other pieces of endpoint in a model that makes offchain and onchain decompilation straight forward and consistent in results.

At the simplest level, the token ID of an Orb is a bitpacked `uint256` containing all the genetic information of an Orb. The `uint256` is bitpacked in the following manner:

```tsx
type Color = {
    domain: number;
    r: number;
    g: number;
    b: number;
}

type ColorMap = {
    x: number;
    y: number;
    bgTransparent: boolean;
    bgScalar: number;
    colorCount: number;
    empty: boolean;
    colors: Color[];
}

export const bitpackColor = (colors: number[][], color = 0) => {
    for (let i = 0; i < colors.length; i++) {
        const rgb = colors[i];
        color += rgb[0] << (i * 32);
        color += rgb[1] << (i * 32 + 8);
        color += rgb[2] << (i * 32 + 16);
    }
    
    return color;
}
```

With this, the Orbs foundational DNA is `105312285415975378509298838682582343862109712284319974254555693055`. The creation and implemenation of DNA does not stop here, though. This foundational piece of DNA is then appended with a *head* and fed into the rendering engine of Orbs to create the native visualization of the DNA.

While the visualization here is straightforward, there are onchain enforcement checks to confirm that we only have Orbs of proper genetics. In reality, the definition of a token ID is quite complex and not possible without a script that can encode and decode the DNA of an Orb.

When all comes together, a token ID is created by the bitpacking of:

```python
pos  (18 bits) = | x (9 bits) | y (9 bits) |

top  (32 bits) = | empty (1 bit) | col_count (4 bits) | bg_scalar (9 bits) | pos (18 bits) |

col  (32 bits) = | domain (8 bits) | r (8 bits) | g (8 bits) | b (8 bits) |
dna (224 bits) = | col (32 bits) | col (32 bits) | col (32 bits) | col (32 bits) \
                 | col (32 bits) | col (32 bits) | col (32 bits) |

orb (256 bits) = | top (32 bits) | dna (224 bits) | 

where       0 <= col_count <= 7 
        and 0 <= bg_scalar <= 255 
        and 0 <= domain <= 100 
        and 0 <= x <= 360 
        and 0 <= y <= 360
```

> **Warning**
> If you think you can just mint an Orb and that it will come out looking correct, you are wrong. The amount of data packed into the token ID of an Orb is quite complex and requires a script to encode and decode the DNA of an Orb to even get close to the results you want.

Getting started is simple though and you don't have to get anything running yourself.

Because all the DNA of an Orb is stored within the token ID, digital genealogy is possible even in the event of defects (forks). An ecosystem without native dignitary is an ecosystem that has a chance to be free of the corruption of influencial power.

Still tied to the hardships of the subconcious perception and memory-keeping, Orbs are a natively decentered system focused on abstraction, rather than authenticity or representation of self. Simply, with an eternal reference of defintion, Orbs are one of many visualizations of your digital and physical aura becoming one.

> **Note**
> You can visit [the Orb Rendering Engine](https://sftchance.com/) to see the results of the DNA of an Orb as well as mint it directly from the interface.

With the established DNA of an Orb, the visualization extends beyond just an unclassed visualization and provides supporting written artifacts enabling more complex onchain integrations in JSON as:

```json
{
    "name": "Orb #0",
    "description": "Orb #0 is a unique Orb that is part of the CHANCE Orbs ecosystem.",
    "image": "ipfs://Qm_Orb_0/?id=0",
    "attributes": [
        { 
            "trait_type": "Quadrant",
            "value": "Top Right"
        }
        {
            "trait_type": "Background",
            "value": 100000000
        },
        { 
            "trait_type": "Primary Color",
            "value": "Purple"
        },
        {
            "trait_type": "Secondary Color",
            "value": "White"
        },
        { 
            "trait_type": "Scale Type",
            "value": "Complementary"
        },
        {
            "trait_type": "Color Count",
            "value": 0
        },
        { 
            "trait_type": "Max Suply",
            "value": 100
        },
        { 
            "trait_type": "Total Suply",
            "value": 14
        },
        { 
            "trait_type": "Seconds Left in Mint",
            "value": 500000
        },
        { 
            "trait_type": "Mint Price",
            "value": 100000000000000000
        },
        { 
            "trait_type": "Mint Fee Vault",
            "value": "0x000"
        },
        { 
            "trait_type": "Mint Vault Balance",
            "value": 0
        }
    ]
}
```

When an Orb does not have a value for the relevant field, the field is omitted from the JSON. This allows for the JSON to be as compact as possible while still providing all the relevant information for the Orb and never risking the reflection of a body that does not exist.

## 🖼️ Orb Rendering

The rendering of an Orb is a simple process that takes the DNA of an Orb and renders it into a visual representation of the Orb.

Orbs are eternal to the defintion of Ethereum. The rendering engine is built in a way that allows for the rendering of an Orb to be done onchain or offchain without needing any external dependencies beyond an RPC.

While there is an onchain representation, there is also an available offchain visualization for platforms that do not yet have support for onchain renderings that use SVGs.

## 🏃‍♂️ Running the Project

⚪ CHANCE Orbs were built with [Hardhat](https://hardhat.org/) making it very simple to run the project locally and test everything yourself. To get started, clone [the repository](https://github.com/sftchance/sftchance) and install the dependencies:

```shell
git clone https://github.com/sftchance/sftchance.git && cd sftchance
npm i
```

With your project setup, you can now run the project locally.

> **Warning**
> Confirm that you have prepared the environment variable with your private key before attempting to run a script any network besides `hardhat`.

Running the test suit of the project is as simple as:

```shell
npx hardhat test
REPORT_GAS=true npx hardhat test
```
