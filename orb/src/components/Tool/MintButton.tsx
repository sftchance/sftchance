import { useAccount, useConnect, useEnsName } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

import { MintButtonProps } from '../../types';

const MintButton = ({ id, onMint }: MintButtonProps) => {
    const { address, isConnected } = useAccount();

    onMint;

    console.log(id);

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
