import { ethers, network, run } from "hardhat";

import { MultiBar } from "cli-progress";

import { DEFAULT_IPFS_HASH_BYTES, DEFAULT_LAYERS } from "../constants";

async function main() {
    const chainIdDenotion = network.config.chainId?.toString()?.slice(-4);

    const needsVerification = chainIdDenotion !== '1337';

    const progressBar = new MultiBar({
        format: '{action}... |' + '{bar}' + '| {percentage}% || {value}/{total} steps',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true,
    });

    const orbRendererDeployment = progressBar.create(2, 0, { action: 'Deploying OrbRenderer' });
    const orbDeployment = progressBar.create(2, 0, { action: 'Deploying Orb' });
    const blockExplorerVerification = progressBar.create(62, 0, { action: 'Verifying on Block Explorer' });

    const OrbRenderer = await ethers.getContractFactory("OrbRenderer");
    const orbRenderer = await OrbRenderer.deploy(DEFAULT_IPFS_HASH_BYTES, DEFAULT_LAYERS);

    orbRendererDeployment.increment();

    await orbRenderer.deployed();

    orbRendererDeployment.increment();

    const Orb = await ethers.getContractFactory('Orb');
    const orb = await Orb.deploy(orbRenderer.address);

    orbDeployment.increment();

    await orb.deployed();

    orbDeployment.increment();

    if (needsVerification) {
        for (let i = 0; i < 60; i++) {
            blockExplorerVerification.increment();

            await new Promise((r) => setTimeout(r, 1000));
        }

        try {
            await run('verify:verify', {
                address: orb.address,
                constructorArguments: [orbRenderer.address],
            });
        } catch (error) {
            console.error(error);
        }

        blockExplorerVerification.increment();

        try {
            await run('verify:verify', {
                address: orbRenderer.address,
                constructorArguments: [DEFAULT_IPFS_HASH_BYTES, DEFAULT_LAYERS],
            });
        } catch (error) {
            console.error(error);
        }

        blockExplorerVerification.increment();
    }

    progressBar.stop();

    return {
        orbRenderer,
        orb,
    };
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);

        process.exitCode = 1;
    });
