import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';

import { expect } from 'chai';
import { ethers } from 'hardhat';

import { OnchainColorMap } from '../../orb/src/types';

import { getId, getMap, getPackedMaxSupply, getPackedPrice } from '../utils/Color';

const DEFAULT_MAP: OnchainColorMap = {
    x: 1,
    y: 35,
    speed: 2,
    bgTransparent: false,
    bgScalar: 255,
    colors: [
        { empty: false, domain: 10, r: 255, g: 0, b: 255 },
        { empty: false, domain: 20, r: 255, g: 255, b: 255 },
        { empty: false, domain: 30, r: 255, g: 0, b: 255 },
        { empty: true, domain: 40, r: 255, g: 255, b: 255 },
        { empty: false, domain: 50, r: 255, g: 255, b: 255 },
        { empty: false, domain: 60, r: 255, g: 255, b: 255 },
        { empty: false, domain: 70, r: 0, g: 0, b: 0 },
    ],
    colorCount: 6,
};

DEFAULT_MAP.colorCount = DEFAULT_MAP.colors.filter(c => !c.empty).length;

const DEFAULT_ID = getId(DEFAULT_MAP);

const DEFAULT_ATTRIBUTES = [
    { trait_type: 'Coordinates', value: `(${DEFAULT_MAP.x}, ${DEFAULT_MAP.y})` },
    { display_type: 'number', trait_type: 'Speed', value: DEFAULT_MAP.speed },
    { display_type: 'number', trait_type: 'Colors', value: DEFAULT_MAP.colorCount },
    { trait_type: 'Background', value: '#FFFFFF' },
    { trait_type: 'Color #1', value: '#FF00FF:10' },
    { trait_type: 'Color #2', value: '#FFFFFF:20' },
    { trait_type: 'Color #3', value: '#FF00FF:30' },
    { trait_type: 'Color #5', value: '#FFFFFF:50' },
    { trait_type: 'Color #6', value: '#FFFFFF:60' },
    { trait_type: 'Color #7', value: '#000000:70' }
]

const HEAD_STR = 's cubic-bezier(.42,0,.58,1) infinite blur}.o{mix-blend-mode:overlay}.s{mix-blend-mode:screen}@keyframes blur{0%,100%{filter:blur(10px) brightness(1.1) saturate(1.1);-webkit-filter:blur(10px) brightness(1.1) saturate(1.1);-moz-filter:blur(10px) brightness(1.1) saturate(1.1);-o-filter:blur(10px) brightness(1.1) saturate(1.1);-ms-filter:blur(10px) brightness(1.1) saturate(1.1)}50%{filter:blur(40px) brightness(1.5) saturate(1.3);-webkit-filter:blur(40px) brightness(1.5) saturate(1.3);-moz-filter:blur(40px) brightness(1.5) saturate(1.3);-o-filter:blur(40px) brightness(1.5) saturate(1.3);-ms-filter:blur(40px) brightness(1.5) saturate(1.3)}}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}</style><defs>';

const NOISE_FILTER_STR = '<stop offset="0%" stop-color="#000" stop-opacity="0"/><stop offset="15%" stop-color="#000" stop-opacity=".1"/><stop offset="30%" stop-color="#000" stop-opacity=".2"/><stop offset="70%" stop-color="#000" stop-opacity=".3"/><stop offset="85%" stop-color="#000" stop-opacity=".85"/><stop offset="97%" stop-color="#000" stop-opacity=".95"/><stop offset="100%" stop-color="#000" stop-opacity="1"/></radialGradient><filter id="ogn"><feTurbulence type="turbulence" baseFrequency=".95" numOctaves="5" '

const FILTER_STR = 'stitchTiles="stitch" x="0%" y="0%" result="turbulence"></feTurbulence><feSpecularLighting surfaceScale="9" specularConstant="2.1" specularExponent="10" lightingColor="#fff" in="turbulence" result="specularLighting"><feDistantLight azimuth="3" elevation="50"></feDistantLight></feSpecularLighting></filter><filter id="t"><feTurbulence type="fractalNoise" baseFrequency=".015" result="noise" numOctaves="5" /><feDiffuseLighting in="noise" lightingColor="#fff" surfaceScale="5"><feDistantLight azimuth="1000" elevation="10" /></feDiffuseLighting></filter></defs>';

const CIRCLE_STR = '<g class="f"><circle cx="50%" cy="50%" r="215" fill="url(#og)" transform="rotate(100)" transform-origin="center" class="b" /><circle cx="300" cy="300" r="200" fill="url(#og)" transform="rotate(100)" transform-origin="center" /><mask id="ognm"><circle cx="300" cy="300" r="200" fill="#fff" /></mask><circle cx="300" cy="300" r="200" filter="url(#t)" mask="url(#ognm)" transform="rotate(15)" opacity="0.15" transform-origin="center" class="o" />';

const DEFAULT_NOISE_STR = '<rect width="200%" height="200%" filter="url(#ogn)" opacity=".4" mask="url(#ognm)" class="o"></rect><rect width="200%" height="200%" filter="url(#ogn)" transform="rotate(-15) scale(.98)" transform-origin="center" opacity=".4" mask="url(#ognm)" class="o"></rect><rect width="200%" height="200%" filter="url(#ogn)" transform="rotate(-30) scale(.99)" transform-origin="center" opacity=".4" mask="url(#ognm)" class="o"></rect><rect width="200%" height="200%" filter="url(#ogn)" transform="rotate(-45) scale(.97)" transform-origin="center" opacity=".4" mask="url(#ognm)" class="o"></rect><rect width="200%" height="200%" filter="url(#ogn)" transform="rotate(-60) scale(1.0)" transform-origin="center" opacity=".4" mask="url(#ognm)" class="o"></rect>';

const DEFAULT_SHADOW_STR = '<circle cx="300" cy="300" r="200" filter="url(#t)" mask="url(#ognm)" opacity="0.25" transform-origin="center" class="s" /><circle cx="300" cy="300" r="200" fill="url(#ogs)" transform="rotate(100)" transform-origin="center" class="o" /></g>';

const LAYERS: string[] = [
    HEAD_STR,
    NOISE_FILTER_STR,
    FILTER_STR,
    CIRCLE_STR + DEFAULT_NOISE_STR + DEFAULT_SHADOW_STR,
]

describe('Orb', () => {
    const IPFS_HASH: string = 'Qm';

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
            expect(ipfsHash).to.equal(IPFS_HASH);
        });

        it('Should set the right layers', async () => {
            const { orbRenderer } = await loadFixture(deployOrbRendererFixture);

            expect(await orbRenderer.layers(0)).to.equal(LAYERS[0]);
            expect(await orbRenderer.layers(1)).to.equal(LAYERS[1]);
            expect(await orbRenderer.layers(2)).to.equal(LAYERS[2]);
            expect(await orbRenderer.layers(3)).to.equal(LAYERS[3]);
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

            expect(metadata['external_url']).to.equal(`ipfs://${IPFS_HASH}/?id=${id}`)

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

            // provenance.vault = mock.address;

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
