import { useState } from 'react'
import { useAccount, useWaitForTransaction } from 'wagmi'
import { zeroAddress } from 'viem';

import {
    usePrepareOrbMint,
    useOrbMint,
} from '../generated'

export function MintNFT() {
    const [tokenId, setTokenId] = useState('')

    const { address } = useAccount();

    const {
        config,
        error: prepareError,
        isError: isPrepareError,
    } = usePrepareOrbMint({
        args: [
            address || zeroAddress,
            BigInt(0),
            1,
            "0x",
        ],
        value: BigInt(0)
    })

    const { data, error, isError, write } = useOrbMint(config)

    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
    })

    return (
        <div>
            <input
                onChange={(e) => setTokenId(e.target.value)}
                placeholder="Token ID (optional)"
                value={tokenId}
            />
            <button disabled={!write || isLoading} onClick={() => write?.()}>
                {isLoading ? 'Minting...' : 'Mint'}
            </button>
            {isSuccess && (
                <div>
                    Successfully minted your NFT!
                    <div>
                        <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
                    </div>
                </div>
            )}
            {(isPrepareError || isError) && (
                <div>Error: {(prepareError || error)?.message}</div>
            )}
        </div>
    )
}
