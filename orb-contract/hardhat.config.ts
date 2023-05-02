import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

// Accounts task
// Deployment task

const config: HardhatUserConfig = {
    solidity: {
        compilers: [
            {
                version: '0.8.18',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 100000000,
                    },
                },
            },
        ],
    },
    gasReporter: {
        enabled: true,
        currency: 'USD',
        gasPrice: 50,
    },
};

export default config;
