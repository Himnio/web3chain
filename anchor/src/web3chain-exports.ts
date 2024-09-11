// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import Web3chainIDL from '../target/idl/web3chain.json';
import type { Web3chain } from '../target/types/web3chain';

// Re-export the generated IDL and type
export { Web3chain, Web3chainIDL };

// The programId is imported from the program IDL.
export const WEB3CHAIN_PROGRAM_ID = new PublicKey(Web3chainIDL.address);

// This is a helper function to get the Web3chain Anchor program.
export function getWeb3chainProgram(provider: AnchorProvider) {
  return new Program(Web3chainIDL as Web3chain, provider);
}

// This is a helper function to get the program ID for the Web3chain program depending on the cluster.
export function getWeb3chainProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
    case 'mainnet-beta':
    default:
      return WEB3CHAIN_PROGRAM_ID;
  }
}
