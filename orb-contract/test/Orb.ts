import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs';
import { expect } from 'chai';
import { ethers } from 'hardhat';

type Color = [number, number, number, number];

const getId = (colors: Color[]) => {
    let id = 0;

    for (let i = 0; i < colors.length; i++) {
        const color = colors[i];

        const colorUint32 = (color[0] << 24) | (color[1] << 16) | (color[2] << 8) | color[3];

        id = id << 32;

        id = id | colorUint32;
    }

    return id;
};

describe('Orb', () => {
    const IPFS_HASH: string = 'Qm';
    const LAYERS: any[] = ['svg_test_layer', 'deeper_svg_test_layer'];

    const deployOrbColorLibraryFixture = async () => {
        const OrbColorLibrary = await ethers.getContractFactory('LibColor');
        const orbColorLibrary = await OrbColorLibrary.deploy();
        await orbColorLibrary.deployed();

        return { orbColorLibrary };
    };

    const deployOrbRendererFixture = async () => {
        const { orbColorLibrary } = await loadFixture(deployOrbColorLibraryFixture);

        const OrbRenderer = await ethers.getContractFactory('OrbRenderer', {
            libraries: {
                LibColor: orbColorLibrary.address,
            },
        });

        const ipfsHashBytes = ethers.utils.toUtf8Bytes(IPFS_HASH);

        const orbRenderer = await OrbRenderer.deploy(ipfsHashBytes, LAYERS);
        await orbRenderer.deployed();

        return { orbRenderer };
    };

    const deployOrbFixture = async () => {
        const { orbRenderer } = await loadFixture(deployOrbRendererFixture);

        const [deployer] = await ethers.getSigners();

        const Orb = await ethers.getContractFactory('Orb', {
            libraries: {
                LibColor: orbRenderer.address,
            },
        });

        const orb = await Orb.deploy(orbRenderer.address);
        await orb.deployed();

        return { deployer, orb, orbRenderer };
    };

    describe('Deployment', () => {
        it('Should set the right IPFS hash', async () => {
            const { orbRenderer } = await loadFixture(deployOrbRendererFixture);

            const ipfsHash = ethers.utils.toUtf8String(await orbRenderer.ipfsHashBytes());

            expect(ipfsHash).to.equal(IPFS_HASH);
        });

        it('Should set the right layers', async () => {
            const { orbRenderer } = await loadFixture(deployOrbRendererFixture);

            expect(await orbRenderer.layers(0)).to.equal(LAYERS[0]);
            expect(await orbRenderer.layers(1)).to.equal(LAYERS[1]);
        });

        it('Should set the right deployer', async () => {
            const { deployer, orb } = await loadFixture(deployOrbFixture);

            expect(await orb.deployer()).to.equal(deployer.address);
        });

        it('Should set the right orbRenderer', async () => {
            const { orb, orbRenderer } = await loadFixture(deployOrbFixture);

            expect(await orb.renderer()).to.equal(orbRenderer.address);
        });
    });

    describe('Loading, Minting and Burning', () => {
        it('Should not be able to mint Orb with invalid colors', async () => {
            const { deployer, orb } = await loadFixture(deployOrbFixture);

            const id = 0;
            const amount = 1;

            await expect(orb.mint(deployer.address, id, amount, '0x')).to.be.revertedWith(
                'Orb::onlyValidID: no colors',
            );
        });

        it('Should not be able to mint Orb with invalid domain', async () => {
            const { deployer, orb } = await loadFixture(deployOrbFixture);

            const colors: Color[] = [
                [0, 255, 255, 255],
                [100, 0, 0, 0],
            ];

            const id = getId(colors);
            console.log(id);

            // const amount = 1;

            // await expect(orb.mint(deployer.address, id, amount, colors)).to.be.revertedWith(
            //     'Orb::onlyValidID: invalid domain',
            // );
        });

        // TODO: Test invalid domain use

        // TODO: Test valid mint
        // TODO: Test IPFS uri

        // TODO: Test load failure due to vault mismatch
        // TODO: Test maxSupply failure
        // TODO: Test closure failure
        // TODO: Test load failure due to lacking balance
        // TODO: ETH transfer failure
    });

    describe('Forking', () => {});

    describe('Forfeit', () => {});

    // TODO: Test art generation
});
