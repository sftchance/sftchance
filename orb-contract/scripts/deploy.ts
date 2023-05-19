import { ethers, network, run } from "hardhat";

import { DEFAULT_IPFS_HASH_BYTES, DEFAULT_LAYERS } from "../constants";

async function main() {
    const LibColor = await ethers.getContractFactory("LibColor");
    const libColor = await LibColor.deploy();
    await libColor.deployed();

    console.log(`✅ LibColor deployed to ${libColor.address}`);

    const LibOrb = await ethers.getContractFactory("LibOrb");
    const libOrb = await LibOrb.deploy();
    await libOrb.deployed();

    console.log(`✅ LibOrb deployed to ${libOrb.address}`);

    const OrbRenderer = await ethers.getContractFactory("OrbRenderer", {
        libraries: {
            LibColor: libColor.address,
            LibOrb: libOrb.address,
        },
    });
    const orbRenderer = await OrbRenderer.deploy(DEFAULT_IPFS_HASH_BYTES, DEFAULT_LAYERS);
    await orbRenderer.deployed();

    console.log(`✅ OrbRenderer deployed to ${orbRenderer.address}`);

    const Orb = await ethers.getContractFactory('Orb', {
        libraries: {
            LibColor: libColor.address,
            LibOrb: libOrb.address,
        },
    });
    const orb = await Orb.deploy(orbRenderer.address);
    await orb.deployed();

    console.log(`✅ Orb deployed to ${orb.address}`);

    const chainIdDenotion = network.config.chainId?.toString()?.slice(-4);

    if (chainIdDenotion !== '1337') {
        console.log('Verifying contracts...');
        // Wait a minute for ether/polyscan to index.
        await new Promise((r) => setTimeout(r, 60000));

        await run('verify:verify', {
            address: orb.address,
            constructorArguments: [orbRenderer.address],
        });
        console.log('✅ Orb Verified');

        await run('verify:verify', {
            address: orbRenderer.address,
            constructorArguments: [DEFAULT_IPFS_HASH_BYTES, DEFAULT_LAYERS],
        });
        console.log('✅ OrbRenderer Verified');
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);

    process.exitCode = 1;
});
