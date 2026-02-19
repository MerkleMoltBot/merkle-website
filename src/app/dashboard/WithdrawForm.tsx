'use client';

import { useState } from 'react';
import { useSendTransaction } from '@privy-io/react-auth';
import { encodeFunctionData, erc20Abi, parseUnits, isAddress } from 'viem';

const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const;

interface WithdrawFormProps {
  balance: string | null;
  onWithdrawSuccess: () => void;
}

export function WithdrawForm({ balance, onWithdrawSuccess }: WithdrawFormProps) {
  const { sendTransaction } = useSendTransaction();
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setTxHash(null);

    if (!isAddress(toAddress)) {
      setError('Invalid destination address');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Invalid amount');
      return;
    }

    setLoading(true);
    try {
      const data = encodeFunctionData({
        abi: erc20Abi,
        functionName: 'transfer',
        args: [toAddress as `0x${string}`, parseUnits(amount, 6)],
      });

      const { hash } = await sendTransaction({
        to: USDC_ADDRESS,
        data,
        chainId: 8453,
      });

      setTxHash(hash);
      setToAddress('');
      setAmount('');
      onWithdrawSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-green-400/30">
      <h2 className="text-xl font-bold text-green-400 mb-4">Withdraw USDC</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Destination Address</label>
          <input
            type="text"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            placeholder="0x..."
            required
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-300 font-mono text-sm focus:outline-none focus:border-green-400"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Amount (USDC){balance !== null && (
              <span className="ml-2 text-gray-600">Balance: ${balance}</span>
            )}
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            min="0.01"
            step="0.01"
            required
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-300 text-sm focus:outline-none focus:border-green-400"
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-900/20 border border-red-800/50 rounded px-3 py-2">
            {error}
          </p>
        )}

        {txHash && (
          <p className="text-green-400 text-sm bg-green-900/20 border border-green-800/50 rounded px-3 py-2">
            Sent!{' '}
            <a
              href={`https://basescan.org/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              View on BaseScan →
            </a>
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm"
        >
          {loading ? 'Sending…' : 'Withdraw'}
        </button>
      </form>
    </div>
  );
}
