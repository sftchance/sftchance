import { defineConfig } from '@wagmi/cli';
import { react, hardhat } from '@wagmi/cli/plugins';

export default defineConfig({
    out: 'hooks.ts',
    contracts: [

    ],
    plugins: [
        hardhat({
            project: "./"
        }),
        react()
    ],
});
