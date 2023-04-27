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

The DNA of an Orb is a single bitpacked `uint256` that represents a series of 7 rgb colors and is written in a way that makes offchain and onchain decompilation straight forward and consistent in results.

The `uint256` is bitpacked in the following manner:

```tsx
export const bitpackColor = (colors: number[][], color = 0) => {
    for (let i = 0; i < colors.length; i++) {
        const rgb = colors[i];
        color += rgb[0] << (i * 32);
        color += rgb[1] << (i * 32 + 8);
        color += rgb[2] << (i * 32 + 16);
    }
    
    return color;
}
    
export const recoverColor = (color: number, length: number, colors: number[][] = []) => {
    for (let i = length; i > -1; i--) {
        colors.push([
            color >> (i * 32) & 0xFF,
            color >> (i * 32 + 8) & 0xFF,
            color >> (i * 32 + 16) & 0xFF
        ]);
    }
    
    return colors;
}
```

With this, to load the Orb the DNA is instantiate as `105312285415975378509298838682582343862109712284319974254555693055`. This DNA is then fed into the rendering engine of Orbs to create the native visualization of the DNA.

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