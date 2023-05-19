import { HardhatUserConfig } from 'hardhat/config';

import '@nomicfoundation/hardhat-toolbox';
import "hardhat-tracer"

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
};

export default config;
