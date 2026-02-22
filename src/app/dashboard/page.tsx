'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createPublicClient, http, erc20Abi } from 'viem';
import { base } from 'viem/chains';
import { WalletCard } from './WalletCard';
import { BidHistory } from './BidHistory';
import { EmailLinkCard } from './EmailLinkCard';
import { WithdrawForm } from './WithdrawForm';

const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const;

const publicClient = createPublicClient({
  chain: base,
  transport: http('https://mainnet.base.org'),
});

interface Bid {
  id: number;
  auction_id: number;
  url: string;
  amount: string;
  tx_hash: string | null;
  status: 'pending' | 'confirmed' | 'failed';
  created_at: string;
}

export default function DashboardPage() {
  const { ready, authenticated, user, logout, getAccessToken } = usePrivy();
  const router = useRouter();
  const [balance, setBalance] = useState<string | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (ready && !authenticated) {
      router.replace('/');
    }
  }, [ready, authenticated, router]);

  // Get wallet address directly from the Privy user object (no API call needed)
  const embeddedWallet = user?.linkedAccounts.find(
    (a) => a.type === 'wallet' && 'walletClientType' in a && a.walletClientType === 'privy'
  );
  const walletAddress = 'address' in (embeddedWallet ?? {}) ? (embeddedWallet as { address: string }).address : null;

  const fetchBalance = useCallback(async () => {
    if (!walletAddress) return;
    try {
      const rawBalance = await publicClient.readContract({
        address: USDC_ADDRESS,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [walletAddress as `0x${string}`],
      });
      setBalance((Number(rawBalance) / 1e6).toFixed(2));
    } catch {
      setBalance(null);
    }
  }, [walletAddress]);

  const fetchBids = useCallback(async () => {
    if (!authenticated) return;
    try {
      const token = await getAccessToken();
      const res = await fetch('/api/user/bids', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBids(data.bids ?? []);
      }
    } catch {
      // leave bids empty
    }
  }, [authenticated, getAccessToken]);

  useEffect(() => {
    if (!authenticated) return;
    setLoadingData(true);
    Promise.all([fetchBalance(), fetchBids()]).finally(() => setLoadingData(false));
  }, [authenticated, fetchBalance, fetchBids]);

  const handleWithdrawSuccess = useCallback(() => {
    fetchBalance();
    fetchBids();
  }, [fetchBalance, fetchBids]);

  const twitterAccount = user?.linkedAccounts.find((a) => a.type === 'twitter_oauth');
  const farcasterAccount = user?.linkedAccounts.find((a) => a.type === 'farcaster');
  const displayHandle = twitterAccount?.type === 'twitter_oauth'
    ? `@${twitterAccount.username}`
    : farcasterAccount?.type === 'farcaster'
      ? `@${farcasterAccount.username}`
      : null;

  if (!ready || !authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 flex items-center justify-center">
        <div className="text-green-400 font-mono">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Dashboard <span className="text-green-400">🌿</span>
              </h1>
              {displayHandle && (
                <p className="text-gray-400 text-sm mt-1">{displayHandle}</p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                ← Home
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>

          {loadingData ? (
            <div className="text-green-400 font-mono text-center py-12">Loading your data…</div>
          ) : (
            <div className="space-y-6">
              {/* Top row: Wallet + Email linking */}
              <div className="grid md:grid-cols-2 gap-6">
                <WalletCard
                  walletAddress={walletAddress}
                  balance={balance}
                />
                <EmailLinkCard />
              </div>

              {/* Withdraw */}
              {walletAddress && (
                <WithdrawForm
                  balance={balance}
                  onWithdrawSuccess={handleWithdrawSuccess}
                />
              )}

              {/* Bid History */}
              <BidHistory bids={bids} />
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 text-center text-green-400 font-mono text-sm">
            <p>Hash by hash, block by block. 🌿</p>
          </div>
        </div>
      </div>
    </div>
  );
}
