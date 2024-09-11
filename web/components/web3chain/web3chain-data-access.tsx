'use client';

import { getWeb3chainProgram, getWeb3chainProgramId } from '@web3chain/anchor';
import { Program } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, Keypair, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';

export function useWeb3chainProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getWeb3chainProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = getWeb3chainProgram(provider);

  const accounts = useQuery({
    queryKey: ['web3chain', 'all', { cluster }],
    queryFn: () => program.account.web3chain.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const initialize = useMutation({
    mutationKey: ['web3chain', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods
        .initialize()
        .accounts({ web3chain: keypair.publicKey })
        .signers([keypair])
        .rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: () => toast.error('Failed to initialize account'),
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  };
}

export function useWeb3chainProgramAccount({
  account,
}: {
  account: PublicKey;
}) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useWeb3chainProgram();

  const accountQuery = useQuery({
    queryKey: ['web3chain', 'fetch', { cluster, account }],
    queryFn: () => program.account.web3chain.fetch(account),
  });

  const closeMutation = useMutation({
    mutationKey: ['web3chain', 'close', { cluster, account }],
    mutationFn: () =>
      program.methods.close().accounts({ web3chain: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accounts.refetch();
    },
  });

  const decrementMutation = useMutation({
    mutationKey: ['web3chain', 'decrement', { cluster, account }],
    mutationFn: () =>
      program.methods.decrement().accounts({ web3chain: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const incrementMutation = useMutation({
    mutationKey: ['web3chain', 'increment', { cluster, account }],
    mutationFn: () =>
      program.methods.increment().accounts({ web3chain: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const setMutation = useMutation({
    mutationKey: ['web3chain', 'set', { cluster, account }],
    mutationFn: (value: number) =>
      program.methods.set(value).accounts({ web3chain: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  };
}
