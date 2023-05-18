import { HardhatUserConfig } from 'hardhat/config';

import '@nomicfoundation/hardhat-toolbox';
import "hardhat-tracer"

// Accounts task
// Deployment task

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
};

export default config;
