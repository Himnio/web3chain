import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair } from '@solana/web3.js';
import { Web3chain } from '../target/types/web3chain';

describe('web3chain', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.Web3chain as Program<Web3chain>;

  const web3chainKeypair = Keypair.generate();

  it('Initialize Web3chain', async () => {
    await program.methods
      .initialize()
      .accounts({
        web3chain: web3chainKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([web3chainKeypair])
      .rpc();

    const currentCount = await program.account.web3chain.fetch(
      web3chainKeypair.publicKey
    );

    expect(currentCount.count).toEqual(0);
  });

  it('Increment Web3chain', async () => {
    await program.methods
      .increment()
      .accounts({ web3chain: web3chainKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.web3chain.fetch(
      web3chainKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Increment Web3chain Again', async () => {
    await program.methods
      .increment()
      .accounts({ web3chain: web3chainKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.web3chain.fetch(
      web3chainKeypair.publicKey
    );

    expect(currentCount.count).toEqual(2);
  });

  it('Decrement Web3chain', async () => {
    await program.methods
      .decrement()
      .accounts({ web3chain: web3chainKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.web3chain.fetch(
      web3chainKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Set web3chain value', async () => {
    await program.methods
      .set(42)
      .accounts({ web3chain: web3chainKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.web3chain.fetch(
      web3chainKeypair.publicKey
    );

    expect(currentCount.count).toEqual(42);
  });

  it('Set close the web3chain account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        web3chain: web3chainKeypair.publicKey,
      })
      .rpc();

    // The account should no longer exist, returning null.
    const userAccount = await program.account.web3chain.fetchNullable(
      web3chainKeypair.publicKey
    );
    expect(userAccount).toBeNull();
  });
});
