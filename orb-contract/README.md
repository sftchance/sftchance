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
- Set the vault that money is sent to upon minting a paid Orb.

Additionally inside the provenance, the total supply of the Orb is actively tracked at the time of minting and burning. This allows for the community to understand the current population of a respective Orb.

## 🧬 Orb DNA

The DNA of an Orb is a `bytes` string containing the color definition of the Orb. To define a new range of colors, the  DNA of an Orb is defined as a `bytes` string of 7 colors.

As the DNA of Orb is never read or built onchain and only ever through reflection of a visual representation, DNA is written in a way that makes frontend decompilation straight forward and consistent in results.

The bytes string is built as:

```javascript
const dna = abiCoder.encode(
    [string, string, string, string, string, string, string],
    [color0, color1, color2, color3, color4, color5, color6]
);
```

This DNA is then fed into the rendering engine of Orbs to create the final DNA output. This DNA can then be decoded both onchain and offchain with the following configurations.

When you are working on a frontend or application using an RPC read, you can decode the results of the DNA with:

```javascript
const dnaBytes = "0x...";

const dna = abiCoder.decode(
    [string, string, string, string, string, string, string],
    dnaBytes
);
```

For instances where the DNA is already onchain, you can decode the DNA in Solidity like:

```solidity
contract Decoder { 
    function decodeDna(bytes memory dna) public pure returns (string[7] memory) {
        return abi.decode(dna, (string[7] memory));
    }
}
```

Of course, the precise implementation of the decoding will depend entirely on your needs and you should not feel constricted to the above examples.

## 🎨 Orb Colors

Inside the DNA, there may be different lengths of values as well as different types of values. However, the Orb Universe does not account for genetic anomalies and will not render any DNA that does not follow the above format.

A color may be defined as a:

- Hexadecimal color code: `#000000`
- RGB color code: `rgb(0, 0, 0)`
- RGBA color code: `rgba(0, 0, 0, 1)`
- HSL color code: `hsl(0, 0%, 0%)`
- HSL color code with alpha: `hsla(0, 0%, 0%, 1)`
- HWB color code: `hwb(0, 0%, 0%)`
- HWB color code with alpha: `hwb(0, 0%, 0%, 1)`
- CSS color name: `black`
- CSS color name with alpha: `black 1`

Given valid configuration, the Orb may be used everywhere throughout the ecosystem.

## 🖼️ Orb Rendering

The rendering of an Orb is a simple process that takes the DNA of an Orb and renders it into a visual representation of the Orb.

The rendering engine is built in a way that allows for the rendering of an Orb to be done onchain or offchain.

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
