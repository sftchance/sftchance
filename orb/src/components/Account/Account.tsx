import { useAccount, useEnsName } from "wagmi";

export const Account = () => {
    const { address } = useAccount();

    const { data: ensName } = useEnsName({ address });

    return <>
        {ensName ?? address}
        {ensName ? ` (${address})` : null}
    </>
}