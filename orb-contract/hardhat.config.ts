import { HardhatUserConfig } from 'hardhat/config';

import dotenv from 'dotenv';

import '@nomicfoundation/hardhat-toolbox';
import "hardhat-tracer"

dotenv.config();

const PRIVATE_KEY_ACCOUNTS = [process.env.PRIVATE_KEY || ""];

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.18",
        settings: {
            optimizer: {
                enabled: true,
                runs: 2000,
                details: {
                    yul: true,
                    yulDetails: {
                        stackAllocation: true,
                        optimizerSteps: "u"
                    }
                }
            }
        },
    },
    gasReporter: {
        enabled: true,
        currency: 'USD',
        gasPrice: 50,
    },
    typechain: {
        outDir: 'types',
        target: 'ethers-v5',
        alwaysGenerateOverloads: true,
        dontOverrideCompile: false
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
    networks: {
        sepolia: {
            url: process.env.TESTNET_RPC_URL,
            accounts: PRIVATE_KEY_ACCOUNTS,
        },
    }
};

export default config;
