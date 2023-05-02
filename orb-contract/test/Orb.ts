import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';

import { expect } from 'chai';
import { ethers } from 'hardhat';

import { OnchainColorMap } from '../../orb/src/types';

import { getId, getMap } from '../utils/Color';

const DEFAULT_MAP: OnchainColorMap = {
    x: 360,
    y: 360,
    speed: 3,
    colorCount: 6,
    bgTransparent: false,
    bgScalar: 255,
    colors: [
        { empty: false, domain: 10, r: 255, g: 0, b: 255 },
        { empty: false, domain: 20, r: 255, g: 255, b: 255 },
        { empty: true, domain: 30, r: 255, g: 0, b: 255 },
        { empty: false, domain: 40, r: 255, g: 255, b: 255 },
        { empty: false, domain: 50, r: 255, g: 255, b: 255 },
        { empty: false, domain: 60, r: 255, g: 255, b: 255 },
        { empty: false, domain: 70, r: 0, g: 0, b: 0 },
    ],
};
const DEFAULT_ID = getId(DEFAULT_MAP);

describe('Orb', () => {
    const IPFS_HASH: string = 'Qm';
    const LAYERS: any[] = ['svg_test_layer', 'deeper_svg_test_layer'];

    const deployOrbColorLibraryFixture = async () => {
        const OrbColorLibrary = await ethers.getContractFactory('LibColor');
        const orbColorLibrary = await OrbColorLibrary.deploy();
        await orbColorLibrary.deployed();

        return { orbColorLibrary };
    };

    const deployOrbLibraryFixture = async () => {
        const OrbLibrary = await ethers.getContractFactory('LibOrb');
        const orbLibrary = await OrbLibrary.deploy();
        await orbLibrary.deployed();

        return { orbLibrary };
    };

    const deployOrbRendererFixture = async () => {
        const { orbLibrary } = await loadFixture(deployOrbLibraryFixture);
        const { orbColorLibrary } = await loadFixture(deployOrbColorLibraryFixture);

        const OrbRenderer = await ethers.getContractFactory('OrbRenderer', {
            libraries: {
                LibColor: orbColorLibrary.address,
                LibOrb: orbLibrary.address,
            },
        });

        const ipfsHashBytes = ethers.utils.toUtf8Bytes(IPFS_HASH);

        const orbRenderer = await OrbRenderer.deploy(ipfsHashBytes, LAYERS);
        await orbRenderer.deployed();

        return { orbLibrary, orbColorLibrary, orbRenderer };
    };

    const deployOrbFixture = async () => {
        const { orbLibrary, orbColorLibrary, orbRenderer } = await loadFixture(deployOrbRendererFixture);

        const [deployer] = await ethers.getSigners();

        const Orb = await ethers.getContractFactory('Orb', {
            libraries: {
                LibColor: orbColorLibrary.address,
                LibOrb: orbLibrary.address,
            },
        });

        const orb = await Orb.deploy(orbRenderer.address);
        await orb.deployed();

        return { deployer, orb, orbRenderer };
    };

    describe('Deployment', () => {
        it('Deploys', async () => {
            const { orb } = await loadFixture(deployOrbFixture);

            expect(orb.address).to.not.equal(ethers.constants.AddressZero);
        });

        it('Should get the correct token ID of the color map', async () => {
            const id = getId(DEFAULT_MAP);

            expect(id).to.equal(DEFAULT_ID);

            const _map = getMap(id);
            expect(_map).to.deep.equal(DEFAULT_MAP);
        });

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

            await expect(orb.mint(deployer.address, id, amount, '0x')).to.be.revertedWith('Orb::isValid: no colors');
        });

        it('Should not be able to mint Orb with invalid domain', async () => {
            const { deployer, orb } = await loadFixture(deployOrbFixture);

            const map = JSON.parse(JSON.stringify(DEFAULT_MAP));

            map.colors[5].domain = 0;

            const id = getId(map);

            const amount = 1;

            await expect(orb.mint(deployer.address, id, amount, '0x')).to.be.revertedWith(
                'Orb::isValid: invalid color domain',
            );
        });

        it("Should not be able to mint Orb with invalid color count (doesn't match colors array)", async () => {
            const { deployer, orb } = await loadFixture(deployOrbFixture);

            const map = JSON.parse(JSON.stringify(DEFAULT_MAP));

            map.colorCount = 5;

            const id = getId(map);

            const amount = 1;

            await expect(orb.mint(deployer.address, id, amount, '0x')).to.be.revertedWith(
                'Orb::isValid: invalid color count',
            );
        });

        it('Should be able to mint a valid Orb', async () => {
            const { deployer, orb } = await loadFixture(deployOrbFixture);

            const id = DEFAULT_ID;

            const amount = 1;

            await expect(orb.mint(deployer.address, id, amount, '0x')).to.emit(orb, 'TransferSingle');

            expect(await orb.mint(deployer.address, id, amount, '0x'));

            expect(await orb.balanceOf(deployer.address, id)).to.equal(amount * 2);
        });

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
