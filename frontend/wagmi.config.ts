import { defineConfig, loadEnv } from '@wagmi/cli'
import { etherscan, react } from '@wagmi/cli/plugins'
import * as chains from 'wagmi/chains'

export default defineConfig(() => {
    const env = loadEnv({
        mode: process.env.NODE_ENV,
        envDir: process.cwd(),
    })
    return {
        out: 'src/generated.ts',
        contracts: [],
        plugins: [
            etherscan({
                apiKey: env.ETHERSCAN_API_KEY!,
                chainId: chains.goerli.id,
                contracts: [
                    {
                        name: 'Orb',
                        address: {
                            [chains.goerli.id]: '0x4B2c68B20AA9D1EDb35826E380B018c1702b1213',
                        },
                    }, {
                        name: 'OrbRenderer',
                        address: {
                            [chains.goerli.id]: '0xB467D6619e6895Df95A56e2164C7596Cd09B1E70',
                        },
                    }
                ],
            }),
            react(),
        ],
    }
})
