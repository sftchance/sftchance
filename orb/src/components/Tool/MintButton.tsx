import { useAccount, useConnect, useContractWrite, useEnsName, usePrepareContractWrite } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

import { Color } from '../../types';

const MintButton = ({ colors, onMint }: { colors: Color[]; onMint: () => void }) => {
    const { address, isConnected } = useAccount();

    const { connect } = useConnect({
        connector: new InjectedConnector(),
    });

    const { data: name } = useEnsName({ address });

    const formattedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

    // add rainbowkit

    if (isConnected)
        return (
            <div>
                <button
                    className="mint instant"
                    // onClick={() => {
                    //     write?.();
                    // }}
                    // disabled={!isSuccess}
                >
                    Mint to {name || formattedAddress}
                </button>
            </div>
        );

    return (
        <button className="mint" onClick={() => connect()}>
            Connect Wallet
        </button>
    );
};

export { MintButton };
