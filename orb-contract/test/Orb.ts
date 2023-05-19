import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';

import { expect } from 'chai';
import { ethers } from 'hardhat';

import { DEFAULT_ATTRIBUTES, DEFAULT_ID, DEFAULT_LAYERS, DEFAULT_MAP } from "../constants";

import { getId, getMap, getPackedMaxSupply, getPackedPrice } from '../utils';

describe('Orb', () => {
    const DEFAULT_IPFS_HASH_BYTES: string = 'Qm';

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

        const ipfsHashBytes = ethers.utils.toUtf8Bytes(DEFAULT_IPFS_HASH_BYTES);

        const orbRenderer = await OrbRenderer.deploy(ipfsHashBytes, DEFAULT_LAYERS);
        await orbRenderer.deployed();

        return { orbLibrary, orbColorLibrary, orbRenderer };
    };

    const deployOrbFixture = async () => {
        const { orbLibrary, orbColorLibrary, orbRenderer } = await loadFixture(deployOrbRendererFixture);

        const [deployer, otherAccount] = await ethers.getSigners();

        const Orb = await ethers.getContractFactory('Orb', {
            libraries: {
                LibColor: orbColorLibrary.address,
                LibOrb: orbLibrary.address,
            },
        });

        const orb = await Orb.deploy(orbRenderer.address);
        await orb.deployed();

        return { deployer, otherAccount, orb, orbRenderer };
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
            expect(ipfsHash).to.equal(DEFAULT_IPFS_HASH_BYTES);
        });

        it('Should set the right DEFAULT_LAYERS', async () => {
            const { orbRenderer } = await loadFixture(deployOrbRendererFixture);

            expect(await orbRenderer.layers(0)).to.equal(DEFAULT_LAYERS[0]);
            expect(await orbRenderer.layers(1)).to.equal(DEFAULT_LAYERS[1]);
            expect(await orbRenderer.layers(2)).to.equal(DEFAULT_LAYERS[2]);
            expect(await orbRenderer.layers(3)).to.equal(DEFAULT_LAYERS[3]);
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

        it("Should not be able to mint Orb with coordinates higher than polar coordinates", async () => {
            const { deployer, orb } = await loadFixture(deployOrbFixture);

            const _map = DEFAULT_MAP;

            _map.x = 361;
            _map.y = 361;

            const map = JSON.parse(JSON.stringify(_map));

            const id = getId(map);

            const amount = 1;

            await expect(orb.mint(deployer.address, id, amount, '0x')).to.be.revertedWith(
                'Orb::isValid: invalid gradient coordinates',
            );
        });

        it('Should be able to mint a valid Orb', async () => {
            const { deployer, orb } = await loadFixture(deployOrbFixture);

            const id = DEFAULT_ID;

            const amount = 1;

            await expect(orb.mint(deployer.address, id, amount, '0x')).to.emit(orb, 'TransferSingle');

            expect(await orb.mint(deployer.address, id, amount, '0x'));

            expect(await orb.balanceOf(deployer.address, id)).to.equal(amount * 2);

            const metadata = JSON.parse(Buffer.from((await orb.uri(id)).split(',')[1], 'base64').toString('ascii'));

            expect(metadata['name']).to.equal(`Orb #${id}`);

            expect(metadata['attributes']).to.deep.equal(DEFAULT_ATTRIBUTES);

            expect(metadata['external_url']).to.equal(`ipfs://${DEFAULT_IPFS_HASH_BYTES}/?id=${id}`)

            await expect(orb.uri(999999)).to.be.revertedWith('Orb::isValid: invalid color domain');
        });

        it("Should load after minting", async () => {
            const { deployer, otherAccount, orb } = await loadFixture(deployOrbFixture);

            const id = DEFAULT_ID;

            const amount = 1;

            await expect(orb.mint(deployer.address, id, amount, '0x')).to.emit(orb, 'TransferSingle');

            const provenance = {
                maxSupply: getPackedMaxSupply({ supply: 2n, power: 2n }),
                price: 0,
                totalSupply: 0,
                closure: 0,
                vault: deployer.address,
            }

            await expect(orb.connect(otherAccount).load(id, provenance)).to.be.revertedWith("Orb::load: invalid vault configuration")

            await expect(orb.load(id, provenance)).to.emit(orb, 'Load');

            await expect(orb.load(999999, provenance)).to.be.revertedWith('Orb::isValid: invalid color domain');

            await expect(orb.connect(otherAccount).load(id, provenance)).to.be.revertedWith('Orb::load: invalid vault configuration');

            await expect(orb.load(id, provenance)).to.emit(orb, 'Load');
        });

        it("Should load and hit deep-branch checks", async () => {
            const { deployer, orb } = await loadFixture(deployOrbFixture);

            const id = DEFAULT_ID;

            const amount = 5;

            await expect(orb.mint(deployer.address, id, amount, '0x')).to.emit(orb, 'TransferSingle');

            expect(await orb.balanceOf(deployer.address, id)).to.equal(amount);

            let provenance = {
                maxSupply: 2,
                price: 0,
                totalSupply: 0,
                closure: 0,
                vault: deployer.address,
            }

            let closure = 1;

            await expect(orb.load(id, provenance)).to.be.revertedWith("Orb::load: invalid max supply configuration")

            provenance = {
                maxSupply: 0,
                price: 0,
                totalSupply: 0,
                closure,
                vault: deployer.address,
            }

            await expect(orb.load(id, provenance)).to.be.revertedWith("Orb::load: invalid closure configuration")

            provenance.closure = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;

            expect(await orb.load(id, provenance))

            provenance.closure = (Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60) + 10

            expect(await orb.load(id, provenance))

            provenance.closure = 1;

            await expect(orb.load(id, provenance)).to.be.revertedWith("Orb::load: invalid closure configuration")
        });

        it("Should load and hit bitpacked checks", async () => {
            const { deployer, orb } = await loadFixture(deployOrbFixture);

            const id = DEFAULT_ID;

            const amount = 5;

            await expect(orb.mint(deployer.address, id, amount, '0x')).to.emit(orb, 'TransferSingle');

            expect(await orb.balanceOf(deployer.address, id)).to.equal(amount);

            let provenance = {
                maxSupply: getPackedMaxSupply({ supply: 2n, power: 3n }),
                price: getPackedPrice({ base: 1n, decimals: 18n }),
                totalSupply: 0,
                closure: 0,
                vault: deployer.address,
            }

            await expect(orb.load(id, provenance, { value: 1 })).to.be.revertedWith("Orb::load: invalid funding")

            await expect(orb.load(id, provenance, { value: ethers.utils.parseEther('1') })).to.emit(orb, 'Load');

            await expect(orb.forfeit(id)).to.emit(orb, 'Forfeit');
        });

        it("Should load and hit price checks but fail due to invalid vault", async () => {
            const { deployer, otherAccount, orb } = await loadFixture(deployOrbFixture);

            const id = DEFAULT_ID;

            const amount = 5;

            await expect(orb.mint(deployer.address, id, amount, '0x')).to.emit(orb, 'TransferSingle');

            expect(await orb.balanceOf(deployer.address, id)).to.equal(amount);

            let provenance = {
                maxSupply: getPackedMaxSupply({ supply: 2n, power: 3n }),
                price: getPackedPrice({ base: 1n, decimals: 18n }),
                totalSupply: 0,
                closure: 0,
                vault: otherAccount.address,
            }

            await expect(orb.load(id, provenance, { value: 1 })).to.be.revertedWith("Orb::load: invalid funding")
        })
    });

    describe('Forking', () => {
        it("Should fork and forfeit a valid Orb", async () => {
            const { deployer, otherAccount, orb } = await loadFixture(deployOrbFixture);

            const _map = DEFAULT_MAP;

            _map.x = 1;
            _map.y = 35;
            _map.bgTransparent = true;

            const newId = getId(_map);

            const newMap = getMap(newId);

            expect(newMap).to.deep.equal(_map);

            await expect(orb.mint(deployer.address, newId, 1, '0x')).to.emit(orb, 'TransferSingle');

            let provenance = {
                maxSupply: getPackedMaxSupply({ supply: 2n, power: 3n }),
                price: 0n,
                totalSupply: 0,
                closure: 0,
                vault: otherAccount.address,
            }

            await expect(orb.fork(99999, newId, provenance)).to.be.revertedWith('Orb::isValid: invalid color domain');

            await expect(orb.fork(newId, newId, provenance)).to.be.revertedWith("Orb::load: forked provenance is same as new");

            await expect(orb.mint(deployer.address, DEFAULT_ID, 1, '0x')).to.emit(orb, 'TransferSingle');

            await expect(orb.fork(DEFAULT_ID, newId, provenance)).to.emit(orb, 'Fork');

            await expect(orb.mint(deployer.address, newId, 1, '0x')).to.emit(orb, 'TransferSingle');

            await expect(orb.mint(deployer.address, newId, 20, '0x')).to.be.revertedWith("Orb::mint: totalSupply exceeded")

            _map.x = 2
            _map.bgTransparent = true;

            const forkedId = getId(_map);

            await expect(orb.fork(forkedId, newId, provenance)).to.be.revertedWith('Orb::load: forked provenance not found');

            await expect(orb.mint(deployer.address, forkedId, 1, '0x')).to.emit(orb, 'TransferSingle');

            expect(await orb.uri(forkedId));

            await expect(orb.forfeit(newId)).to.be.revertedWith('Orb::forfeit: invalid caller');

            provenance.price = getPackedPrice({ base: 1n, decimals: 18n });

            await expect(orb.connect(otherAccount).load(newId, provenance, { value: ethers.utils.parseEther('1') })).to.emit(orb, 'Load');

            await expect(orb.mint(deployer.address, newId, 1, '0x', { value: ethers.utils.parseEther('1') })).to.emit(orb, 'TransferSingle');

            await expect(orb.mint(deployer.address, newId, 1, '0x', { value: 1 })).to.be.revertedWith("Orb::mint: invalid funding")

            await expect(orb.connect(otherAccount).load(newId, provenance)).to.emit(orb, 'Load');

            const originalBalance = await ethers.provider.getBalance(otherAccount.address);

            await expect(orb.mint(deployer.address, newId, 1, '0x', { value: ethers.utils.parseEther('1') })).to.emit(orb, 'TransferSingle');

            const newBalance = await ethers.provider.getBalance(otherAccount.address);

            expect(newBalance.sub(originalBalance)).to.equal(ethers.utils.parseEther('1'));

            await expect(orb.burn(newId, 1)).to.emit(orb, 'TransferSingle');

            expect(await orb.withdraw())
        });
    });
});

