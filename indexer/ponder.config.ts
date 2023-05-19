import type { PonderConfig } from "@ponder/core";

export const config: PonderConfig = {
  networks: [
    {
      name: "sepolia",
      chainId: 11155111,
      rpcUrl: process.env.PONDER_RPC_URL_11155111,
    },
  ],
  contracts: [
    {
      name: "Orb",
      network: "sepolia",
      abi: "./abis/Orb.json",
      address: "0xeaD3D725150B99E64D7AF93a0465c5C2e919D1c6",
      startBlock: 3518820,
    },
  ],
};
