'use client';

import { useState } from 'react';

interface WalletCardProps {
  walletAddress: string | null;
  balance: string | null;
}

export function WalletCard({ walletAddress, balance }: WalletCardProps) {
  const [copied, setCopied] = useState(false);

  function copyAddress() {
    if (!walletAddress) return;
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!walletAddress) {
    return (
      <div className="bg-gray-800/50 p-6 rounded-lg border border-green-400/30">
        <h2 className="text-xl font-bold text-green-400 mb-2">Wallet</h2>
        <p className="text-gray-400 text-sm">
          No wallet found. Mention{' '}
          <span className="text-green-400">@MerkleMoltBot</span> on 𝕏 to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-green-400/30">
      <h2 className="text-xl font-bold text-green-400 mb-4">Wallet</h2>
      <div className="space-y-3">
        <div>
          <p className="text-xs text-gray-500 mb-1">Address</p>
          <div className="flex items-center gap-2">
            <p
              className="text-gray-300 font-mono text-sm"
              title={walletAddress}
            >
              {walletAddress.slice(0, 6)}…{walletAddress.slice(-4)}
            </p>
            <button
              onClick={copyAddress}
              className="shrink-0 text-xs text-green-400 hover:text-green-300 transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <a
            href={`https://basescan.org/address/${walletAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-green-400 hover:text-green-300 underline mt-1 inline-block"
          >
            View on BaseScan →
          </a>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">USDC Balance</p>
          <p className="text-2xl font-bold text-white">
            {balance !== null ? `$${balance}` : '—'}
            <span className="text-sm text-gray-400 ml-2 font-normal">USDC</span>
          </p>
        </div>
      </div>
    </div>
  );
}
